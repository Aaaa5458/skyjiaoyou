// GET /api/achievements - 获取成就列表和用户已获得成就
import { getAuthUser, jsonResponse, safeError } from '../_lib/utils.js';

export async function onRequestGet({ request, env }) {
  try {
    const user = await getAuthUser(request, env);
    const defs = await env.DB.prepare('SELECT id, name, description, icon FROM achievement_defs ORDER BY id').all();
    let earned = [];
    if (user) {
      const userAch = await env.DB.prepare('SELECT achievement_id FROM user_achievements WHERE user_id = ?').bind(user.id).all();
      earned = userAch.results.map(r => r.achievement_id);
      // 自动检测并授予"初入光遇"成就
      if (!earned.includes('first_light')) {
        await env.DB.prepare('INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)').bind(user.id, 'first_light').run();
        earned.push('first_light');
      }
    }
    return jsonResponse({ success: true, achievements: defs.results, earned });
  } catch (e) {
    return safeError(e, 'GET /achievements');
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
