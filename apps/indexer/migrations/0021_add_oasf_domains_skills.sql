-- OASF Domains table
CREATE TABLE IF NOT EXISTS oasf_domains (
  id TEXT PRIMARY KEY,
  domainId TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  category TEXT,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oasf_domains_domainId ON oasf_domains(domainId);
CREATE INDEX IF NOT EXISTS idx_oasf_domains_category ON oasf_domains(category);

-- OASF Skills table
CREATE TABLE IF NOT EXISTS oasf_skills (
  id TEXT PRIMARY KEY,
  skillId TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  domainId TEXT,
  category TEXT,
  schemaJson TEXT,
  githubPath TEXT,
  githubSha TEXT,
  lastFetchedAt INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (domainId) REFERENCES oasf_domains(domainId)
);

CREATE INDEX IF NOT EXISTS idx_oasf_skills_skillId ON oasf_skills(skillId);
CREATE INDEX IF NOT EXISTS idx_oasf_skills_domainId ON oasf_skills(domainId);
CREATE INDEX IF NOT EXISTS idx_oasf_skills_category ON oasf_skills(category);

