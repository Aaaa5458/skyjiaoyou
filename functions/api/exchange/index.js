// 互心互火专区 API
import { getAuthUser, jsonResponse, errorResponse, sanitize } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

  let where = "WHERE ep.status = 'active'";
  const params = [];
  if (type && ['heart', 'fire'].includes(type)) {
    where += " AND ep.type = ?";
    params.push(type);
  }

  const posts = await env.DB.prepare(
    `SELECT ep.*, u.username, u.nickname, u.avatar_style
     FROM exchange_posts ep
     LEFT JOIN users u ON ep.user_id = u.id
     ${where}
     ORDER BY ep.created_at DESC
     LIMIT ? OFFSET ?`
  ).bind(...params, pageSize, (page - 1) * pageSize).all();

  const countResult = await env.DB.prepare(
    `SELECT COUNT(*) as total FROM exchange_posts ep ${where}`
  ).bind(...params).first();

  return jsonResponse({ success: true, posts: posts.results, total: countResult.total });
}

export async function onRequestPost({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  let body;
  try { body = await request.json(); } catch (e) { return errorResponse('请求格式错误', 400); }

  const { type = 'heart', server = '国服', content = '' } = body;
  if (!['heart', 'fire'].includes(type)) return errorResponse('类型错误', 400);

  const id = 'ep_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const cleanContent = sanitize(content).slice(0, 200);

  await env.DB.prepare(
    "INSERT INTO exchange_posts (id, user_id, type, server, content) VALUES (?, ?, ?, ?, ?)"
  ).bind(id, user.id, type, server, cleanContent).run();

  return jsonResponse({ success: true, id });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
