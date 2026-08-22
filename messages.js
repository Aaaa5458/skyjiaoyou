// GET /api/messages - 获取收到的私信
// POST /api/messages - 发送私信
import { getAuthUser, jsonResponse, errorResponse, safeError, sanitize } from '../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  try {
    const user = await getAuthUser(request, env);
    if (!user) return errorResponse('请先登录', 401);
    const result = await env.DB.prepare(
      `SELECT m.*, u.username as from_username, u.nickname as from_nickname 
       FROM messages m LEFT JOIN users u ON m.from_user_id = u.id 
       WHERE m.to_user_id = ? ORDER BY m.created_at DESC LIMIT 50`
    ).bind(user.id).all();
    // 标记为已读
    await env.DB.prepare('UPDATE messages SET is_read = 1 WHERE to_user_id = ? AND is_read = 0').bind(user.id).run();
    return jsonResponse({ success: true, messages: result.results });
  } catch (e) {
    return safeError(e, 'GET /messages');
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const user = await getAuthUser(request, env);
    if (!user) return errorResponse('请先登录', 401);
    const body = await request.json();
    const { to_user_id, content } = body;
    if (!to_user_id || !content || !content.trim()) return errorResponse('收件人和内容不能为空', 400);
    if (content.length > 500) return errorResponse('私信不能超过500字', 400);
    if (to_user_id === user.id) return errorResponse('不能给自己发私信', 400);
    // 检查收件人是否存在
    const toUser = await env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(to_user_id).first();
    if (!toUser) return errorResponse('收件人不存在', 404);
    await env.DB.prepare(
      'INSERT INTO messages (from_user_id, to_user_id, content) VALUES (?, ?, ?)'
    ).bind(user.id, to_user_id, content.trim()).run();
    return jsonResponse({ success: true, message: '私信已发送' });
  } catch (e) {
    return safeError(e, 'POST /messages');
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
