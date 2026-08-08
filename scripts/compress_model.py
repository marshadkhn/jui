import DracoPy, json, struct, os, numpy as np

def compress_glb():
    workspace_root = 'd:/FREELANCING/MAGIC TEAL/JUImain'
    input_path = os.path.join(workspace_root, 'public/final_models/Note_printer_original.glb')
    output_path = os.path.join(workspace_root, 'public/final_models/Note_printer.glb')

    print(f"Reading original GLB: {input_path}...")
    with open(input_path, 'rb') as f:
        data = f.read()

    json_len = struct.unpack('<I', data[12:16])[0]
    json_text = data[20:20+json_len].decode('utf-8')
    gltf = json.loads(json_text)
    bin_offset = 20 + json_len + 8
    raw_bin = data[bin_offset:]

    print(f"Original GLB size: {len(data) / 1024 / 1024:.2f} MB")

    # Map of mesh primitives to compress
    # Primitive 1 in Primitive 3 is the 9.6M vertex CAD mesh
    new_bin_chunks = []
    new_buffer_views = list(gltf['bufferViews'])
    
    # We will reconstruct the BIN buffer cleanly
    current_bin_offset = 0
    
    for bv_idx, bv in enumerate(gltf['bufferViews']):
        orig_bytes = raw_bin[bv['byteOffset'] : bv['byteOffset'] + bv['byteLength']]
        
        # Check if this bufferView is the 9.6M Draco buffer (Primitive 1 in Cylinder.031)
        if len(orig_bytes) > 50 * 1024 * 1024:
            print(f"Compressing heavy Draco BufferView #{bv_idx} ({len(orig_bytes)/1024/1024:.2f} MB)...")
            decoded = DracoPy.decode(orig_bytes)
            faces = np.array(decoded.faces, dtype=np.uint32)
            points = np.array(decoded.points, dtype=np.float64)
            normals = np.array(decoded.normals, dtype=np.float64) if len(decoded.normals) > 0 else None
            tex = np.array(decoded.tex_coord, dtype=np.float64) if len(decoded.tex_coord) > 0 else None

            # Decimate by factor of 35 (drops ~9.6M verts to ~270k verts)
            sub_faces = faces[::35]
            unique_indices, new_faces = np.unique(sub_faces, return_inverse=True)
            new_faces = new_faces.reshape(-1, 3).astype(np.uint32)
            new_points = np.ascontiguousarray(points[unique_indices], dtype=np.float64)
            new_normals = np.ascontiguousarray(normals[unique_indices], dtype=np.float64) if (normals is not None and len(normals) == len(points)) else None
            new_tex = np.ascontiguousarray(tex[unique_indices], dtype=np.float64) if (tex is not None and len(tex) == len(points)) else None

            compressed_bytes = DracoPy.encode(
                new_points,
                new_faces,
                normals=new_normals,
                tex_coord=new_tex,
                quantization_bits=11,
                compression_level=5
            )
            print(f"Compressed BufferView #{bv_idx} to {len(compressed_bytes)/1024/1024:.2f} MB!")
            
            # Update accessor counts if referenced
            for acc in gltf['accessors']:
                if acc.get('bufferView') == bv_idx:
                    acc['count'] = len(new_points)

            bv_bytes = compressed_bytes
        else:
            bv_bytes = orig_bytes

        # Align to 4-byte boundary
        padding = (4 - (len(bv_bytes) % 4)) % 4
        padded_bytes = bv_bytes + b'\x00' * padding

        new_buffer_views[bv_idx]['byteOffset'] = current_bin_offset
        new_buffer_views[bv_idx]['byteLength'] = len(bv_bytes)
        new_bin_chunks.append(padded_bytes)
        current_bin_offset += len(padded_bytes)

    gltf['bufferViews'] = new_buffer_views
    gltf['buffers'][0]['byteLength'] = current_bin_offset

    new_json_bytes = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    json_padding = (4 - (len(new_json_bytes) % 4)) % 4
    new_json_padded = new_json_bytes + b' ' * json_padding

    new_bin_data = b''.join(new_bin_chunks)

    header_magic = b'glTF'
    header_version = struct.pack('<I', 2)
    total_length = 12 + 8 + len(new_json_padded) + 8 + len(new_bin_data)
    header_total_len = struct.pack('<I', total_length)

    json_chunk_hdr = struct.pack('<I', len(new_json_padded)) + b'JSON'
    bin_chunk_hdr = struct.pack('<I', len(new_bin_data)) + b'BIN\x00'

    final_glb = header_magic + header_version + header_total_len + json_chunk_hdr + new_json_padded + bin_chunk_hdr + new_bin_data

    with open(output_path, 'wb') as f:
        f.write(final_glb)

    print(f"COMPRESSION COMPLETE!")
    print(f"Final output saved to: {output_path}")
    print(f"Original size: {len(data)/1024/1024:.2f} MB -> New size: {len(final_glb)/1024/1024:.2f} MB")

if __name__ == '__main__':
    compress_glb()
