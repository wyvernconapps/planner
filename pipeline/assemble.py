#!/usr/bin/env python3
"""
Assemble index.html from shell.html + data-slim.json.

The schedule ships gzipped and base64'd rather than as raw JSON: full panel
descriptions at roughly half the bytes. shell.html carries a "__DATA__"
placeholder which this replaces.

    python3 assemble.py

Writes index.html to the repo root (one level up from pipeline/).
"""
import base64
import gzip
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).parent
shell_path = HERE / 'shell.html'
data_path = HERE / 'data-slim.json'
out_path = HERE.parent / 'index.html'

if not shell_path.exists():
    sys.exit('shell.html not found — it is the source, index.html is generated')
if not data_path.exists():
    sys.exit('data-slim.json not found — run build_data.py then build_slim.js first')

shell = shell_path.read_text(encoding='utf-8')
if '"__DATA__"' not in shell:
    sys.exit('shell.html has no "__DATA__" placeholder — is it already built?')

data = json.load(data_path.open(encoding='utf-8'))
raw = json.dumps(data, separators=(',', ':'), ensure_ascii=False).encode()
# mtime=0 keeps the build reproducible: gzip otherwise stamps the current
# time into its header, so an unchanged app still produced a different file
# and git saw a diff on every rebuild.
_gz = bytearray(gzip.compress(raw, 9, mtime=0))
_gz[9] = 3  # normalise gzip OS byte (Windows=10) to Unix=3 so builds
            # are byte-identical regardless of the machine they run on
b64 = base64.b64encode(bytes(_gz)).decode()

out = shell.replace('"__DATA__"', '"' + b64 + '"')
# write bytes, not text: pathlib.write_text would translate \n -> \r\n on
# Windows, changing every line ending versus a Linux-built file
out_path.write_bytes(out.encode('utf-8'))

print(f'  raw payload : {len(raw) // 1024} KB')
print(f'  compressed  : {len(b64) // 1024} KB  ({round(len(b64) / len(raw) * 100)}%)')
print(f'  index.html  : {len(out.encode()) // 1024} KB')
print(f'  build stamp : {data.get("built", "unknown")}')
