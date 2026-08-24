// Worker API server for guangyu-friends
import * as mod_api_users__id__follow_stats from './functions/api/users/[id]/follow-stats.js';
import * as mod_api_photos__id__comments from './functions/api/photos/[id]/comments.js';
import * as mod_api_photos__id__favorite from './functions/api/photos/[id]/favorite.js';
import * as mod_api_admin_comment__id_ from './functions/api/admin/comment/[id].js';
import * as mod_api_admin_reports__id_ from './functions/api/admin/reports/[id].js';
import * as mod_api_posts__id__replies from './functions/api/posts/[id]/replies.js';
import * as mod_api_users_run_status from './functions/api/users/run-status.js';
import * as mod_api_users__id__follow from './functions/api/users/[id]/follow.js';
import * as mod_api_admin_photo__id_ from './functions/api/admin/photo/[id].js';
import * as mod_api_photos__id__like from './functions/api/photos/[id]/like.js';
import * as mod_api_admin_comments from './functions/api/admin/comments.js';
import * as mod_api_admin_post__id_ from './functions/api/admin/post/[id].js';
import * as mod_api_admin_user__id_ from './functions/api/admin/user/[id].js';
import * as mod_api_posts__id__like from './functions/api/posts/[id]/like.js';
import * as mod_api_notifications from './functions/api/notifications.js';
import * as mod_api_admin_reports from './functions/api/admin/reports.js';
import * as mod_api_auth_register from './functions/api/auth/register.js';
import * as mod_api_user_password from './functions/api/user/password.js';
import * as mod_api_achievements from './functions/api/achievements.js';
import * as mod_api_admin_photos from './functions/api/admin/photos.js';
import * as mod_api_admin_qrcode from './functions/api/admin/qrcode.js';
import * as mod_api_music_search from './functions/api/music/search.js';
import * as mod_api_user_profile from './functions/api/user/profile.js';
import * as mod_api_user_reports from './functions/api/user/reports.js';
import * as mod_api_admin_posts from './functions/api/admin/posts.js';
import * as mod_api_admin_stats from './functions/api/admin/stats.js';
import * as mod_api_admin_users from './functions/api/admin/users.js';
import * as mod_api_daily_tasks_index from './functions/api/daily-tasks/index.js';
import * as mod_api_music_lyric from './functions/api/music/lyric.js';
import * as mod_api_photos_mine from './functions/api/photos/mine.js';
import * as mod_api_auth_login from './functions/api/auth/login.js';
import * as mod_api_photos__id__index from './functions/api/photos/[id]/index.js';
import * as mod_api_favorites from './functions/api/favorites.js';
import * as mod_api_music_url from './functions/api/music/url.js';
import * as mod_api_posts__id__index from './functions/api/posts/[id]/index.js';
import * as mod_api_messages from './functions/api/messages.js';
import * as mod_api_exchange_index from './functions/api/exchange/index.js';
import * as mod_api_rankings_index from './functions/api/rankings/index.js';
import * as mod_api_user__id_ from './functions/api/user/[id].js';
import * as mod_api_auth_me from './functions/api/auth/me.js';
import * as mod_api_reports_index from './functions/api/reports/index.js';
import * as mod_api_spirits_index from './functions/api/spirits/index.js';
import * as mod_api_qrcode from './functions/api/qrcode.js';
import * as mod_api_photos_index from './functions/api/photos/index.js';
import * as mod_api_stats from './functions/api/stats.js';
import * as mod_api_posts_index from './functions/api/posts/index.js';
import * as mod_api_init from './functions/api/init.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    
    if (path.startsWith('/api/')) {
      const urlParts = path.strip('/').split('/');
      
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'users' && urlParts[3] === 'follow-stats' && (method === 'GET')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_users__id__follow_stats['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_users__id__follow_stats.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'photos' && urlParts[3] === 'comments' && (method === 'GET' || method === 'POST')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_photos__id__comments['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_photos__id__comments.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'photos' && urlParts[3] === 'favorite' && (method === 'POST')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_photos__id__favorite['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_photos__id__favorite.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'comment' && (method === 'DELETE')) {
    const params = {};
        params['id'] = urlParts[3];
    const handler = mod_api_admin_comment__id_['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_comment__id_.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'reports' && (method === 'PUT')) {
    const params = {};
        params['id'] = urlParts[3];
    const handler = mod_api_admin_reports__id_['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_reports__id_.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'posts' && urlParts[3] === 'replies' && (method === 'GET' || method === 'POST')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_posts__id__replies['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_posts__id__replies.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'users' && urlParts[2] === 'run-status' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_users_run_status['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_users_run_status.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'users' && urlParts[3] === 'follow' && (method === 'POST')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_users__id__follow['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_users__id__follow.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'photo' && (method === 'PUT' || method === 'DELETE')) {
    const params = {};
        params['id'] = urlParts[3];
    const handler = mod_api_admin_photo__id_['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_photo__id_.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'photos' && urlParts[3] === 'like' && (method === 'POST')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_photos__id__like['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_photos__id__like.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'comments' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_admin_comments['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_comments.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'post' && (method === 'DELETE')) {
    const params = {};
        params['id'] = urlParts[3];
    const handler = mod_api_admin_post__id_['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_post__id_.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'user' && (method === 'PUT' || method === 'DELETE')) {
    const params = {};
        params['id'] = urlParts[3];
    const handler = mod_api_admin_user__id_['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_user__id_.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 4 && urlParts[0] === 'api' && urlParts[1] === 'posts' && urlParts[3] === 'like' && (method === 'POST')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_posts__id__like['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_posts__id__like.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'notifications' && (method === 'GET' || method === 'PUT')) {
    const params = {};
    
    const handler = mod_api_notifications['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_notifications.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'reports' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_admin_reports['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_reports.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'auth' && urlParts[2] === 'register' && (method === 'POST')) {
    const params = {};
    
    const handler = mod_api_auth_register['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_auth_register.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'user' && urlParts[2] === 'password' && (method === 'PUT')) {
    const params = {};
    
    const handler = mod_api_user_password['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_user_password.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'achievements' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_achievements['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_achievements.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'photos' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_admin_photos['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_photos.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'qrcode' && (method === 'PUT')) {
    const params = {};
    
    const handler = mod_api_admin_qrcode['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_qrcode.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'music' && urlParts[2] === 'search' && (true)) {
    const params = {};
    
    const handler = mod_api_music_search.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'user' && urlParts[2] === 'profile' && (method === 'PUT')) {
    const params = {};
    
    const handler = mod_api_user_profile['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_user_profile.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'user' && urlParts[2] === 'reports' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_user_reports['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_user_reports.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'posts' && (method === 'GET' || method === 'DELETE')) {
    const params = {};
    
    const handler = mod_api_admin_posts['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_posts.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'stats' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_admin_stats['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_stats.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'admin' && urlParts[2] === 'users' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_admin_users['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_admin_users.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'daily-tasks' && (method === 'GET' || method === 'POST')) {
    const params = {};
    
    const handler = mod_api_daily_tasks_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_daily_tasks_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'music' && urlParts[2] === 'lyric' && (true)) {
    const params = {};
    
    const handler = mod_api_music_lyric.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'photos' && urlParts[2] === 'mine' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_photos_mine['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_photos_mine.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'auth' && urlParts[2] === 'login' && (method === 'POST')) {
    const params = {};
    
    const handler = mod_api_auth_login['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_auth_login.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'photos' && (method === 'GET' || method === 'DELETE')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_photos__id__index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_photos__id__index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'favorites' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_favorites['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_favorites.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'music' && urlParts[2] === 'url' && (true)) {
    const params = {};
    
    const handler = mod_api_music_url.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'posts' && (method === 'GET' || method === 'DELETE')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_posts__id__index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_posts__id__index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'messages' && (method === 'GET' || method === 'POST')) {
    const params = {};
    
    const handler = mod_api_messages['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_messages.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'exchange' && (method === 'GET' || method === 'POST')) {
    const params = {};
    
    const handler = mod_api_exchange_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_exchange_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'exchange' && method === 'DELETE') {
    const params = {};
    params['id'] = urlParts[2];
    const handler = mod_api_exchange_index['onRequestDelete'] || mod_api_exchange_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'rankings' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_rankings_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_rankings_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'user' && (method === 'GET')) {
    const params = {};
        params['id'] = urlParts[2];
    const handler = mod_api_user__id_['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_user__id_.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 3 && urlParts[0] === 'api' && urlParts[1] === 'auth' && urlParts[2] === 'me' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_auth_me['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_auth_me.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'reports' && (method === 'POST')) {
    const params = {};
    
    const handler = mod_api_reports_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_reports_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'spirits' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_spirits_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_spirits_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'qrcode' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_qrcode['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_qrcode.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'photos' && (method === 'GET' || method === 'POST')) {
    const params = {};
    
    const handler = mod_api_photos_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_photos_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'stats' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_stats['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_stats.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'posts' && (method === 'GET' || method === 'POST')) {
    const params = {};
    
    const handler = mod_api_posts_index['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_posts_index.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
  if (urlParts.length === 2 && urlParts[0] === 'api' && urlParts[1] === 'init' && (method === 'GET')) {
    const params = {};
    
    const handler = mod_api_init['onRequest' + method.charAt(0) + method.slice(1).toLowerCase()] || mod_api_init.onRequest;
    if (handler) {
      const ctx = { request, env, params, waitUntil: () => {} };
      return handler(ctx);
    }
  }
      
      return new Response(JSON.stringify({ success: false, error: 'API endpoint not found: ' + path }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
    
    return new Response('guangyu-friends API worker', { headers: CORS_HEADERS });
  }
};
