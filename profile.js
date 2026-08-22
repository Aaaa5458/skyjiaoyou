// PUT /api/user/profile - 更新用户资料
import { getAuthUser, jsonResponse, errorResponse, sanitize, safeError } from '../../_lib/utils.js';

export async function onRequestPut({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('未登录或登录已过期', 401);
  
  let body;
  try { body = await request.json(); } catch (e) { return errorResponse('请求格式错误', 400); }
  
  const fields = ['nickname','avatar','bindings','watermark','constellation','resident_map','instrument','online_time','bio','theme','play_style','wing_count','replica_preference','watermark_text','run_status','run_status_expire','highlights','achievements','is_new','avatar_style','game_duration','tags'];
  const updates = [];
  const values = [];
  
  for (const f of fields) {
    if (body[f] !== undefined) {
      if (f === 'nickname' && (body[f].length < 1 || body[f].length > 20)) return errorResponse('昵称长度需在1-20个字符之间', 400);
      if (['nickname','bio','constellation','resident_map','instrument','online_time','tags'].includes(f)) body[f] = sanitize(body[f], f==='bio'?200:50);
      updates.push(f + ' = ?');
      if (f === 'bindings' || f === 'highlights' || f === 'achievements' || f === 'avatar_style') {
        values.push(JSON.stringify(body[f]));
      } else if (f === 'watermark' || f === 'is_new') {
        values.push(body[f] ? 1 : 0);
      } else {
        values.push(body[f]);
      }
    }
  }
  
  if (updates.length === 0) return errorResponse('没有需要更新的字段', 400);
  
  updates.push("updated_at = datetime('now')");
  values.push(user.id);
  
  try {
    await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
    
    const updated = await env.DB.prepare(
      'SELECT id, username, email, nickname, avatar, bindings, watermark, is_admin, constellation, resident_map, instrument, online_time, bio, theme, play_style, wing_count, replica_preference, watermark_text, run_status, run_status_expire, highlights, achievements, is_new, avatar_style, game_duration, tags FROM users WHERE id = ?'
    ).bind(user.id).first();
    
    return jsonResponse({ success: true, user: {
      ...updated,
      bindings: updated.bindings ? JSON.parse(updated.bindings) : {},
      highlights: updated.highlights ? JSON.parse(updated.highlights) : [],
      achievements: updated.achievements ? JSON.parse(updated.achievements) : [],
      avatar_style: updated.avatar_style ? JSON.parse(updated.avatar_style) : null
    }});
  } catch (e) {
    return safeError(e, 'PUT /user/profile');
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
