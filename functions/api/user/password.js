// PUT /api/user/password - 修改密码
import { getAuthUser, generateSalt, hashPassword, verifyPassword, jsonResponse, errorResponse } from '../../_lib/utils.js';

export async function onRequestPut({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) {
    return errorResponse('未登录或登录已过期', 401);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse('请求格式错误', 400);
  }

  const { oldPassword, newPassword } = body;
  if (!oldPassword || !newPassword) {
    return errorResponse('请填写旧密码和新密码', 400);
  }
  if (newPassword.length < 4) {
    return errorResponse('新密码至少4位', 400);
  }

  // 获取当前密码哈希
  const current = await env.DB.prepare(
    'SELECT password_hash, password_salt FROM users WHERE id = ?'
  ).bind(user.id).first();

  // 验证旧密码（第三方登录用户可能没有密码，允许直接设置）
  if (current.password_hash && current.password_salt) {
    const valid = await verifyPassword(oldPassword, current.password_salt, current.password_hash);
    if (!valid) {
      return errorResponse('旧密码错误', 401);
    }
  }

  // 哈希新密码
  const salt = await generateSalt();
  const passwordHash = await hashPassword(newPassword, salt);

  await env.DB.prepare(
    "UPDATE users SET password_hash = ?, password_salt = ?, updated_at = datetime('now') WHERE id = ?"
  ).bind(passwordHash, salt, user.id).run();

  return jsonResponse({ success: true, message: '密码修改成功' });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
