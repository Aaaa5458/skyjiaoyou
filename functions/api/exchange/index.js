// 互心互火删除 API
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestDelete({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  const postId = params.id;
  
  // 查找互心互火帖子
  const post = await env.DB.prepare(
    "SELECT * FROM exchange_posts WHERE id = ?"
  ).bind(postId).first();
  
  if (!post) return errorResponse('内容不存在', 404);
  
  // 只有管理员或作者本人可以删除
  if (!user.is_admin && post.user_id !== user.id) {
    return errorResponse('无权限删除', 403);
  }
  
  // 删除
  await env.DB.prepare('DELETE FROM exchange_posts WHERE id = ?').bind(postId).run();

  return jsonResponse({ success: true, message: '已删除' });
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
