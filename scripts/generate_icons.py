#!/usr/bin/env python3
"""Generate PulseGrid favicons from scratch using Pillow (no Inkscape/cairosvg needed)."""

import math
from PIL import Image, ImageDraw

def draw_icon(size: int) -> Image.Image:
    """Draw the activity-pulse icon on a dark rounded-rect background."""
    scale = size / 32.0          # design was drawn on 32px grid
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # --- Background: dark rounded rectangle ---
    bg_color = (16, 19, 26, 255)          # #10131A
    radius = max(1, round(8 * scale))
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=bg_color)

    # --- Activity / pulse path ---
    # Points based on 32px grid, scaled up:
    # M7,16  H10.5  L14,7.5  L19.5,24.5  L23,16  H25
    teal = (20, 184, 166, 255)            # matches Lucide Activity colour in navbar
    points_32 = [(7,16), (10.5,16), (14,7.5), (19.5,24.5), (23,16), (25,16)]
    points = [(round(x * scale), round(y * scale)) for x, y in points_32]
    lw = max(1, round(2.5 * scale))
    draw.line(points, fill=teal, width=lw, joint="curve")

    return img

sizes = [16, 32, 48, 64, 192, 512]
imgs = {s: draw_icon(s) for s in sizes}

# Save individual PNGs
imgs[192].save("public/icon-192.png", "PNG")
imgs[512].save("public/icon-512.png", "PNG")
print("Saved icon-192.png and icon-512.png")

# Save favicon.ico (contains 16, 32, 48px layers)
imgs[16].save(
    "app/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=[imgs[32], imgs[48]],
)
print("Saved favicon.ico")
