// POST /api/users/[id]/follow - 关注/取消关注
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestPost({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);
  
  const targetId = parseInt(params.id);
  if (targetId === user.id) return errorResponse('不能关注自己', 400);
  
  try {
    const existing = await env.DB.prepare(
      'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?'
    ).bind(user.id, targetId).first();
    
    if (existing) {
      await env.DB.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').bind(user.id, targetId).run();
      return jsonResponse({ success: true, following: false });
    } else {
      await env.DB.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)').bind(user.id, targetId).run();
      return jsonResponse({ success: true, following: true });
    }
  } catch (e) {
    return jsonResponse({ success: false, error: '操作失败' }, 500);
  }
}
