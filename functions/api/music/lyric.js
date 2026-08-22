// QQ音乐歌词获取
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const songmid = url.searchParams.get('id') || '';

  if (!songmid) {
    return Response.json({ success: false, error: '缺少歌曲ID' });
  }

  try {
    const apiUrl = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg?songmid=${songmid}&format=json&nobase64=1`;
    const resp = await fetch(apiUrl, {
      headers: {
        'Referer': 'https://y.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await resp.json();
    
    const lyric = data.lyric || '';
    // 解析LRC歌词
    const lines = lyric.split('\n').filter(l => l.trim());
    const parsed = lines.map(line => {
      const match = line.match(/\[(\d+):(\d+\.?\d*)\](.*)/);
      if (match) {
        const time = parseInt(match[1]) * 60 + parseFloat(match[2]);
        return { time, text: match[3].trim() };
      }
      return null;
    }).filter(Boolean);

    return Response.json({ success: true, lyric: parsed, raw: lyric });
  } catch (e) {
    return Response.json({ success: false, error: '获取歌词失败', lyric: [] });
  }
}
