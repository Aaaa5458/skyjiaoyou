// POST /api/auth/register - 用户注册（含设备登录限制）
import { generateSalt, hashPassword, generateToken, jsonResponse, errorResponse, checkRateLimit, safeError, sanitize, detectDeviceType, generateSessionId } from '../../_lib/utils.js';
export async function onRequestPost({ request, env }) {
  const rl = checkRateLimit(request, 'register', 3, 60);
  if (!rl.allowed) return errorResponse('操作过于频繁，请稍后再试', 429);
  try {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse('请求格式错误', 400);
  }
  const username = sanitize(body.username, 20);
  const password = body.password || '';
  const email = sanitize(body.email, 100);
  if (!username || !password) {
    return errorResponse('用户名和密码不能为空', 400);
  }
  if (username.length < 2 || username.length > 20) {
    return errorResponse('用户名长度需在2-20个字符之间', 400);
  }
  if (password.length < 8) {
    return errorResponse('密码至少8位', 400);
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return errorResponse('密码需包含字母和数字', 400);
  }
  // 检查用户名是否已存在
  const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (existing) {
    return errorResponse('用户名已被注册', 409);
  }
  // 哈希密码
  const salt = await generateSalt();
  const passwordHash = await hashPassword(password, salt);
  // 插入用户
  const isAdmin = username === 'admin' ? 1 : 0;
  const result = await env.DB.prepare(
    'INSERT INTO users (username, email, password_hash, password_salt, nickname, is_admin) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(username, email || null, passwordHash, salt, username, isAdmin).run();
  const userId = result.meta.last_row_id;

  // ===== 设备登录限制：注册时创建会话 =====
  const deviceType = detectDeviceType(request);
  const sessionId = generateSessionId();
  const userAgent = (request.headers.get('User-Agent') || '').slice(0, 500);
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '';

  // 删除同用户同设备类型的旧会话（理论上新用户没有，但保险起见）
  await env.DB.prepare(
    'DELETE FROM sessions WHERE user_id = ? AND device_type = ?'
  ).bind(userId, deviceType).run();

  // 创建新会话
  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, device_type, user_agent, ip_address, created_at, last_active_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
  ).bind(sessionId, userId, deviceType, userAgent, ip).run();

  // 生成包含 sessionId 的 token
  const token = await generateToken({ userId, username, sessionId });

  return jsonResponse({
    success: true,
    token,
    device_type: deviceType,
    user: {
      id: userId,
      username,
      email: email || null,
      nickname: username,
      avatar: null,
      is_admin: isAdmin
    }
  }, 201);
  } catch (e) { return safeError(e, 'POST /auth/register'); }
}
// CORS 预检
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
