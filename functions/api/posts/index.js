// GET /api/posts - 获取留言列表（支持标签筛选、搜索、分页、排序、游戏时长/在线时间筛选）
// POST /api/posts - 发布留言
import { getAuthUser, jsonResponse, errorResponse, safeError, sanitize } from '../../_lib/utils.js';
function genId() {
  return 'post_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const sort = url.searchParams.get('sort') || 'new';
    const gameDuration = url.searchParams.get('game_duration');
    const onlineTime = url.searchParams.get('online_time');
    const offset = (page - 1) * limit;
    let where = "WHERE p.status = 'approved'";
    const params = [];
    if (tag && tag !== 'all') { where += ' AND p.tag = ?'; params.push(tag); }
    if (search) { where += ' AND (p.content LIKE ? OR p.tag LIKE ?)'; params.push('%'+search+'%', '%'+search+'%'); }
    if (gameDuration) { where += ' AND p.game_duration = ?'; params.push(gameDuration); }
    if (onlineTime) { where += ' AND p.online_time_filter LIKE ?'; params.push('%'+onlineTime+'%'); }
    let orderBy = 'p.is_pinned DESC, p.created_at DESC';
    if (sort === 'hot') orderBy = 'p.is_pinned DESC, p.like_count DESC, p.created_at DESC';
    params.push(limit, offset);
    const result = await env.DB.prepare(
      `SELECT p.*, u.username, u.nickname, u.avatar, u.play_style, u.resident_map 
       FROM posts p LEFT JOIN users u ON p.user_id = u.id 
       ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).bind(...params).all();
    // 获取总数
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM posts p ${where}`
    ).bind(...params.slice(0, -2)).first();
    return jsonResponse({ success: true, posts: result.results, page, limit, total: countResult.count });
  } catch (e) {
    return safeError(e, 'POST /posts');
  }
}
export async function onRequestPost({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);
  try {
    const { content, image_url, tag, is_anonymous, hide_contact, game_duration, online_time_filter } = await request.json();
    const safeContent = sanitize(content, 500);
    if (!safeContent) return errorResponse('留言内容不能为空', 400);
    const id = genId();
    await env.DB.prepare(
      'INSERT INTO posts (id, user_id, content, image_url, tag, is_anonymous, hide_contact, game_duration, online_time_filter, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, user.id, safeContent, image_url || null, sanitize(tag, 20) || '日常分享', is_anonymous ? 1 : 0, hide_contact ? 1 : 0, sanitize(game_duration, 20) || '', sanitize(online_time_filter, 50) || '', 'pending').run();
    return jsonResponse({ success: true, id });
  } catch (e) {
    return safeError(e, 'POST /posts');
  }
}
export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
