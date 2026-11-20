import os
from PIL import Image
import numpy as np
from collections import deque

src_path = r"C:\Users\user\.gemini\antigravity-ide\brain\4d19ff1c-8d74-4e29-b252-902fad442ecb\homelo_villa_cutout_1790749120167.jpg"
dest_path = r"c:\Users\user\Downloads\TRY-rEAL-eSTAE\assets\homelo-villa.png"

img = Image.open(src_path).convert("RGBA")
arr = np.array(img)

r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

# In JPEG, checkerboard tones have slight compression artifacts:
# Light squares: ~245-255
# Dark squares: ~190-218
diff_rg = np.abs(r.astype(int) - g.astype(int))
diff_gb = np.abs(g.astype(int) - b.astype(int))
is_neutral = (diff_rg <= 12) & (diff_gb <= 12)

is_gray_checker = is_neutral & (r >= 180) & (r <= 225)
is_white_checker = is_neutral & (r >= 235)
is_checker = is_gray_checker | is_white_checker

h, w = is_checker.shape
visited = np.zeros((h, w), dtype=bool)
bg_mask = np.zeros((h, w), dtype=bool)

q = deque()

for x in range(w):
    if is_checker[0, x]:
        q.append((0, x))
        visited[0, x] = True
    if is_checker[h-1, x]:
        q.append((h-1, x))
        visited[h-1, x] = True

for y in range(h):
    if is_checker[y, 0] and not visited[y, 0]:
        q.append((y, 0))
        visited[y, 0] = True
    if is_checker[y, w-1] and not visited[y, w-1]:
        q.append((y, w-1))
        visited[y, w-1] = True

while q:
    cy, cx = q.popleft()
    bg_mask[cy, cx] = True
    
    for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < h and 0 <= nx < w:
            if not visited[ny, nx] and is_checker[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

arr[bg_mask, 3] = 0

out_img = Image.fromarray(arr)
out_img.save(dest_path, "PNG")
print("Saved transparent PNG to", dest_path)
