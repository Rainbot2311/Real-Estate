from PIL import Image
import numpy as np
from collections import deque

src_path = r"c:\Users\user\Downloads\TRY-rEAL-eSTAE\assets\homelo-villa.png"
dest_path = r"c:\Users\user\Downloads\TRY-rEAL-eSTAE\assets\homelo-villa.png"

img = Image.open(src_path).convert("RGBA")
arr = np.array(img)

r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

# Any pixel already transparent or light background
# In the sky/upper part, anything with r > 160, g > 160, b > 160 is background!
h, w = r.shape
is_bg_candidate = (a == 0) | ((r > 160) & (g > 160) & (b > 160) & (np.abs(r.astype(int) - g.astype(int)) < 15))

# Flood fill from the outer boundary
visited = np.zeros((h, w), dtype=bool)
bg_mask = np.zeros((h, w), dtype=bool)
q = deque()

for x in range(w):
    if is_bg_candidate[0, x]:
        q.append((0, x))
        visited[0, x] = True
    if is_bg_candidate[h-1, x]:
        q.append((h-1, x))
        visited[h-1, x] = True

for y in range(h):
    if is_bg_candidate[y, 0] and not visited[y, 0]:
        q.append((y, 0))
        visited[y, 0] = True
    if is_bg_candidate[y, w-1] and not visited[y, w-1]:
        q.append((y, w-1))
        visited[y, w-1] = True

while q:
    cy, cx = q.popleft()
    bg_mask[cy, cx] = True
    
    for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < h and 0 <= nx < w:
            if not visited[ny, nx] and is_bg_candidate[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

arr[bg_mask, 3] = 0

out_img = Image.fromarray(arr)
out_img.save(dest_path, "PNG")
print("Perfect transparent PNG saved!")
