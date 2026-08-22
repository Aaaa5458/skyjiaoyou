-- 社区与安全功能数据库迁移

-- 1. 举报表增加分类字段
ALTER TABLE reports ADD COLUMN report_category TEXT DEFAULT '';

-- 2. 站内私信表
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);

-- 3. 用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  achievement_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- 4. 成就定义表（如果不存在）
CREATE TABLE IF NOT EXISTS achievement_defs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  condition_type TEXT,
  condition_value INTEGER DEFAULT 0
);

-- 初始化成就定义
INSERT OR IGNORE INTO achievement_defs (id, name, description, icon, condition_type, condition_value) VALUES
('first_light', '初入光遇', '完成注册', '✨', 'register', 1),
('warm_traveler', '暖心旅人', '收到10个点赞', '💬', 'likes_received', 10),
('scenery_master', '风景大师', '上传5张截图', '📷', 'photos_uploaded', 5),
('active_child', '活跃光之子', '发布10条留言', '✍️', 'posts_made', 10),
('friend_finder', '交友达人', '发布5条找固玩类留言', '🤝', 'friend_posts', 5),
('hot_creator', '热门创作者', '有1条留言获得20个点赞', '🔥', 'hot_post', 20);
