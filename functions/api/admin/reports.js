// 管理员：获取举报列表
import { getAuthUser, jsonResponse, errorResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user || !user.is_admin) return errorResponse('需要管理员权限', 403);

  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'pending';

  const reports = await env.DB.prepare(
    `SELECT r.*, u.username, u.nickname 
     FROM reports r 
     LEFT JOIN users u ON r.user_id = u.id 
     WHERE r.status = ? 
     ORDER BY r.created_at DESC 
     LIMIT 100`
  ).bind(status).all();

  return jsonResponse({ success: true, reports: reports.results });
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
