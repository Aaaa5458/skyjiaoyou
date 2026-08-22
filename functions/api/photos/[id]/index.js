// GET /api/photos/[id] - 照片详情
import { getAuthUser, jsonResponse } from '../../../_lib/utils.js';

export async function onRequestGet({ request, env, params }) {
  try {
    const user = await getAuthUser(request, env);
    const photo = await env.DB.prepare(
      'SELECT p.*, u.username, u.nickname, u.avatar FROM photos p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?'
    ).bind(params.id).first();
    
    if (!photo) return jsonResponse({ success: false, error: '照片不存在' }, 404);
    
    // 下架的照片只有上传者本人可见
    if (photo.status === 'removed' && (!user || user.id !== photo.user_id && !user.is_admin)) {
      return jsonResponse({ success: false, error: '该照片已被下架', removed: true }, 403);
    }
    
    // 增加浏览量
    await env.DB.prepare('UPDATE photos SET views = views + 1 WHERE id = ?').bind(params.id).run();
    photo.views = (photo.views || 0) + 1;
    
    // 检查当前用户是否已点赞/收藏
    let liked = false, favorited = false;
    if (user) {
      const like = await env.DB.prepare('SELECT id FROM likes WHERE user_id = ? AND photo_id = ?').bind(user.id, params.id).first();
      const fav = await env.DB.prepare('SELECT id FROM favorites WHERE user_id = ? AND photo_id = ?').bind(user.id, params.id).first();
      liked = !!like;
      favorited = !!fav;
    }
    
    return jsonResponse({ success: true, photo, liked, favorited, isOwner: user && user.id === photo.user_id });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}


export async function onRequestDelete({ request, env, params }) {
  const user = await getAuthUser(request, env);
  if (!user) return jsonResponse({ success: false, error: '请先登录' }, 401);
  
  try {
    const photo = await env.DB.prepare('SELECT user_id FROM photos WHERE id = ?').bind(params.id).first();
    if (!photo) return jsonResponse({ success: false, error: '照片不存在' }, 404);
    if (photo.user_id !== user.id && !user.is_admin) return jsonResponse({ success: false, error: '无权删除此照片' }, 403);
    
    await env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM likes WHERE photo_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM favorites WHERE photo_id = ?').bind(params.id).run();
    await env.DB.prepare('DELETE FROM comments WHERE photo_id = ?').bind(params.id).run();
    
    return jsonResponse({ success: true });
  } catch (e) {
    return jsonResponse({ success: false, error: '删除失败' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
