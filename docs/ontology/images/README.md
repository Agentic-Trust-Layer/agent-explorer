# Ontology diagrams (images)

These images are generated from the ontology source files using [`ontogram`](https://pypi.org/project/ontogram/).

## Files

- `core.svg` / `core.png`
- `ERC8004.svg` / `ERC8004.png`
- `ERC8092.svg` / `ERC8092.png`
- `sections/*.png` / `sections/*.svg` (smaller diagrams used throughout `docs/ontology/*.md`)

If you want to regenerate:

```bash
python3 -m venv .venv-ontogram
. .venv-ontogram/bin/activate
pip install -U ontogram

ontogram apps/ontology/ontology/core.ttl --format turtle
ontogram apps/ontology/ontology/erc8004.ttl --format turtle
ontogram apps/ontology/ontology/erc8092.ttl --format turtle
```


