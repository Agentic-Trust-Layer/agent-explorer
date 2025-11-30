# Cursor Rules

- Do not invent or infer field/property names. If a field is not defined on a referenced class, interface, or schema, stop and ask for clarification or file an issue instead of guessing.
- When adding data-mapping logic, rely only on documented fields (e.g., those in the ERC-8004 spec or our TypeScript interfaces) and avoid heuristics that scan unrelated keys.
