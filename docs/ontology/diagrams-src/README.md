# Diagram sources (Turtle)

These `.ttl` files are **minimal ontology fragments** used only to generate readable diagrams with `ontogram`.

- They intentionally include only the classes/properties needed for a given diagram.
- Render output (PNG/SVG) is copied into `docs/ontology/images/`.

To regenerate (requires Python + venv):

```bash
cd /home/barb/erc8004/agent-explorer
python3 -m venv .venv-ontogram
. .venv-ontogram/bin/activate
pip install -U ontogram

for f in docs/ontology/diagrams-src/*.ttl; do
  ontogram "$f" --format turtle
done
```


