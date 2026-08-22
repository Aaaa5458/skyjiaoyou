// POST /api/auth/login - 用户登录（含设备登录限制）
import { verifyPassword, generateToken, jsonResponse, errorResponse, checkRateLimit, safeError, detectDeviceType, generateSessionId } from '../../_lib/utils.js';

export async function onRequestPost({ request, env }) {
  const rl = checkRateLimit(request, 'login', 5, 60);
  if (!rl.allowed) return errorResponse('操作过于频繁，请稍后再试', 429);
  try {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse('请求格式错误', 400);
  }
  const { username, password } = body;
  if (!username || !password) {
    return errorResponse('用户名和密码不能为空', 400);
  }
  // 查询用户
  const user = await env.DB.prepare(
    'SELECT id, username, email, password_hash, password_salt, nickname, avatar, is_admin, is_banned FROM users WHERE username = ?'
  ).bind(username).first();
  if (!user) {
    return errorResponse('用户名或密码错误', 401);
  }
  if (user.is_banned) {
    return errorResponse('账号已被封禁', 403);
  }
  // 验证密码
  const valid = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!valid) {
    return errorResponse('用户名或密码错误', 401);
  }

  // ===== 设备登录限制 =====
  const deviceType = detectDeviceType(request);
  const sessionId = generateSessionId();
  const userAgent = (request.headers.get('User-Agent') || '').slice(0, 500);
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '';

  // 删除同用户同设备类型的旧会话（踢出旧设备）
  await env.DB.prepare(
    'DELETE FROM sessions WHERE user_id = ? AND device_type = ?'
  ).bind(user.id, deviceType).run();

  // 创建新会话
  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, device_type, user_agent, ip_address, created_at, last_active_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
  ).bind(sessionId, user.id, deviceType, userAgent, ip).run();

  // 生成包含 sessionId 的 token
  const token = await generateToken({ userId: user.id, username: user.username, sessionId });

  return jsonResponse({
    success: true,
    token,
    device_type: deviceType,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      is_admin: user.is_admin
    }
  });
  } catch (e) { return safeError(e, 'POST /auth/login'); }
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
