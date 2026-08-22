// 举报内容（照片或留言）
import { getAuthUser, jsonResponse, errorResponse, sanitize } from '../../_lib/utils.js';

export async function onRequestPost({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  let body;
  try { body = await request.json(); } catch (e) { return errorResponse('请求格式错误', 400); }

  const type = sanitize(body.type, 20);
  const target_id = body.target_id;
  const reason = sanitize(body.reason, 200);
  if (!type || !target_id) return errorResponse('缺少参数', 400);
  if (!['photo', 'post'].includes(type)) return errorResponse('无效的举报类型', 400);

  // 插入举报记录
  await env.DB.prepare(
    'INSERT INTO reports (type, target_id, user_id, reason, status) VALUES (?, ?, ?, ?, ?)'
  ).bind(type, target_id, user.id, reason || '', 'pending').run();

  // 更新目标的举报计数
  const table = type === 'photo' ? 'photos' : 'posts';
  const idField = type === 'photo' ? 'id' : 'id';
  try {
    await env.DB.prepare(`UPDATE ${table} SET report_count = COALESCE(report_count, 0) + 1 WHERE id = ?`)
      .bind(target_id).run();
  } catch (e) { /* 字段可能不存在 */ }

  return jsonResponse({ success: true, message: '举报已提交，管理员会尽快处理' });
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
