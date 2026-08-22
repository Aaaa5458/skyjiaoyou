// GET /api/admin/posts - 获取所有留言（管理后台用）
import { requireAdmin, jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = (page - 1) * limit;

    let query = 'SELECT p.*, u.username, u.nickname FROM posts p LEFT JOIN users u ON p.user_id = u.id';
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE p.status = ?';
      params.push(status);
    }
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();
    
    // 获取总数
    let countQuery = 'SELECT COUNT(*) as count FROM posts';
    const countParams = [];
    if (status && status !== 'all') {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }
    const total = await env.DB.prepare(countQuery).bind(...countParams).first();

    return jsonResponse({ success: true, posts: result.results, total: total.count });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ success: false, error: '缺少ID' }, 400);
    
    await env.DB.prepare("UPDATE posts SET status = 'removed' WHERE id = ?").bind(id).run();
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '删除失败' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
