// GET /api/photos/mine - 获取我的上传（所有状态）
import { getAuthUser, jsonResponse, errorResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const result = await env.DB.prepare(
      'SELECT id, title, description, status, likes, views, created_at FROM photos WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(user.id).all();
    return jsonResponse({ success: true, photos: result.results });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
