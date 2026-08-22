// POST /api/auth/logout - 退出登录（删除当前会话）
import { getAuthUser, getSessionId, jsonResponse, errorResponse, safeError } from '../../_lib/utils.js';

export async function onRequestPost({ request, env }) {
  try {
    const user = await getAuthUser(request, env);
    if (!user) {
      return errorResponse('未登录', 401);
    }
    const sessionId = await getSessionId(request);
    if (sessionId) {
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    }
    return jsonResponse({ success: true, message: '已退出登录' });
  } catch (e) { return safeError(e, 'POST /auth/logout'); }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
