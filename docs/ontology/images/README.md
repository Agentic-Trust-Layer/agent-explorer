# Ontology diagrams (images)

These images are generated from the ontology source files using [`ontogram`](https://pypi.org/project/ontogram/).

## Files

- `agentictrust.svg` / `agentictrust.png`
- `ERC8004.svg` / `ERC8004.png`
- `ERC8092.svg` / `ERC8092.png`
- `sections/*.png` / `sections/*.svg` (smaller diagrams used throughout `docs/ontology/*.md`)

If you want to regenerate:

```bash
python3 -m venv .venv-ontogram
. .venv-ontogram/bin/activate
pip install -U ontogram

ontogram apps/badge-admin/public/ontology/agentictrust.owl --format turtle
ontogram apps/badge-admin/public/ontology/ERC8004.owl --format turtle
ontogram apps/badge-admin/public/ontology/ERC8092.owl --format turtle
```


