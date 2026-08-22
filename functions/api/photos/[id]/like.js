// POST /api/photos/[id]/like - 点赞/取消点赞
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestPost({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const existing = await env.DB.prepare('SELECT id FROM likes WHERE user_id = ? AND photo_id = ?').bind(user.id, params.id).first();
    if (existing) {
      await env.DB.prepare('DELETE FROM likes WHERE user_id = ? AND photo_id = ?').bind(user.id, params.id).run();
      await env.DB.prepare('UPDATE photos SET likes = MAX(likes - 1, 0) WHERE id = ?').bind(params.id).run();
      return jsonResponse({ success: true, liked: false });
    } else {
      await env.DB.prepare('INSERT INTO likes (user_id, photo_id) VALUES (?, ?)').bind(user.id, params.id).run();
      await env.DB.prepare('UPDATE photos SET likes = likes + 1 WHERE id = ?').bind(params.id).run();
      // 通知上传者
      const photo = await env.DB.prepare('SELECT user_id FROM photos WHERE id = ?').bind(params.id).first();
      if (photo && photo.user_id !== user.id) {
        await env.DB.prepare('INSERT INTO notifications (user_id, type, content, photo_id) VALUES (?, ?, ?, ?)')
          .bind(photo.user_id, 'like', `${user.nickname || user.username} 赞了你的照片`, params.id).run();
      }
      return jsonResponse({ success: true, liked: true });
    }
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
