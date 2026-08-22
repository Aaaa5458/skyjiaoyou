// GET /api/qrcode - 获取当前微信群活码图片（公开访问）
import { jsonResponse } from '../_lib/utils.js';

export async function onRequestGet({ env }) {
  try {
    const result = await env.DB.prepare(
      "SELECT value FROM settings WHERE key = 'group_qrcode'"
    ).first();
    const qrcode = result ? result.value : null;
    return jsonResponse({ success: true, qrcode });
  } catch (e) {
    return jsonResponse({ success: true, qrcode: null });
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
