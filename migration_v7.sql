-- v7 迁移：举报系统
ALTER TABLE photos ADD COLUMN report_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN report_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL, -- 'photo' or 'post'
  target_id TEXT NOT NULL,
  user_id INTEGER,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending, resolved, ignored
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
