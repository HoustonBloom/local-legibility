---
type: instructions
subject: public-assets
for: [human, ai]
visibility: local
---
# Public assets

Drop images, illustrations, downloadable PDFs, or other binary assets here when they need to be referenced by published frames in `03_cuts/00_public/`.

The packet ships this folder empty. Add what your project needs.

Reference assets from a frame using a relative path:

```html
<img src="../00_assets/your-image.png" alt="...">
```

For frames inside a sibling subfolder of `00_public/` (e.g. `03_cuts/00_public/your-deliverable/index.html`):

```html
<img src="../00_assets/your-image.png" alt="...">
```

## Naming

Use kebab-case lowercase. Group related assets with a shared prefix.

```
brand-logo.svg
brand-logo-dark.svg
hero-illustration-01.png
hero-illustration-02.png
diagram-system-overview.svg
```

## What does NOT belong here

- Source files (Figma, Illustrator, Photoshop). Keep those in your working folder, not the shipped packet.
- Personal photos. Use a separate, gated folder if you need them.
- Anything you do not want public. The folder name `00_public/` is a contract: assume anything in it can be shared.
