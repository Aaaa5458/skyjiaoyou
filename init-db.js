// GET /api/init-db - 自动初始化数据库表（部署后访问一次）
import { jsonResponse, errorResponse } from '../_lib/utils.js';

export async function onRequestGet({ env }) {
  try {
    const results = [];

    // 创建 sessions 表（设备登录限制）
    try {
      await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          device_type TEXT NOT NULL DEFAULT 'desktop',
          user_agent TEXT,
          ip_address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `).run();
      results.push('sessions表创建成功');
    } catch (e) {
      results.push('sessions表创建失败: ' + e.message);
    }

    // 创建索引
    try {
      await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)').run();
      await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_user_device ON sessions(user_id, device_type)').run();
      results.push('索引创建成功');
    } catch (e) {
      results.push('索引创建失败: ' + e.message);
    }

    return jsonResponse({
      success: true,
      message: '数据库初始化完成',
      results
    });
  } catch (e) {
    console.error('init-db error:', e);
    return errorResponse('服务器开小差了，请稍后重试', 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
