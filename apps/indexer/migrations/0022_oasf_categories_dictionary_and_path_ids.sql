-- Normalize OASF ids to use hierarchical path ids (relative path under schema/domains or schema/skills)
-- and add category/dictionary tables for richer mapping.

-- ===== Domains: rebuild table with path-based domainId =====
CREATE TABLE IF NOT EXISTS oasf_domains_new (
  id TEXT PRIMARY KEY,
  domainId TEXT NOT NULL UNIQUE,            -- e.g. "agriculture/agricultural_technology"
  nameKey TEXT,                             -- original "name" field from OASF JSON
  uid INTEGER,
  caption TEXT,
  description TEXT,
  extendsKey TEXT,                          -- domain category key (from "extends")
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

-- Copy old rows into new table, deriving path id from githubPath when possible
INSERT OR REPLACE INTO oasf_domains_new (
  id, domainId, nameKey, uid, caption, description, extendsKey,
  schemaJson, githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
)
SELECT
  id,
  CASE
    WHEN githubPath IS NOT NULL AND githubPath != ''
      THEN REPLACE(REPLACE(githubPath, 'schema/domains/', ''), '.json', '')
    ELSE domainId
  END AS domainId,
  NULL AS nameKey,
  NULL AS uid,
  NULL AS caption,
  description,
  category AS extendsKey,
  schemaJson,
  githubPath,
  githubSha,
  lastFetchedAt,
  createdAt,
  updatedAt
FROM oasf_domains;

DROP TABLE oasf_domains;
ALTER TABLE oasf_domains_new RENAME TO oasf_domains;

CREATE INDEX IF NOT EXISTS idx_oasf_domains_domainId ON oasf_domains(domainId);
CREATE INDEX IF NOT EXISTS idx_oasf_domains_extendsKey ON oasf_domains(extendsKey);

-- ===== Skills: rebuild table with path-based skillId =====
CREATE TABLE IF NOT EXISTS oasf_skills_new (
  id TEXT PRIMARY KEY,
  skillId TEXT NOT NULL UNIQUE,             -- e.g. "multi_modal/audio_processing/speech_recognition"
  nameKey TEXT,                             -- original "name" field from OASF JSON
  uid INTEGER,
  caption TEXT,
  description TEXT,
  extendsKey TEXT,                          -- skill category key (from "extends")
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

INSERT OR REPLACE INTO oasf_skills_new (
  id, skillId, nameKey, uid, caption, description, extendsKey,
  schemaJson, githubPath, githubSha, lastFetchedAt, createdAt, updatedAt
)
SELECT
  id,
  CASE
    WHEN githubPath IS NOT NULL AND githubPath != ''
      THEN REPLACE(REPLACE(githubPath, 'schema/skills/', ''), '.json', '')
    ELSE skillId
  END AS skillId,
  NULL AS nameKey,
  NULL AS uid,
  NULL AS caption,
  description,
  category AS extendsKey,
  schemaJson,
  githubPath,
  githubSha,
  lastFetchedAt,
  createdAt,
  updatedAt
FROM oasf_skills;

DROP TABLE oasf_skills;
ALTER TABLE oasf_skills_new RENAME TO oasf_skills;

CREATE INDEX IF NOT EXISTS idx_oasf_skills_skillId ON oasf_skills(skillId);
CREATE INDEX IF NOT EXISTS idx_oasf_skills_extendsKey ON oasf_skills(extendsKey);

-- ===== Category tables =====
CREATE TABLE IF NOT EXISTS oasf_domain_categories (
  key TEXT PRIMARY KEY,                     -- e.g. "agriculture"
  uid INTEGER,
  caption TEXT,
  description TEXT,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oasf_domain_categories_uid ON oasf_domain_categories(uid);

CREATE TABLE IF NOT EXISTS oasf_skill_categories (
  key TEXT PRIMARY KEY,                     -- e.g. "advanced_reasoning_planning"
  uid INTEGER,
  caption TEXT,
  description TEXT,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oasf_skill_categories_uid ON oasf_skill_categories(uid);

-- ===== Dictionary tables (attributes + types) =====
CREATE TABLE IF NOT EXISTS oasf_dictionary_entries (
  key TEXT PRIMARY KEY,
  type TEXT,
  caption TEXT,
  description TEXT,
  referencesJson TEXT,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS oasf_dictionary_types (
  key TEXT PRIMARY KEY,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);


