// GET /api/users/run-status - 获取当前设置了跑图状态的用户
import { jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ env }) {
  try {
    const result = await env.DB.prepare(
      "SELECT id, username, nickname, avatar, run_status FROM users WHERE run_status != '' AND (run_status_expire IS NULL OR run_status_expire > datetime('now')) ORDER BY run_status_expire IS NULL, run_status_expire DESC LIMIT 20"
    ).all();
    return jsonResponse({ success: true, users: result.results });
  } catch (e) {
    return jsonResponse({ success: true, users: [] });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
