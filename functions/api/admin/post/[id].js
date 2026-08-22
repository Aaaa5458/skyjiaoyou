// 管理员：删除留言
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestDelete({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user || !user.is_admin) return errorResponse('需要管理员权限', 403);

  const postId = params.id;
  
  // 删除留言的点赞和回复
  await env.DB.prepare('DELETE FROM post_likes WHERE post_id = ?').bind(postId).run();
  await env.DB.prepare('DELETE FROM post_replies WHERE post_id = ?').bind(postId).run();
  await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run();

  return jsonResponse({ success: true, message: '留言已删除' });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
