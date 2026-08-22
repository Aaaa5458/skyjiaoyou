// GET /api/favorites - 获取我的收藏列表
import { getAuthUser, jsonResponse, errorResponse } from '../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const result = await env.DB.prepare(
      `SELECT p.id, p.data_url, p.title, p.status, p.likes, p.created_at, u.username 
       FROM favorites f 
       JOIN photos p ON f.photo_id = p.id 
       LEFT JOIN users u ON p.user_id = u.id 
       WHERE f.user_id = ? AND p.status = 'approved'
       ORDER BY f.created_at DESC`
    ).bind(user.id).all();
    return jsonResponse({ success: true, photos: result.results });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
