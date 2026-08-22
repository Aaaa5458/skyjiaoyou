// GET /api/admin/stats - 数据概览
import { requireAdmin, jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const userCount = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const photoStats = await env.DB.prepare(
      "SELECT status, COUNT(*) as count FROM photos GROUP BY status"
    ).all();
    const commentCount = await env.DB.prepare('SELECT COUNT(*) as count FROM comments').first();
    const postCount = await env.DB.prepare('SELECT COUNT(*) as count FROM posts').first();
    
    const today = new Date().toISOString().slice(0, 10);
    const todayUsers = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM users WHERE date(created_at) = ?"
    ).bind(today).first();
    const todayPhotos = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM photos WHERE date(created_at) = ?"
    ).bind(today).first();

    const statusMap = { pending: 0, approved: 0, removed: 0 };
    photoStats.results.forEach(r => { statusMap[r.status] = r.count; });

    return jsonResponse({
      success: true,
      users: userCount.count,
      posts: postCount.count,
      photos: { total: statusMap.pending + statusMap.approved + statusMap.removed, ...statusMap },
      approved_photos: statusMap.approved,
      comments: commentCount.count,
      today: { users: todayUsers.count, photos: todayPhotos.count }
    });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
