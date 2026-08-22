// DELETE /api/admin/comment/[id] - 删除评论
import { requireAdmin, jsonResponse } from '../../../_lib/utils.js';

export async function onRequestDelete({ request, env, params }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(params.id).run();
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
