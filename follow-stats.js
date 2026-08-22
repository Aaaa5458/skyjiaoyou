// GET /api/users/[id]/follow-stats - 获取关注数和粉丝数
import { jsonResponse } from '../../../_lib/utils.js';

export async function onRequestGet({ env, params }) {
  try {
    const followers = await env.DB.prepare('SELECT COUNT(*) as count FROM follows WHERE following_id = ?').bind(params.id).first();
    const following = await env.DB.prepare('SELECT COUNT(*) as count FROM follows WHERE follower_id = ?').bind(params.id).first();
    return jsonResponse({ success: true, followers: followers.count, following: following.count });
  } catch (e) {
    return jsonResponse({ success: false, error: '获取失败' }, 500);
  }
}
