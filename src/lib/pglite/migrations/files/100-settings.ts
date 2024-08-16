import { Migration } from "../types";

export default {

  name: 'setting',
  sql: `
CREATE TABLE IF NOT EXISTS setting (
  id VARCHAR PRIMARY KEY,
  data JSONB NOT NULL
);
`

} as Migration