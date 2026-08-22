-- 修复缺失的v8列
-- users 表
ALTER TABLE users ADD COLUMN play_style TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN wing_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN replica_preference TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN watermark_text TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN run_status TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN run_status_expire TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN highlights TEXT DEFAULT '[]';
ALTER TABLE users ADD COLUMN achievements TEXT DEFAULT '[]';
ALTER TABLE users ADD COLUMN is_new INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN avatar_style TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN game_duration TEXT DEFAULT '';

-- posts 表
ALTER TABLE posts ADD COLUMN hide_contact INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN game_duration TEXT DEFAULT '';
ALTER TABLE posts ADD COLUMN online_time_filter TEXT DEFAULT '';

-- photos 表
ALTER TABLE photos ADD COLUMN location TEXT DEFAULT '';
ALTER TABLE photos ADD COLUMN high_five_count INTEGER DEFAULT 0;
ALTER TABLE photos ADD COLUMN heart_count INTEGER DEFAULT 0;
ALTER TABLE photos ADD COLUMN is_highlight INTEGER DEFAULT 0;
