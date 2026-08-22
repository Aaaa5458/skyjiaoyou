// GET /api/user/reports - 获取用户提交的举报列表及处理状态
import { getAuthUser, jsonResponse, errorResponse, safeError } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  try {
    const user = await getAuthUser(request, env);
    if (!user) return errorResponse('请先登录', 401);
    const result = await env.DB.prepare(
      `SELECT r.id, r.type, r.target_id, r.reason, r.report_category, r.status, r.admin_reply, r.created_at, r.processed_at
       FROM reports r 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC 
       LIMIT 50`
    ).bind(user.id).all();
    return jsonResponse({ success: true, reports: result.results });
  } catch (e) {
    return safeError(e, 'GET /user/reports');
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
