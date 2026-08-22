// GET /api/photos/[id]/comments - 获取评论列表
// POST /api/photos/[id]/comments - 发表评论
import { getAuthUser, jsonResponse, errorResponse, sanitize } from '../../../_lib/utils.js';

function genId() {
  return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function onRequestGet({ request, env, params }) {
  try {
    const result = await env.DB.prepare(
      'SELECT c.*, u.username, u.nickname, u.avatar FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.photo_id = ? ORDER BY c.created_at DESC LIMIT 100'
    ).bind(params.id).all();
    return jsonResponse({ success: true, comments: result.results });
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
    if (!content || !content.trim()) return errorResponse('评论内容不能为空', 400);
    
    const id = genId();
    await env.DB.prepare('INSERT INTO comments (id, user_id, photo_id, content) VALUES (?, ?, ?, ?)')
      .bind(id, user.id, params.id, content.trim()).run();
    
    // 通知照片上传者
    const photo = await env.DB.prepare('SELECT user_id FROM photos WHERE id = ?').bind(params.id).first();
    if (photo && photo.user_id !== user.id) {
      await env.DB.prepare('INSERT INTO notifications (user_id, type, content, photo_id) VALUES (?, ?, ?, ?)')
        .bind(photo.user_id, 'comment', `${user.nickname || user.username} 评论了你的照片`, params.id).run();
    }
    
    return jsonResponse({ success: true, id });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
