import { Migration } from "../types";


export default {

  name: 'gpt-provider',
  sql: `
DROP TYPE IF EXISTS GptProvider;
CREATE TYPE GptProvider as ENUM ('ollama', 'groq', 'gemini');
CREATE TABLE IF NOT EXISTS provider (
  id GptProvider PRIMARY KEY,
  icon VARCHAR NOT NULL,
  setting JSONB NOT NULL,
  created TIMESTAMPTZ DEFAULT current_timestamp,
  updated TIMESTAMPTZ DEFAULT NULL,
  deleted TIMESTAMPTZ DEFAULT NULL
);
`

} as Migration