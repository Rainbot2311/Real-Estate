import os
from PIL import Image

assets_dir = 'assets'

def optimize_images():
    total_before = 0
    total_after = 0
    
    for filename in os.listdir(assets_dir):
        filepath = os.path.join(assets_dir, filename)
        if not os.path.isfile(filepath):
            continue
            
        size_before = os.path.getsize(filepath)
        total_before += size_before
        
        try:
            with Image.open(filepath) as img:
                orig_format = img.format
                
                # Avatars
                if filename.startswith('avatar-'):
                    img = img.convert('RGB')
                    img.thumbnail((320, 320), Image.Resampling.LANCZOS)
                    img.save(filepath, format='JPEG', quality=88, optimize=True, progressive=True)
                
                # Hero building & house PNGs with alpha
                elif filename == 'house.png':
                    if img.mode != 'RGBA':
                        img = img.convert('RGBA')
                    img.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
                    img.save(filepath, format='PNG', optimize=True, compress_level=9)
                    
                elif filename == 'homelo-villa.png':
                    if img.mode != 'RGBA':
                        img = img.convert('RGBA')
                    img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                    img.save(filepath, format='PNG', optimize=True, compress_level=9)
                    
                # Other JPEGs
                elif filename.endswith(('.jpg', '.jpeg')):
                    img = img.convert('RGB')
                    w, h = img.size
                    if w > 1600 or h > 1600:
                        img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                    img.save(filepath, format='JPEG', quality=85, optimize=True, progressive=True)
                    
            size_after = os.path.getsize(filepath)
            total_after += size_after
            saved_pct = (1 - size_after / size_before) * 100 if size_before > 0 else 0
            print(f"Optimized {filename}: {size_before/1024:.1f} KB -> {size_after/1024:.1f} KB ({saved_pct:.1f}% saved)")
        except Exception as e:
            print(f"Error optimizing {filename}: {e}")
            total_after += size_before

    print(f"\nTotal size: {total_before/1024/1024:.2f} MB -> {total_after/1024/1024:.2f} MB")
    print(f"Total saved: {(1 - total_after/total_before)*100:.1f}%")

if __name__ == '__main__':
    optimize_images()
