// GET /api/admin/comments - 获取所有评论列表
import { requireAdmin, jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const result = await env.DB.prepare(
      'SELECT c.*, u.username, u.nickname, p.title as photo_title FROM comments c LEFT JOIN users u ON c.user_id = u.id LEFT JOIN photos p ON c.photo_id = p.id ORDER BY c.created_at DESC LIMIT 200'
    ).all();
    return jsonResponse({ success: true, comments: result.results });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
