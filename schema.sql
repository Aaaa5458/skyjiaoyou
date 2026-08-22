-- 光遇交友数据库 Schema v4.0
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  bindings TEXT DEFAULT '{}',
  watermark INTEGER DEFAULT 1,
  is_admin INTEGER DEFAULT 0,
  is_banned INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建照片表
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  data_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending(待审核), approved(已上架), removed(已下架)
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  allow_download INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  photo_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, photo_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

-- 创建收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  photo_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, photo_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  photo_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (photo_id) REFERENCES photos(id)
);

-- 创建通知表
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  photo_id TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建设置表（活码、网站配置等）
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_photos_status ON photos(status);
CREATE INDEX IF NOT EXISTS idx_photos_user ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_photo ON comments(photo_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 初始化管理员账号（用户名 admin，密码 admin123）
-- 如需修改密码，请登录后在个人中心修改，或直接更新此条记录的 password_hash
INSERT OR IGNORE INTO users (username, password_hash, password_salt, nickname, is_admin, created_at)
VALUES ('admin', 'ee19f0404fa6e7e0a693766f2632cdb05fcf300a1d72130cfa85af010b0f33ee', 'admin-salt-2026-guangyu', '管理员', 1, datetime('now'));
