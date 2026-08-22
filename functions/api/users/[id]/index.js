// GET /api/users/[id] - 获取用户公开信息
import { getAuthUser, jsonResponse, errorResponse } from '../../../_lib/utils.js';

export async function onRequestGet({ request, env, params }) {
  try {
    const userId = parseInt(params.id);
    if (!userId || isNaN(userId)) {
      return errorResponse('用户ID无效', 400);
    }

    const currentUser = await getAuthUser(request, env);
    const isOwner = currentUser && currentUser.id === userId;

    const user = await env.DB.prepare(
      'SELECT id, username, nickname, avatar, avatar_style, bio, constellation, resident_map, instrument, online_time, play_style, wing_count, replica_preference, highlights, achievements, is_admin, created_at, watermark, watermark_text FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    // 统计数据
    const postCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND status = ?'
    ).bind(userId, 'approved').first();

    const photoCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM photos WHERE user_id = ? AND status = ?'
    ).bind(userId, 'approved').first();

    // 关注状态
    let isFollowing = false;
    if (currentUser && !isOwner) {
      const follow = await env.DB.prepare(
        'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?'
      ).bind(currentUser.id, userId).first();
      isFollowing = !!follow;
    }

    // 关注统计
    const followingCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?'
    ).bind(userId).first();

    const followerCount = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = ?'
    ).bind(userId).first();

    function safeParse(v, def) {
      if (!v) return def;
      try { return JSON.parse(v); } catch (e) { return def; }
    }

    return jsonResponse({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        avatar_style: safeParse(user.avatar_style, null),
        bio: user.bio || '',
        constellation: user.constellation || '',
        resident_map: user.resident_map || '',
        instrument: user.instrument || '',
        online_time: user.online_time || '',
        play_style: user.play_style || '',
        wing_count: user.wing_count || 0,
        replica_preference: user.replica_preference || '',
        highlights: safeParse(user.highlights, []),
        achievements: safeParse(user.achievements, []),
        is_admin: user.is_admin,
        created_at: user.created_at,
        post_count: postCount.count,
        photo_count: photoCount.count,
        following_count: followingCount.count,
        follower_count: followerCount.count,
        is_following: isFollowing,
        is_owner: isOwner
      }
    });
  } catch (e) {
    console.error('get user error:', e);
    return errorResponse('服务器开小差了，请稍后重试', 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
