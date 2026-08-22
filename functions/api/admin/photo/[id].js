// PUT /api/admin/photo/[id] - 更新照片状态（上架/下架）
// DELETE /api/admin/photo/[id] - 删除照片
import { requireAdmin, jsonResponse } from '../../../_lib/utils.js';

export async function onRequestPut({ request, env, params }) {
  const { error } = await requireAdmin(request, env);
  if (error) return error;

  try {
    const { status } = await request.json();
    if (!['pending', 'approved', 'removed'].includes(status)) {
      return jsonResponse({ success: false, error: '无效状态' }, 400);
    }
    await env.DB.prepare('UPDATE photos SET status = ? WHERE id = ?').bind(status, params.id).run();
    
    // 发送通知给上传者
    const photo = await env.DB.prepare('SELECT user_id, title FROM photos WHERE id = ?').bind(params.id).first();
    if (photo) {
      const msg = status === 'approved' ? '您的照片已通过审核' : status === 'removed' ? '您的照片已被下架' : '您的照片状态已更新';
      await env.DB.prepare('INSERT INTO notifications (user_id, type, content, photo_id) VALUES (?, ?, ?, ?)')
        .bind(photo.user_id, 'system', msg, params.id).run();
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
    await env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM comments WHERE photo_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM likes WHERE photo_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM favorites WHERE photo_id = ?').bind(params.id).run();
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
