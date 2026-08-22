// 每日任务 API
import { getAuthUser, jsonResponse, errorResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);

  const task = await env.DB.prepare(
    "SELECT * FROM daily_tasks WHERE task_date = ? ORDER BY id DESC LIMIT 1"
  ).bind(date).first();

  // 获取用户打卡状态
  let checkins = [];
  const user = await getAuthUser(request, env);
  if (user && task) {
    const result = await env.DB.prepare(
      "SELECT task_index FROM task_checkins WHERE user_id = ? AND task_date = ?"
    ).bind(user.id, date).all();
    checkins = result.results.map(r => r.task_index);
  }

  return jsonResponse({ success: true, task: task || null, checkins });
}

export async function onRequestPost({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  let body;
  try { body = await request.json(); } catch (e) { return errorResponse('请求格式错误', 400); }

  const { task_index, date } = body;
  if (!task_index || task_index < 1 || task_index > 4) return errorResponse('任务序号错误', 400);

  const taskDate = date || new Date().toISOString().slice(0, 10);

  try {
    await env.DB.prepare(
      "INSERT OR IGNORE INTO task_checkins (user_id, task_date, task_index) VALUES (?, ?, ?)"
    ).bind(user.id, taskDate, task_index).run();
  } catch (e) {
    return errorResponse('打卡失败', 500);
  }

  return jsonResponse({ success: true, message: '打卡成功' });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
