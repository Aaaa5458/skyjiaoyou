// 管理员：删除留言回复
import { getAuthUser, jsonResponse, errorResponse } from '../../../../_lib/utils.js';

export async function onRequestDelete({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user || !user.is_admin) return errorResponse('需要管理员权限', 403);
  
  const replyId = params.id;
  
  // 删除回复
  const result = await env.DB.prepare('DELETE FROM post_replies WHERE id = ?').bind(replyId).run();
  
  if (result.meta.changes === 0) {
    return errorResponse('回复不存在', 404);
  }
  
  return jsonResponse({ success: true, message: '回复已删除' });
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
