// POST /api/posts/[id]/like - 点赞/取消点赞
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestPost({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const existing = await env.DB.prepare('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?').bind(params.id, user.id).first();
    if (existing) {
      await env.DB.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').bind(params.id, user.id).run();
      await env.DB.prepare('UPDATE posts SET like_count = MAX(like_count - 1, 0) WHERE id = ?').bind(params.id).run();
      return jsonResponse({ success: true, liked: false });
    } else {
      await env.DB.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)').bind(params.id, user.id).run();
      await env.DB.prepare('UPDATE posts SET like_count = like_count + 1 WHERE id = ?').bind(params.id).run();
      return jsonResponse({ success: true, liked: true });
    }
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
