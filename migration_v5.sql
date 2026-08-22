-- v5.0 迁移：光语信箱、名片系统、暗色主题

-- 留言表（光语信箱）
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tag TEXT DEFAULT '日常分享',
  is_anonymous INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'approved', -- approved/removed
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 留言点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 留言回复表
CREATE TABLE IF NOT EXISTS post_replies (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_anonymous INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- users 表扩展字段（光之子名片）
ALTER TABLE users ADD COLUMN constellation TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN resident_map TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN instrument TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN online_time TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN bio TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'light';

-- 索引
CREATE INDEX IF NOT EXISTS idx_posts_tag ON posts(tag);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_post_replies_post ON post_replies(post_id);
