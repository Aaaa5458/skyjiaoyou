// GET /api/admin/photos - 获取所有照片列表（审核用）
import { requireAdmin, jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let query = 'SELECT p.*, u.username, u.nickname FROM photos p LEFT JOIN users u ON p.user_id = u.id';
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE p.status = ?';
      params.push(status);
    }
    query += ' ORDER BY p.created_at DESC LIMIT 200';
    const result = await env.DB.prepare(query).bind(...params).all();
    return jsonResponse({ success: true, photos: result.results });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
