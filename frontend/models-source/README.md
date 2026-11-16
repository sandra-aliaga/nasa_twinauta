# Modelo anatómico: original y versión publicada

El GLB original de Innerscene Corp (CC0 1.0 según `asset.copyright`) no se incluye en Git por su tamaño. La app sirve la versión optimizada en `public/models/`.

La app carga `public/models/full-body-muscular-system-superficial-layer.min.glb` (2,6 MB), generado así:

1. Texturas base PNG (RGB, 2048 px, sin transparencia) a JPEG calidad 88:
   `python png2jpg_glb.py full-body-muscular-system-superficial-layer.glb jpg.glb 88`
2. Geometría con meshopt, sin fusionar mallas ni nodos (la selección depende del nombre de cada músculo):
   `npx @gltf-transform/cli@4.1.1 optimize jpg.glb out.glb --compress meshopt --texture-compress false --simplify false --join false --flatten false --instance false --palette false`

Se comprobó que conserva 158 nodos, 157 mallas, los nombres de los músculos del cuádriceps y el aviso de licencia. drei decodifica meshopt localmente, sin descargas externas. La compresión de texturas a WebP de gltf-transform falló en Windows (error de libvips), por eso el paso 1 usa Pillow.
