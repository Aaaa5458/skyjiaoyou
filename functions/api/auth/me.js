// GET /api/auth/me - 获取当前登录用户信息
import { getAuthUser, getSessionId, verifyToken, jsonResponse, errorResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // 先检查 token 是否有效
    if (token) {
      const payload = await verifyToken(token);
      if (payload && payload.sessionId) {
        // 检查会话是否存在
        const session = await env.DB.prepare(
          'SELECT id, user_id FROM sessions WHERE id = ?'
        ).bind(payload.sessionId).first();
        if (!session) {
          // 会话不存在，说明被踢出了
          return errorResponse('您的账号已在其他设备登录', 401);
        }
      }
    }

    const user = await getAuthUser(request, env);
    if (!user) {
      return errorResponse('未登录或登录已过期', 401);
    }
    function safeParse(v, def) {
      if (!v) return def;
      try { return JSON.parse(v); } catch (e) { return def; }
    }
    return jsonResponse({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        bindings: safeParse(user.bindings, {}),
        watermark: user.watermark,
        is_admin: user.is_admin,
        created_at: user.created_at,
        constellation: user.constellation || '',
        resident_map: user.resident_map || '',
        instrument: user.instrument || '',
        online_time: user.online_time || '',
        bio: user.bio || '',
        theme: user.theme || 'light',
        play_style: user.play_style || '',
        wing_count: user.wing_count || 0,
        replica_preference: user.replica_preference || '',
        watermark_text: user.watermark_text || '',
        run_status: user.run_status || '',
        run_status_expire: user.run_status_expire || '',
        highlights: safeParse(user.highlights, []),
        achievements: safeParse(user.achievements, []),
        is_new: user.is_new || 0,
        avatar_style: safeParse(user.avatar_style, null),
        game_duration: user.game_duration || ''
      }
    });
  } catch (e) {
    console.error('me error:', e); return errorResponse('服务器开小差了，请稍后重试', 500);
  }
}
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
