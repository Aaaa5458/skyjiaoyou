// PUT /api/admin/qrcode - 更新群活码（管理员权限）
import { getAuthUser, jsonResponse, errorResponse } from '../../_lib/utils.js';

export async function onRequestPut({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user || !user.is_admin) {
    return errorResponse('需要管理员权限', 403);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return errorResponse('请求格式错误', 400);
  }

  const { qrcode } = body;
  if (!qrcode) {
    return errorResponse('二维码图片不能为空', 400);
  }

  // 检查 settings 表是否有记录，没有则插入，有则更新
  const existing = await env.DB.prepare(
    "SELECT key FROM settings WHERE key = 'group_qrcode'"
  ).first();

  if (existing) {
    await env.DB.prepare(
      "UPDATE settings SET value = ? WHERE key = 'group_qrcode'"
    ).bind(qrcode).run();
  } else {
    await env.DB.prepare(
      "INSERT INTO settings (key, value) VALUES ('group_qrcode', ?)"
    ).bind(qrcode).run();
  }

  return jsonResponse({ success: true, message: '活码更新成功' });
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
