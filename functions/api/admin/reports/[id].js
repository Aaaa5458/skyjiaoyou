// PUT /api/admin/reports/[id] - 处理举报（删除/忽略/回复）
import { getAuthUser, jsonResponse, errorResponse, safeError } from '../../../_lib/utils.js';

export async function onRequestPut({ request, env, params }) {
  try {
    const user = await getAuthUser(request, env);
    if (!user || !user.is_admin) return errorResponse('需要管理员权限', 403);
    const body = await request.json();
    const { action, admin_reply, admin_note } = body;
    const reportId = params.id;

    // 获取举报信息
    const report = await env.DB.prepare('SELECT * FROM reports WHERE id = ?').bind(reportId).first();
    if (!report) return errorResponse('举报不存在', 404);

    let status = 'resolved';
    if (action === 'ignore') {
      status = 'ignored';
    } else if (action === 'delete') {
      // 删除被举报的内容
      if (report.type === 'post') {
        await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(report.target_id).run();
      } else if (report.type === 'photo') {
        await env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(report.target_id).run();
      }
      status = 'resolved';
    }

    await env.DB.prepare(
      'UPDATE reports SET status = ?, admin_reply = ?, admin_note = ?, processed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, admin_reply || '', admin_note || '', reportId).run();

    return jsonResponse({ success: true, message: '举报已处理' });
  } catch (e) {
    return safeError(e, 'PUT /admin/reports/[id]');
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
