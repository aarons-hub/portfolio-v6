How to generate app icons for the manifest

This project expects the following files under `public/images/`:

- `icons-192.png` (192x192)
- `icons-512.png` (512x512)
- `icon.svg` (optional SVG source)

If you have a single high-resolution source image (e.g. `logo.svg` or `logo.png`) you can generate the PNG icons using ImageMagick:

# From an SVG source (preferred when available):

magick convert logo.svg -background none -resize 192x192 public/images/icons-192.png
magick convert logo.svg -background none -resize 512x512 public/images/icons-512.png

# From a large PNG source (e.g. 2048x2048):

magick convert logo-2048.png -resize 192x192 public/images/icons-192.png
magick convert logo-2048.png -resize 512x512 public/images/icons-512.png

# Optional optimization (smaller files):

# Using pngquant (install separately):

pngquant --force --output public/images/icons-192.png --quality=65-80 public/images/icons-192.png
pngquant --force --output public/images/icons-512.png --quality=65-80 public/images/icons-512.png

Notes:

- The manifest uses relative paths, so when deployed under a subpath (e.g. GitHub Pages) the files will resolve relative to the manifest location.
- Provide PNGs for best compatibility; the SVG is a useful fallback/authoring source but not all platforms use SVG icons for installed apps.
- Recommended sizes: at least 192x192 and 512x512. You can provide additional sizes if desired.

After placing the files, open Chrome DevTools -> Application -> Manifest to verify the icons load correctly.
