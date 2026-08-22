// GET /api/user/[id] - 获取用户公开名片信息
import { jsonResponse } from '../../_lib/utils.js';
export async function onRequestGet({ request, env, params }) {
  try {
    const user = await env.DB.prepare(
      'SELECT id, username, nickname, avatar, constellation, resident_map, instrument, online_time, bio, created_at, play_style, wing_count, replica_preference, run_status, run_status_expire, highlights, avatar_style, game_duration FROM users WHERE id = ?'
    ).bind(params.id).first();
    if (!user) return jsonResponse({ success: false, error: '用户不存在' }, 404);
    // 统计数据
    const postCount = await env.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND status = 'approved'").bind(params.id).first();
    const photoCount = await env.DB.prepare("SELECT COUNT(*) as count FROM photos WHERE user_id = ? AND status = 'approved'").bind(params.id).first();
    const totalLikes = await env.DB.prepare('SELECT COALESCE(SUM(like_count),0) as total FROM posts WHERE user_id = ?').bind(params.id).first();
    const totalHighFives = await env.DB.prepare("SELECT COALESCE(SUM(high_five_count),0) as total FROM photos WHERE user_id = ? AND status = 'approved'").bind(params.id).first();
    // 检查run_status是否过期
    let runStatus = user.run_status || '';
    if (runStatus && user.run_status_expire) {
      if (new Date(user.run_status_expire) < new Date()) runStatus = '';
    }
    return jsonResponse({
      success: true,
      user: {
        ...user,
        run_status: runStatus,
        highlights: user.highlights ? JSON.parse(user.highlights) : [],
        avatar_style: user.avatar_style ? JSON.parse(user.avatar_style) : null
      },
      stats: { posts: postCount.count, photos: photoCount.count, likes: totalLikes.total, high_fives: totalHighFives.total }
    });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
