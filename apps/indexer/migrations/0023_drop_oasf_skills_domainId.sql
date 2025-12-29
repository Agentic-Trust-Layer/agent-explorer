-- Remove legacy domainId foreign key from oasf_skills.
-- Domain relationships are encoded structurally in skillId paths and via category/extendsKey.

-- Rebuild table without domainId (SQLite/D1 does not support DROP COLUMN).
CREATE TABLE IF NOT EXISTS oasf_skills_new (
  id TEXT PRIMARY KEY,
  skillId TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  category TEXT,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  nameKey TEXT,
  uid INTEGER,
  caption TEXT,
  extendsKey TEXT
);

INSERT OR REPLACE INTO oasf_skills_new (
  id, skillId, name, description, category, schemaJson,
  githubPath, githubSha, lastFetchedAt, createdAt, updatedAt,
  nameKey, uid, caption, extendsKey
)
SELECT
  id, skillId, name, description, category, schemaJson,
  githubPath, githubSha, lastFetchedAt, createdAt, updatedAt,
  nameKey, uid, caption, extendsKey
FROM oasf_skills;

DROP TABLE oasf_skills;
ALTER TABLE oasf_skills_new RENAME TO oasf_skills;

CREATE INDEX IF NOT EXISTS idx_oasf_skills_skillId ON oasf_skills(skillId);
CREATE INDEX IF NOT EXISTS idx_oasf_skills_category ON oasf_skills(category);
CREATE INDEX IF NOT EXISTS idx_oasf_skills_extendsKey ON oasf_skills(extendsKey);


