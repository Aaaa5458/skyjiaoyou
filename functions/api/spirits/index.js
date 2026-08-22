// 复刻先祖信息 API
import { jsonResponse } from '../../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const current = url.searchParams.get('current');

  let query = "SELECT * FROM traveling_spirits";
  const params = [];
  if (current === '1') {
    query += " WHERE is_current = 1";
  }
  query += " ORDER BY is_current DESC, start_time DESC LIMIT 10";

  const spirits = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ success: true, spirits: spirits.results });
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
