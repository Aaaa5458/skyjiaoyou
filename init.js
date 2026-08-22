// 初始化示例数据（仅在数据为空时插入）
import { jsonResponse } from '../_lib/utils.js';

const SAMPLE_POSTS = [
  { content: '雨林跑图求带，萌新一枚，每天晚上在线～可以加我一起玩！', tag: '找固玩', likes: 23 },
  { content: '找个固玩一起打卡景点，我会弹琴！会弹好几首光遇OST～', tag: '找固玩', likes: 45 },
  { content: '监护dd，本人听话不粘人，会跑图会献祭，求个有耐心的监护', tag: '找监护人', likes: 31 },
  { content: '找崽崽，我有耐心，带你跑全图，教你弹琴打卡景点', tag: '找崽', likes: 18 },
  { content: '今天在云野遇到了一个很可爱的小黑，一起坐了好久，可惜没加好友😭', tag: '日常分享', likes: 67 },
  { content: '求问暴风眼第二段怎么飞？每次都被砸掉翼，有大佬教教吗', tag: '攻略求助', likes: 12 },
];

export async function onRequestGet({ env }) {
  try {
    const postCount = await env.DB.prepare('SELECT COUNT(*) as cnt FROM posts').first();
    const userResult = await env.DB.prepare('SELECT id FROM users ORDER BY id ASC LIMIT 1').first();
    
    if (!userResult) {
      return jsonResponse({ success: false, error: '没有用户，无法初始化示例数据' });
    }
    
    const userId = userResult.id;
    let insertedPosts = 0;
    
    if (postCount.cnt < 3) {
      for (const post of SAMPLE_POSTS) {
        const id = 'post_sample_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const hoursAgo = Math.floor(Math.random() * 48) + 1;
        const createdAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
        await env.DB.prepare(
          'INSERT INTO posts (id, user_id, content, tag, like_count, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, userId, post.content, post.tag, post.likes, 'approved', createdAt).run();
        insertedPosts++;
      }
    }
    
    return jsonResponse({ 
      success: true, 
      message: '示例数据初始化完成', 
      insertedPosts,
      userId,
      totalPosts: postCount.cnt + insertedPosts
    });
  } catch (e) {
    return jsonResponse({ success: false, error: '服务器开小差了，请稍后重试' }, 500);
  }
}
