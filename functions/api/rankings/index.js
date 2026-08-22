// 星光排行榜 API
import { jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'likes'; // likes/posts/followers

  let query, params = [];
  if (type === 'posts') {
    query = `SELECT u.id, u.username, u.nickname, u.avatar_style,
             (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id AND p.status = 'approved') as count
             FROM users u ORDER BY count DESC LIMIT 20`;
  } else if (type === 'followers') {
    query = `SELECT u.id, u.username, u.nickname, u.avatar_style,
             (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.id) as count
             FROM users u ORDER BY count DESC LIMIT 20`;
  } else {
    // 按收到的点赞数排名（照片点赞+留言点赞）
    query = `SELECT u.id, u.username, u.nickname, u.avatar_style,
             (SELECT COALESCE(SUM(likes),0) FROM photos p WHERE p.user_id = u.id AND p.status = 'approved')
             + (SELECT COALESCE(SUM(like_count),0) FROM posts p WHERE p.user_id = u.id AND p.status = 'approved') as count
             FROM users u ORDER BY count DESC LIMIT 20`;
  }

  const users = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ success: true, rankings: users.results, type });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
