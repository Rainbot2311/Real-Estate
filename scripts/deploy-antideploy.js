const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_BASE = 'https://antideploy.com/api/v1';
const TOKEN_FILE = path.join(__dirname, '..', '.antideploy_token.json');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getOrPollToken(deviceCode) {
  if (fs.existsSync(TOKEN_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
      if (data.token) {
        console.log('[Antideploy] Found existing saved token.');
        return data.token;
      }
    } catch (e) {}
  }

  console.log(`[Antideploy] Polling for approval for deviceCode: ${deviceCode.slice(0, 8)}...`);
  const startTime = Date.now();
  const maxWaitMs = 15 * 60 * 1000;

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const res = await fetch(`${API_BASE}/device/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceCode }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token: data.token }, null, 2));
        console.log('[Antideploy] Authorization granted! Token saved securely.');
        return data.token;
      }

      if (data.code === 'authorization_pending' || data.error === 'authorization_pending') {
        const interval = (data.interval || 5) * 1000;
        await sleep(interval);
        process.stdout.write('.');
        continue;
      }

      throw new Error(`Unexpected token error: ${JSON.stringify(data)}`);
    } catch (err) {
      if (err.message && err.message.includes('authorization_pending')) {
        await sleep(5000);
        continue;
      }
      throw err;
    }
  }

  throw new Error('Timed out waiting for authorization.');
}

async function createOrGetApplication(token, name) {
  console.log(`\n[Antideploy] Ensuring application "${name}" exists...`);
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, subdomain: name }),
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`[Antideploy] Created application: ${data.name} (ID: ${data.applicationId})`);
    return data;
  }

  if (res.status === 409 && data.applicationId) {
    console.log(`[Antideploy] Using existing application: ${name} (ID: ${data.applicationId})`);
    return data;
  }

  // If name taken or listing required
  const listRes = await fetch(`${API_BASE}/applications`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (listRes.ok) {
    const listData = await listRes.json();
    const apps = Array.isArray(listData) ? listData : listData.applications || [];
    const existing = apps.find((a) => a.name === name);
    if (existing) {
      console.log(`[Antideploy] Found existing application: ${existing.name} (ID: ${existing.applicationId})`);
      return existing;
    }
  }

  throw new Error(`Failed to create application: ${JSON.stringify(data)}`);
}

async function deploy(token, applicationId) {
  const rootDir = path.resolve(__dirname, '..');
  const bundlePath = path.join(rootDir, 'bundle.tar.gz');

  console.log('[Antideploy] Packaging project into bundle.tar.gz...');
  if (fs.existsSync(bundlePath)) {
    fs.unlinkSync(bundlePath);
  }

  execSync(`tar.exe -czf bundle.tar.gz --exclude=.git --exclude=node_modules --exclude=bundle.tar.gz --exclude=.antideploy_token.json --exclude=scripts --exclude=server.js --exclude=package.json --exclude=package-lock.json --exclude=components .`, {
    cwd: rootDir,
    stdio: 'inherit',
  });

  console.log('[Antideploy] Uploading project bundle to Antideploy...');
  const curlCmd = `curl.exe -s -X POST "${API_BASE}/deploy?applicationId=${applicationId}" -H "Authorization: Bearer ${token}" -F "archive=@${bundlePath}"`;
  const uploadOut = execSync(curlCmd, { cwd: rootDir }).toString();

  let uploadResult;
  try {
    uploadResult = JSON.parse(uploadOut);
  } catch (e) {
    throw new Error(`Upload response was not JSON: ${uploadOut}`);
  }

  console.log('[Antideploy] Upload response:', JSON.stringify(uploadResult));

  // Clean up local bundle
  if (fs.existsSync(bundlePath)) {
    fs.unlinkSync(bundlePath);
  }

  const taskId = uploadResult.taskId || uploadResult.id || uploadResult.deploymentId;
  if (!taskId) {
    if (uploadResult.url) {
      return uploadResult;
    }
    throw new Error(`No taskId found in response: ${JSON.stringify(uploadResult)}`);
  }

  console.log(`[Antideploy] Deployment task started (${taskId}). Monitoring progress...`);
  return await pollDeployment(token, taskId);
}

async function pollDeployment(token, taskId) {
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(3000);
    const res = await fetch(`${API_BASE}/deployments/${taskId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) {
      console.log(`[Antideploy] Status check returned ${res.status}. Retrying...`);
      continue;
    }

    const task = await res.json();
    console.log(`[Antideploy] Status: ${task.status || 'running'} ${task.stage ? `(${task.stage})` : ''}`);

    if (task.status === 'succeeded' || task.status === 'ready' || task.status === 'success') {
      return task;
    }
    if (task.status === 'failed' || task.status === 'error') {
      throw new Error(`Deployment failed: ${JSON.stringify(task)}`);
    }
  }

  throw new Error('Deployment polling timed out.');
}

async function main() {
  const deviceCode = process.argv[2] || '1tcls8SlyCtHitgHaoUAM68U3cO-cz2UzK-J5uq60-Y';
  const appName = process.argv[3] || 'avenza-estates';

  const token = await getOrPollToken(deviceCode);
  const app = await createOrGetApplication(token, appName);
  const result = await deploy(token, app.applicationId);

  const liveUrl = result.url || (result.application && result.application.url) || app.url || `https://${appName}.antideploy.app`;
  console.log('\n========================================');
  console.log(' Deployment Complete!');
  console.log(` Live URL: ${liveUrl}`);
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('\n[Antideploy] Error:', err.message);
  process.exit(1);
});
