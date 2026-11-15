"""Re-encode embedded PNG base-color textures of a GLB as JPEG."""
import io, json, struct, sys
from PIL import Image

src, dst, quality = sys.argv[1], sys.argv[2], int(sys.argv[3])
data = open(src, "rb").read()
json_len = struct.unpack("<I", data[12:16])[0]
gltf = json.loads(data[20:20 + json_len])
bin_hdr = 20 + json_len
bin_len = struct.unpack("<I", data[bin_hdr:bin_hdr + 4])[0]
blob = data[bin_hdr + 8:bin_hdr + 8 + bin_len]
assert len(gltf["buffers"]) == 1 and "uri" not in gltf["buffers"][0]

views = gltf["bufferViews"]
chunks = [blob[v.get("byteOffset", 0):v.get("byteOffset", 0) + v["byteLength"]] for v in views]
for image in gltf["images"]:
    if image.get("mimeType") != "image/png":
        continue
    im = Image.open(io.BytesIO(chunks[image["bufferView"]])).convert("RGB")
    out = io.BytesIO()
    im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    chunks[image["bufferView"]] = out.getvalue()
    image["mimeType"] = "image/jpeg"

new_blob = bytearray()
for view, chunk in zip(views, chunks):
    while len(new_blob) % 4:
        new_blob.append(0)
    view["byteOffset"] = len(new_blob)
    view["byteLength"] = len(chunk)
    new_blob += chunk
while len(new_blob) % 4:
    new_blob.append(0)
gltf["buffers"][0]["byteLength"] = len(new_blob)

js = json.dumps(gltf, separators=(",", ":")).encode()
js += b" " * ((4 - len(js) % 4) % 4)
total = 12 + 8 + len(js) + 8 + len(new_blob)
with open(dst, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, total))
    f.write(struct.pack("<I4s", len(js), b"JSON")); f.write(js)
    f.write(struct.pack("<I4s", len(new_blob), b"BIN\x00")); f.write(new_blob)
print("written", dst, total)
