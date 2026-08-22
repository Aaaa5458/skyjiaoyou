// POST /api/photos - 上传照片（默认待审核）
// GET /api/photos - 获取已上架照片列表（分页）
import { getAuthUser, jsonResponse, errorResponse, sanitize } from '../../_lib/utils.js';

function genId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function onRequestPost({ request, env }) {
  const user = await getAuthUser(request, env);
  if (!user) return errorResponse('请先登录', 401);

  try {
    const raw = await request.json();
    const data_url = raw.data_url || '';
    const title = sanitize(raw.title, 50);
    const description = sanitize(raw.description, 200);
    if (!data_url) return errorResponse('缺少图片数据', 400);
    // MIME校验：仅允许图片格式
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    const mimeMatch = data_url.match(/^data:([^;]+);base64,/);
    if (!mimeMatch || !allowedMimes.includes(mimeMatch[1])) {
      return errorResponse('仅支持PNG/JPEG/WebP/GIF格式图片', 400);
    }
    
    const id = genId();
    await env.DB.prepare(
      'INSERT INTO photos (id, user_id, data_url, title, description, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, user.id, data_url, title || '', description || '', 'pending').run();
    
    return jsonResponse({ success: true, id, status: 'pending' });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 12;
    const offset = (page - 1) * limit;
    const sort = url.searchParams.get('sort') || 'new';
    
    let orderBy = 'p.created_at DESC';
    if (sort === 'hot') orderBy = 'p.likes DESC, p.created_at DESC';
    
    const result = await env.DB.prepare(
      `SELECT p.id, p.user_id, p.data_url, p.title, p.description, p.status, p.likes, p.views, p.created_at, u.username, u.nickname, u.avatar 
       FROM photos p LEFT JOIN users u ON p.user_id = u.id 
       WHERE p.status = 'approved' 
       ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();
    
    const totalResult = await env.DB.prepare("SELECT COUNT(*) as count FROM photos WHERE status = 'approved'").first();
    return jsonResponse({ success: true, photos: result.results, total: totalResult.count, page, limit });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}
