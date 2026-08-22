// GET /api/admin/users - 获取所有用户列表
import { requireAdmin, jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const result = await env.DB.prepare(
      'SELECT id, username, email, nickname, avatar, is_admin, is_banned, created_at FROM users ORDER BY created_at DESC LIMIT 200'
    ).all();
    return jsonResponse({ success: true, users: result.results });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
