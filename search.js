// QQ音乐搜索代理（带备用方案）
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  if (!keyword) {
    return Response.json({ success: false, error: '请输入搜索关键词' });
  }

  try {
    const searchUrl = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?w=${encodeURIComponent(keyword)}&p=${page}&n=${limit}&format=json&cr=1`;
    const resp = await fetch(searchUrl, {
      headers: {
        'Referer': 'https://y.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cf: { cacheTtl: 60 }
    });
    
    if (!resp.ok) {
      throw new Error('HTTP ' + resp.status);
    }
    
    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // QQ音乐有时返回JSONP格式，尝试提取
      const match = text.match(/callback\((.*)\)/);
      if (match) data = JSON.parse(match[1]);
      else throw new Error('Invalid JSON');
    }
    
    const songs = data.data?.song?.list || [];
    if (songs.length === 0) {
      return Response.json({ success: true, songs: getFallbackSongs(keyword), total: 0, fallback: true });
    }
    
    const result = songs.map(s => ({
      id: s.songmid,
      song_id: s.songid,
      name: s.songname,
      artist: (s.singer || []).map(a => a.name).join('/'),
      album: s.albumname,
      duration: s.interval,
      cover: s.albummid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${s.albummid}.jpg?max_age=2592000` : ''
    }));

    return Response.json({ success: true, songs: result, total: data.data?.song?.total || 0 });
  } catch (e) {
    // 备用方案：返回预设歌曲
    return Response.json({ 
      success: true, 
      songs: getFallbackSongs(keyword), 
      total: 0, 
      fallback: true,
      note: 'QQ音乐接口暂不可用，显示推荐歌曲'
    });
  }
}

function getFallbackSongs(keyword) {
  const all = [
    { id: 'fallback_1', name: '光遇·晨岛', artist: '光遇OST', album: 'Sky', duration: 180, cover: '' },
    { id: 'fallback_2', name: '光遇·云野', artist: '光遇OST', album: 'Sky', duration: 200, cover: '' },
    { id: 'fallback_3', name: '光遇·雨林', artist: '光遇OST', album: 'Sky', duration: 220, cover: '' },
    { id: 'fallback_4', name: '光遇·霞谷', artist: '光遇OST', album: 'Sky', duration: 190, cover: '' },
    { id: 'fallback_5', name: '光遇·墓土', artist: '光遇OST', album: 'Sky', duration: 210, cover: '' },
    { id: 'fallback_6', name: '光遇·禁阁', artist: '光遇OST', album: 'Sky', duration: 240, cover: '' },
    { id: 'fallback_7', name: '光遇·伊甸', artist: '光遇OST', album: 'Sky', duration: 260, cover: '' },
    { id: 'fallback_8', name: '天空之城', artist: '久石让', album: '宫崎骏动画', duration: 300, cover: '' },
  ];
  // 简单过滤
  const kw = keyword.toLowerCase();
  const filtered = all.filter(s => s.name.toLowerCase().includes(kw) || s.artist.toLowerCase().includes(kw));
  return filtered.length > 0 ? filtered : all;
}
