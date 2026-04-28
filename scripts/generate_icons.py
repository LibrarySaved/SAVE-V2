"""
Generate official icons for the "saved." app.
Style: minimalist, dark background (#0F0F12), purple accent (#8B5CF6 - midnight preset).
Icon: rounded square with white bookmark glyph, period accent dot.
Sizes: 16, 32, 48, 64, 128, 192, 256, 512 (PNG)
Plus: favicon.ico (multi-resolution).
"""
import os
from PIL import Image, ImageDraw

# Brand
BG = (15, 15, 18, 255)         # #0F0F12 - dark canvas
PRIMARY = (139, 92, 246, 255)  # #8B5CF6 - purple (midnight preset)
WHITE = (255, 255, 255, 255)
ACCENT = (196, 181, 253, 255)  # #C4B5FD - light purple for the dot

PUBLIC_DIR = "/app/frontend/public"
EXT_ICONS_DIR = "/app/browser-extension/icons"

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(EXT_ICONS_DIR, exist_ok=True)


def round_rect(draw, xy, radius, fill):
    """Draw rounded rectangle."""
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def make_icon(size: int) -> Image.Image:
    """Create one icon at given size."""
    # Use 4x supersampling for crisp edges
    scale = 4 if size <= 128 else 2
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded square background — solid primary purple
    radius = int(s * 0.22)
    round_rect(draw, (0, 0, s, s), radius=radius, fill=PRIMARY)

    # Bookmark glyph (centered, white)
    # Bookmark shape: rectangle with a triangular notch at the bottom
    bw = int(s * 0.38)
    bh = int(s * 0.52)
    bx0 = (s - bw) // 2
    by0 = int(s * 0.20)
    bx1 = bx0 + bw
    by1 = by0 + bh

    # Outer bookmark (white)
    notch = int(bh * 0.28)
    bookmark = [
        (bx0, by0),
        (bx1, by0),
        (bx1, by1),
        ((bx0 + bx1) // 2, by1 - notch),
        (bx0, by1),
    ]
    draw.polygon(bookmark, fill=WHITE)

    # The "." accent dot — bottom right of the icon, primary accent color
    dot_r = max(1, int(s * 0.06))
    cx = int(s * 0.78)
    cy = int(s * 0.78)
    draw.ellipse((cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r), fill=ACCENT)

    # Downsample for anti-aliasing
    if scale > 1:
        img = img.resize((size, size), Image.LANCZOS)
    return img


def make_maskable(size: int) -> Image.Image:
    """Maskable version: solid bg edge-to-edge for safe area."""
    scale = 4 if size <= 128 else 2
    s = size * scale
    img = Image.new("RGBA", (s, s), PRIMARY)  # full bleed
    draw = ImageDraw.Draw(img)

    # Bookmark in safe zone (centered, ~60% of canvas)
    bw = int(s * 0.30)
    bh = int(s * 0.42)
    bx0 = (s - bw) // 2
    by0 = int(s * 0.27)
    bx1 = bx0 + bw
    by1 = by0 + bh
    notch = int(bh * 0.28)
    bookmark = [
        (bx0, by0), (bx1, by0), (bx1, by1),
        ((bx0 + bx1) // 2, by1 - notch),
        (bx0, by1),
    ]
    draw.polygon(bookmark, fill=WHITE)

    dot_r = max(1, int(s * 0.05))
    cx = int(s * 0.72)
    cy = int(s * 0.72)
    draw.ellipse((cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r), fill=ACCENT)

    if scale > 1:
        img = img.resize((size, size), Image.LANCZOS)
    return img


# Standard sizes
SIZES = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512]

# 1) Public folder PNGs (saved-icon-{size}.png)
for sz in SIZES:
    icon = make_icon(sz)
    icon.save(os.path.join(PUBLIC_DIR, f"icon-{sz}.png"), "PNG", optimize=True)

# 2) Standard React/PWA filenames
make_icon(192).save(os.path.join(PUBLIC_DIR, "logo192.png"), "PNG", optimize=True)
make_icon(512).save(os.path.join(PUBLIC_DIR, "logo512.png"), "PNG", optimize=True)

# 3) Maskable for PWA
make_maskable(192).save(os.path.join(PUBLIC_DIR, "icon-maskable-192.png"), "PNG", optimize=True)
make_maskable(512).save(os.path.join(PUBLIC_DIR, "icon-maskable-512.png"), "PNG", optimize=True)

# 4) Apple touch icon (180px)
make_icon(180).save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG", optimize=True)

# 5) favicon.ico (multi-res)
favicon_sizes = [16, 32, 48, 64]
favicon_imgs = [make_icon(sz) for sz in favicon_sizes]
favicon_imgs[0].save(
    os.path.join(PUBLIC_DIR, "favicon.ico"),
    format="ICO",
    sizes=[(sz, sz) for sz in favicon_sizes],
    append_images=favicon_imgs[1:],
)

# 6) Browser extension icons
for sz in [16, 32, 48, 128]:
    make_icon(sz).save(os.path.join(EXT_ICONS_DIR, f"icon{sz}.png"), "PNG", optimize=True)

print("Icons generated:")
for f in sorted(os.listdir(PUBLIC_DIR)):
    if f.endswith((".png", ".ico")):
        path = os.path.join(PUBLIC_DIR, f)
        print(f"  {f}: {os.path.getsize(path)} bytes")
print("\nExtension icons:")
for f in sorted(os.listdir(EXT_ICONS_DIR)):
    path = os.path.join(EXT_ICONS_DIR, f)
    print(f"  {f}: {os.path.getsize(path)} bytes")
