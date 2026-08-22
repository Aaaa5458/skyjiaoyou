// PUT /api/admin/user/[id] - 封禁/解封用户、重置密码
// DELETE /api/admin/user/[id] - 删除用户
import { requireAdmin, jsonResponse, generateSalt, hashPassword } from '../../../_lib/utils.js';

export async function onRequestPut({ request, env, params }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const body = await request.json();
    if (body.action === 'ban') {
      await env.DB.prepare('UPDATE users SET is_banned = ? WHERE id = ?').bind(body.banned ? 1 : 0, params.id).run();
    } else if (body.action === 'reset_password' && body.new_password) {
      const salt = await generateSalt();
      const hash = await hashPassword(body.new_password, salt);
      await env.DB.prepare('UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?').bind(hash, salt, params.id).run();
    }
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    // 删除用户的所有照片、评论、点赞、收藏
    const photos = await env.DB.prepare('SELECT id FROM photos WHERE user_id = ?').bind(params.id).all();
    for (const p of photos.results) {
      await env.DB.prepare('DELETE FROM comments WHERE photo_id = ?').bind(p.id).run();
      await env.DB.prepare('DELETE FROM likes WHERE photo_id = ?').bind(p.id).run();
      await env.DB.prepare('DELETE FROM favorites WHERE photo_id = ?').bind(p.id).run();
    }
    await env.DB.prepare('DELETE FROM photos WHERE user_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM comments WHERE user_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM likes WHERE user_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM favorites WHERE user_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM notifications WHERE user_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(params.id).run();
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
