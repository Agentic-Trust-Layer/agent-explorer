# OASF Extension Setup for Trust Skills

## File Structure

Create these files in your OASF fork at the root level:

```
schema/
  extensions/
    orgtrust/
      extension.json
      main_skills.json
      skills/
        trust/
          trust_validate_name.json
          trust_validate_account.json
          trust_validate_app.json
```

## File Contents

### 1. `schema/extensions/orgtrust/extension.json`

```json
{
  "caption": "OrgTrust Extension",
  "name": "orgtrust",
  "uid": 8010,
  "version": "0.0.0"
}
```

### 2. `schema/extensions/orgtrust/main_skills.json`

```json
{
  "caption": "OrgTrust Skills",
  "name": "orgtrust_skills",
  "uid": 801000,
  "categories": {
    "trust": {
      "caption": "Trust",
      "description": "Trust and verification capabilities such as name/account/app validation.",
      "uid": 801100
    }
  }
}
```

### 3. `schema/extensions/orgtrust/skills/trust/trust_validate_name.json`

```json
{
  "caption": "Validate Name",
  "description": "Validates a claimed human/org name (formatting, uniqueness, proof, policy checks, etc.).",
  "extends": "base_skill",
  "name": "trust_validate_name",
  "uid": 801101
}
```

### 4. `schema/extensions/orgtrust/skills/trust/trust_validate_account.json`

```json
{
  "caption": "Validate Account",
  "description": "Validates an account identifier (e.g., wallet/account binding, control proofs, status, policy).",
  "extends": "base_skill",
  "name": "trust_validate_account",
  "uid": 801102
}
```

### 5. `schema/extensions/orgtrust/skills/trust/trust_validate_app.json`

```json
{
  "caption": "Validate App",
  "description": "Validates an app identity (publisher, signature, supply chain, provenance, policy conformance).",
  "extends": "base_skill",
  "name": "trust_validate_app",
  "uid": 801103
}
```

## After Creating Files

1. Commit and push to your fork
2. Run the sync:

```bash
cd /home/barb/erc8004/agent-explorer/apps/indexer && \
GITHUB_TOKEN="your_token" \
OASF_REPO="your_github_username/oasf" \
OASF_REF="main" \
pnpm -s skills:sync
```

Replace `your_github_username/oasf` with your actual fork name.
