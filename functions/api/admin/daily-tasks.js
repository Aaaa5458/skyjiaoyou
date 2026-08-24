// 管理员每日任务 API
import { getAuthUser, jsonResponse, errorResponse } from '../../_lib/utils.js';

// 获取当前每日任务（管理员）
export async function onRequestGet({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);
  if (!user.is_admin) return errorResponse('需要管理员权限', 403);

  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);

  const task = await env.DB.prepare(
    "SELECT * FROM daily_tasks WHERE task_date = ? ORDER BY id DESC LIMIT 1"
  ).bind(date).first();

  return jsonResponse({ success: true, task: task || null, date });
}

// 更新每日任务（管理员）
export async function onRequestPut({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);
  if (!user.is_admin) return errorResponse('需要管理员权限', 403);

  let body;
  try { body = await request.json(); } catch (e) { return errorResponse('请求格式错误', 400); }

  const { task_date, task1, task2, task3, task4, season_candles, big_candles } = body;
  if (!task_date) return errorResponse('缺少任务日期', 400);

  try {
    // 先删除当天旧任务
    await env.DB.prepare("DELETE FROM daily_tasks WHERE task_date = ?").bind(task_date).run();
    // 插入新任务
    await env.DB.prepare(
      "INSERT INTO daily_tasks (task_date, task1, task2, task3, task4, season_candles, big_candles) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(task_date, task1 || '', task2 || '', task3 || '', task4 || '', season_candles || '', big_candles || '').run();
    return jsonResponse({ success: true, message: '每日任务更新成功' });
  } catch (e) {
    return errorResponse('更新失败: ' + e.message, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
