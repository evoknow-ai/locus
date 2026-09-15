"""Build a deterministic Locus ZIP from the repository without git or local backups."""
from pathlib import Path
import json
import zipfile
root=Path(__file__).resolve().parents[1]
version=json.loads((root/'manifest.json').read_text())['version']
out=root/'dist'/f'Locus-{version}.zip'
out.parent.mkdir(exist_ok=True)
files=[p for p in root.rglob('*') if p.is_file() and not any(part in {'.git','dist','node_modules','__pycache__','.github'} for part in p.relative_to(root).parts)]
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(files):
        info=zipfile.ZipInfo(str(p.relative_to(root)),(2026,9,15,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        info.external_attr=0o644<<16
        z.writestr(info,p.read_bytes())
print(out)
