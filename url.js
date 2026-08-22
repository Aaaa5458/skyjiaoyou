// QQ音乐播放链接获取（带备用方案）
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const songmid = url.searchParams.get('id') || '';

  if (!songmid) {
    return Response.json({ success: false, error: '缺少歌曲ID' });
  }

  // 备用歌曲直接返回预设音频
  if (songmid.startsWith('fallback_')) {
    const idx = parseInt(songmid.split('_')[1]) || 1;
    const urls = [
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    ];
    return Response.json({ success: true, url: urls[(idx - 1) % urls.length], fallback: true });
  }

  try {
    const apiUrl = `https://u.y.qq.com/cgi-bin/musicu.fcg?data=${encodeURIComponent(JSON.stringify({
      req: {
        module: 'CDN.SrfCdnDispatchServer',
        method: 'GetCdnDispatch',
        param: { guid: '10000', calltype: 0, userip: '' }
      },
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: '10000',
          songmid: [songmid],
          songtype: [0],
          uin: '0',
          loginflag: 1,
          platform: '20'
        }
      }
    }))}`;

    const resp = await fetch(apiUrl, {
      headers: {
        'Referer': 'https://y.qq.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const data = await resp.json();
    
    const vkey = data.req_0?.data?.midurlinfo?.[0]?.purl || '';
    const sip = data.req?.data?.sip?.[0] || 'https://dl.stream.qqmusic.qq.com/';
    
    if (vkey) {
      return Response.json({ success: true, url: sip + vkey });
    } else {
      // vkey获取失败，降级到备用歌曲
      const fallbackUrls = [
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      ];
      const idx = Math.abs(songmid.charCodeAt(0)) % fallbackUrls.length;
      return Response.json({ 
        success: true, 
        url: fallbackUrls[idx], 
        fallback: true,
        note: 'QQ音乐直链暂不可用，已切换到备用音源'
      });
    }
  } catch (e) {
    return Response.json({ success: false, error: '获取播放链接失败' });
  }
}
