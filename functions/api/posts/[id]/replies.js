// GET /api/posts/[id]/replies - 获取回复列表
// POST /api/posts/[id]/replies - 发表回复
import { getAuthUser, jsonResponse, errorResponse, sanitize } from '../../../_lib/utils.js';

function genId() {
  return 'reply_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function onRequestGet({ request, env, params }) {
  try {
    const result = await env.DB.prepare(
      'SELECT r.*, u.username, u.nickname, u.avatar FROM post_replies r LEFT JOIN users u ON r.user_id = u.id WHERE r.post_id = ? ORDER BY r.created_at ASC LIMIT 100'
    ).bind(params.id).all();
    return jsonResponse({ success: true, replies: result.results });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestPost({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const raw = await request.json();
    const content = sanitize(raw.content, 200);
    const is_anonymous = raw.is_anonymous ? 1 : 0;
    if (!content || !content.trim()) return errorResponse('回复内容不能为空', 400);
    if (content.length > 200) return errorResponse('回复不能超过200字', 400);

    const id = genId();
    await env.DB.prepare('INSERT INTO post_replies (id, post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?, ?)')
      .bind(id, params.id, user.id, content.trim(), is_anonymous ? 1 : 0).run();
    await env.DB.prepare('UPDATE posts SET reply_count = reply_count + 1 WHERE id = ?').bind(params.id).run();

    return jsonResponse({ success: true, id });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
