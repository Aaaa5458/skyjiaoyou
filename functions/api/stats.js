// GET /api/stats - 公开统计数据（无需登录）
import { jsonResponse } from '../_lib/utils.js';
export async function onRequestGet({ env }) {
  try {
    const userCount = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const postCount = await env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'approved'").first();
    const photoCount = await env.DB.prepare("SELECT COUNT(*) as count FROM photos WHERE status = 'approved'").first();
    return jsonResponse({
      success: true,
      users: userCount.count,
      posts: postCount.count,
      photos: photoCount.count
    });
  } catch (e) {
    console.error('Stats error:', e);
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
