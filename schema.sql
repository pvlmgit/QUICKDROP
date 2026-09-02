CREATE TABLE IF NOT EXISTS manifests (
  room_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS thumbs (
  room_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (room_id, file_id)
);

CREATE TABLE IF NOT EXISTS codes (
  code TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manifests_expires ON manifests(expires_at);
CREATE INDEX IF NOT EXISTS idx_thumbs_expires ON thumbs(expires_at);
CREATE INDEX IF NOT EXISTS idx_codes_expires ON codes(expires_at);
