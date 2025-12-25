-- Store fetched A2A agent card JSON separately from the ERC-8004 registration JSON (rawJson).
ALTER TABLE agents ADD COLUMN agentCardJson TEXT;
ALTER TABLE agents ADD COLUMN agentCardReadAt INTEGER;


