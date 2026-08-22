// POST /api/photos/[id]/favorite - 收藏/取消收藏
// GET /api/favorites - 获取我的收藏列表
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestPost({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const existing = await env.DB.prepare('SELECT id FROM favorites WHERE user_id = ? AND photo_id = ?').bind(user.id, params.id).first();
    if (existing) {
      await env.DB.prepare('DELETE FROM favorites WHERE user_id = ? AND photo_id = ?').bind(user.id, params.id).run();
      return jsonResponse({ success: true, favorited: false });
    } else {
      await env.DB.prepare('INSERT INTO favorites (user_id, photo_id) VALUES (?, ?)').bind(user.id, params.id).run();
      return jsonResponse({ success: true, favorited: true });
    }
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
