// 管理员复刻先祖 API
import { getAuthUser, jsonResponse, errorResponse } from '../../_lib/utils.js';

// 获取当前复刻先祖（管理员）
export async function onRequestGet({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);
  if (user.role !== 'admin') return errorResponse('需要管理员权限', 403);

  const spirit = await env.DB.prepare(
    "SELECT * FROM traveling_spirits WHERE is_current = 1 ORDER BY id DESC LIMIT 1"
  ).first();

  return jsonResponse({ success: true, spirit: spirit || null });
}

// 更新复刻先祖（管理员）
export async function onRequestPut({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);
  if (user.role !== 'admin') return errorResponse('需要管理员权限', 403);

  let body;
  try { body = await request.json(); } catch (e) { return errorResponse('请求格式错误', 400); }

  const { name, season, start_time, end_time, items, candles, hearts, ascended_candles, image_url, is_current } = body;
  if (!name) return errorResponse('缺少先祖名称', 400);

  try {
    // 如果设置为当前先祖，先取消其他当前先祖
    if (is_current === 1 || is_current === true) {
      await env.DB.prepare("UPDATE traveling_spirits SET is_current = 0 WHERE is_current = 1").run();
    }

    // 检查是否已存在该先祖（按名称）
    const existing = await env.DB.prepare(
      "SELECT id FROM traveling_spirits WHERE name = ?"
    ).bind(name).first();

    if (existing) {
      // 更新
      await env.DB.prepare(
        "UPDATE traveling_spirits SET season=?, start_time=?, end_time=?, items=?, candles=?, hearts=?, ascended_candles=?, image_url=?, is_current=? WHERE id=?"
      ).bind(season || '', start_time || '', end_time || '', items || '[]', candles || 0, hearts || 0, ascended_candles || 0, image_url || '', is_current ? 1 : 0, existing.id).run();
    } else {
      // 插入新先祖
      await env.DB.prepare(
        "INSERT INTO traveling_spirits (name, season, start_time, end_time, items, candles, hearts, ascended_candles, image_url, is_current) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(name, season || '', start_time || '', end_time || '', items || '[]', candles || 0, hearts || 0, ascended_candles || 0, image_url || '', is_current ? 1 : 0).run();
    }

    return jsonResponse({ success: true, message: '复刻先祖更新成功' });
  } catch (e) {
    return errorResponse('更新失败: ' + e.message, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
