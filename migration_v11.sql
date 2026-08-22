-- 互心互火帖子表
CREATE TABLE IF NOT EXISTS exchange_posts (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'heart', -- heart(互心) / fire(互火)
  server TEXT DEFAULT '国服', -- 国服/国际服
  content TEXT,
  status TEXT DEFAULT 'active', -- active/completed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 复刻先祖信息表
CREATE TABLE IF NOT EXISTS traveling_spirits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  season TEXT,
  start_time TEXT,
  end_time TEXT,
  items TEXT, -- JSON: 兑换物品列表
  candles INTEGER DEFAULT 0,
  hearts INTEGER DEFAULT 0,
  ascended_candles INTEGER DEFAULT 0,
  image_url TEXT,
  is_current INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 每日任务表
CREATE TABLE IF NOT EXISTS daily_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_date TEXT NOT NULL,
  task1 TEXT,
  task2 TEXT,
  task3 TEXT,
  task4 TEXT,
  season_candles TEXT, -- 季节蜡烛位置
  big_candles TEXT, -- 大蜡烛位置
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 任务打卡记录表
CREATE TABLE IF NOT EXISTS task_checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  task_date TEXT NOT NULL,
  task_index INTEGER NOT NULL, -- 1-4
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, task_date, task_index)
);

-- 插入示例复刻先祖
INSERT OR IGNORE INTO traveling_spirits (name, season, start_time, end_time, items, candles, hearts, ascended_candles, is_current)
VALUES ('回旋大师', '梦想季', '2026-08-13', '2026-08-16', '["旋转动作","紫色斗篷","发型","面具"]', 112, 2, 2, 1);

-- 插入示例每日任务
INSERT OR IGNORE INTO daily_tasks (task_date, task1, task2, task3, task4, season_candles, big_candles)
VALUES ('2026-08-22', '在雨林神庙冥想', '点亮一位玩家', '接受一位朋友的礼物', '追逐散落星光', '雨林', '云野、雨林、暮土');
