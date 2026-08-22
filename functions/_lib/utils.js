// XSS防护：清理用户输入
// CORS处理：仅允许自有域名
export function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = origin.includes('guangyu-friends.pages.dev') || origin.includes('localhost') || origin === '';
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://guangyu-friends.pages.dev',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  };
}
export function sanitize(str, maxLen = 500) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<\/?[a-z][\s\S]*?>/gi, '')  // 移除所有HTML标签
    .replace(/javascript:/gi, '')            // 移除javascript协议
    .replace(/on\w+=/gi, '')                // 移除事件处理器
    .replace(/<script[\s\S]*?<\/script>/gi, '') // 移除script标签
    .trim()
    .slice(0, maxLen);
}

// ===== 设备类型检测 =====
export function detectDeviceType(request) {
  const ua = (request.headers.get('User-Agent') || '').toLowerCase();
  const mobilePatterns = [
    /android/, /iphone/, /ipad/, /ipod/, /blackberry/,
    /windows phone/, /opera mini/, /iemobile/, /mobile/,
    /webos/, /symbian/, /series40/, /nokia/, /sony/,
    /samsung/, /htc/, /lg /, /mot /
  ];
  for (const p of mobilePatterns) {
    if (p.test(ua)) return 'mobile';
  }
  return 'desktop';
}

// 生成随机会话ID
export function generateSessionId() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return 'sess_' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 共享工具函数 - 密码哈希、JWT、认证中间件
// JWT 密钥 - 生产环境应使用环境变量，此处用固定密钥用于演示
const JWT_SECRET = 'guangyu-friends-jwt-secret-2026-change-in-production';
// 生成随机盐
export async function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}
// PBKDF2 密码哈希
export async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const saltBuffer = enc.encode(salt);
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
}
// 验证密码
export async function verifyPassword(password, salt, hash) {
  const computed = await hashPassword(password, salt);
  return computed === hash;
}
// Base64URL 编码
function base64UrlEncode(str) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}
// 生成 JWT
export async function generateToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + 7 * 24 * 3600 }; // 7天过期
  
  const headerStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify(fullPayload)));
  
  const data = `${headerStr}.${payloadStr}`;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigStr = base64UrlEncode(signature);
  
  return `${data}.${sigStr}`;
}
// 验证 JWT
export async function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerStr, payloadStr, sigStr] = parts;
    const data = `${headerStr}.${payloadStr}`;
    
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    
    const sigBytes = Uint8Array.from(base64UrlDecode(sigStr), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
    if (!valid) return null;
    
    const payload = JSON.parse(base64UrlDecode(payloadStr));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    
    return payload;
  } catch (e) {
    return null;
  }
}
// 从请求中获取认证用户（含会话验证）
export async function getAuthUser(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  // 验证会话是否有效（如果token中包含sessionId）
  if (payload.sessionId) {
    const session = await env.DB.prepare(
      'SELECT id, user_id FROM sessions WHERE id = ?'
    ).bind(payload.sessionId).first();
    if (!session || session.user_id !== payload.userId) {
      // 会话不存在或不匹配，说明被踢出了
      return null;
    }
    // 更新最后活跃时间
    try {
      await env.DB.prepare(
        'UPDATE sessions SET last_active_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(payload.sessionId).run();
    } catch (e) { /* 忽略更新失败 */ }
  }
  
  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(payload.userId).first();
  
  if (!user || user.is_banned) return null;
  return user;
}

// 从请求中获取会话ID
export async function getSessionId(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  return payload ? payload.sessionId : null;
}

// JSON 响应
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
// 错误响应
export function errorResponse(message, status = 400) {
  return jsonResponse({ success: false, error: message }, status);
}
// 安全错误处理：记录详细日志，对外返回友好文案
export function safeError(e, context = '') {
  console.error(`[ERROR] ${context}:`, e.message || e, e.stack || '');
  return errorResponse('服务器开小差了，请稍后重试', 500);
}
// 资源不存在
export function notFound(message = '资源不存在') {
  return errorResponse(message, 404);
}
// 简易速率限制（内存缓存，同Worker实例内有效）
const rateLimitMap = new Map();
export function checkRateLimit(request, action, maxRequests, windowSeconds = 60) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const key = `${action}:${ip}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  let records = rateLimitMap.get(key) || [];
  records = records.filter(t => now - t < windowMs);
  if (records.length >= maxRequests) {
    rateLimitMap.set(key, records);
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - records[0])) / 1000) };
  }
  records.push(now);
  rateLimitMap.set(key, records);
  return { allowed: true };
}
// 管理员验证中间件
export async function requireAdmin(request, env) {
  const user = await getAuthUser(request, env);
  if (!user) return { error: errorResponse('未登录', 401) };
  if (!user.is_admin) return { error: errorResponse('无管理员权限', 403) };
  return { user };
}
