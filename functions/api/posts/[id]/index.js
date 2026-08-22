// GET /api/posts/[id] - 留言详情
// DELETE /api/posts/[id] - 删除留言（本人或管理员）
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestGet({ request, env, params }) {
  try {
    const post = await env.DB.prepare(
      'SELECT p.*, u.username, u.nickname, u.avatar FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?'
    ).bind(params.id).first();
    if (!post) return jsonResponse({ success: false, error: '留言不存在' }, 404);
    if (post.status === 'removed') return jsonResponse({ success: false, error: '该留言已被删除' }, 403);
    return jsonResponse({ success: true, post });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const post = await env.DB.prepare('SELECT user_id FROM posts WHERE id = ?').bind(params.id).first();
    if (!post) return jsonResponse({ success: false, error: '留言不存在' }, 404);
    if (post.user_id !== user.id && !user.is_admin) return errorResponse('无权限删除', 403);

    await env.DB.prepare("UPDATE posts SET status = 'removed' WHERE id = ?").bind(params.id).run();
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
