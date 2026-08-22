// localStorage API Mock - 拦截所有/api/*请求，用localStorage模拟后端
(function(){
  const DB_KEY = 'gy_local_db';
  const TOKEN_KEY = 'gy_token';
  
  // 初始化数据库
  function initDB(){
    if(localStorage.getItem(DB_KEY)) return;
    const db = {
      users: [
        {id:1, username:'admin', password:hash('admin123'), nickname:'管理员', email:'', is_admin:1, created_at:'2026-01-01 00:00:00', avatar_style:{hair:'default',cloak:'#f5a623'}, bio:'光遇交友管理员', constellation:'', resident_map:'', instrument:'', online_time:'', tags:'', run_status:'', run_status_expire:'', watermark:1, watermark_text:'光遇交友', theme:'dark', bindings:{}, highlights:'', achievements:'[]', is_new:0, game_duration:'', privacy:{profile_visible:'all',posts_visible:'all',photos_visible:'all',favorites_visible:'self',following_visible:'all',show_in_runlist:1}},
        {id:2, username:'traveler01', password:hash('test123456'), nickname:'雨林旅人', email:'', is_admin:0, created_at:'2026-06-01 10:00:00', avatar_style:{hair:'mushroom',cloak:'#3498db'}, bio:'喜欢在雨林弹琴', constellation:'天秤座', resident_map:'雨林', instrument:'钢琴', online_time:'每天晚上8-11点', tags:'风景党,弹琴爱好者', run_status:'', run_status_expire:'', watermark:0, watermark_text:'', theme:'light', bindings:{}, highlights:'', achievements:'[]', is_new:0, game_duration:'', privacy:{profile_visible:'all',posts_visible:'all',photos_visible:'all',favorites_visible:'self',following_visible:'all',show_in_runlist:1}},
        {id:3, username:'traveler02', password:hash('test123456'), nickname:'霞谷飞人', email:'', is_admin:0, created_at:'2026-07-15 14:00:00', avatar_style:{hair:'afro',cloak:'#e74c3c'}, bio:'跑图机器一枚', constellation:'白羊座', resident_map:'霞谷', instrument:'鼓', online_time:'周末全天', tags:'跑图机器,献祭狂人', run_status:'霞谷跑图中', run_status_expire:Date.now()+3600000, watermark:0, watermark_text:'', theme:'dark', bindings:{}, highlights:'', achievements:'[]', is_new:0, game_duration:'', privacy:{profile_visible:'all',posts_visible:'all',photos_visible:'all',favorites_visible:'self',following_visible:'all',show_in_runlist:1}}
      ],
      posts: [
        {id:'post_demo1', user_id:2, content:'雨林跑图求带，萌新一枚，每天晚上在线～', tag:'找固玩', is_anonymous:0, like_count:15, reply_count:3, status:'approved', created_at:'2026-08-20 20:00:00'},
        {id:'post_demo2', user_id:3, content:'找个固玩一起打卡景点，我会弹琴！', tag:'找固玩', is_anonymous:0, like_count:28, reply_count:5, status:'approved', created_at:'2026-08-21 10:00:00'},
        {id:'post_demo3', user_id:2, content:'监护dd，本人听话不粘人，会跑图会献祭', tag:'找监护人', is_anonymous:0, like_count:42, reply_count:8, status:'approved', created_at:'2026-08-21 15:00:00'},
        {id:'post_demo4', user_id:3, content:'今天在霞谷看到了超美的日落，分享给大家～', tag:'日常分享', is_anonymous:0, like_count:56, reply_count:12, status:'approved', created_at:'2026-08-22 09:00:00'},
        {id:'post_demo5', user_id:1, content:'找崽崽，我有耐心，带你跑全图', tag:'找崽', is_anonymous:0, like_count:33, reply_count:6, status:'approved', created_at:'2026-08-22 11:00:00'}
      ],
      post_likes: [],
      post_replies: [
        {id:1, post_id:'post_demo1', user_id:3, content:'我可以！加个好友吧', is_anonymous:0, created_at:'2026-08-20 21:00:00'},
        {id:2, post_id:'post_demo2', user_id:2, content:'弹琴太棒了！', is_anonymous:0, created_at:'2026-08-21 11:00:00'}
      ],
      photos: [
        {id:'photo_demo1', user_id:2, title:'雨林神庙', description:'雨后的神庙格外宁静', data_url:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJkNmE0ZiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjI0Ij7pm6jmnpfnpZ7lupk8L3RleHQ+PC9zdmc+', likes:12, comments:2, status:'approved', created_at:'2026-08-20 18:00:00'},
        {id:'photo_demo2', user_id:3, title:'霞谷日落', description:'最美的风景在终点', data_url:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY4YTAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojYzAzODNhIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZ3JhZCkiLz48dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSIyNCI+6Zye6LC35pel6JC9PC90ZXh0Pjwvc3ZnPg==', likes:25, comments:4, status:'approved', created_at:'2026-08-21 17:00:00'}
      ],
      photo_likes: [],
      favorites: [],
      comments: [
        {id:1, photo_id:'photo_demo1', user_id:3, content:'太美了！', created_at:'2026-08-20 19:00:00'},
        {id:2, photo_id:'photo_demo2', user_id:2, content:'求带！', created_at:'2026-08-21 18:00:00'}
      ],
      follows: [],
      messages: [],
      reports: [],
      notifications: [],
      settings: [
        {key:'group_qrcode', value:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTIwIiB5PSIyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMjAiIHk9IjEyMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIxNDAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI0MCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIxMDAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIi8+PHJlY3QgeD0iMTQwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg=='},
        {key:'site_title', value:'光遇交友'},
        {key:'site_subtitle', value:'旅人社交平台'}
      ],
      exchange_posts: [
        {id:'ep_demo1', user_id:2, type:'heart', server:'国服', content:'每天稳定互心，有意私信', status:'active', created_at:'2026-08-22 08:00:00'},
        {id:'ep_demo2', user_id:3, type:'fire', server:'国服', content:'互火互火，星盘已满30人', status:'active', created_at:'2026-08-22 09:00:00'}
      ],
      traveling_spirits: [
        {id:1, name:'回旋大师', season:'梦想季', start_time:'2026-08-13', end_time:'2026-08-16', items:JSON.stringify(['旋转动作','紫色斗篷','发型','面具']), candles:112, hearts:2, ascended_candles:2, image_url:null, is_current:1, created_at:'2026-08-13 00:00:00'}
      ],
      daily_tasks: [
        {id:1, task_date:new Date().toISOString().slice(0,10), task1:'在雨林神庙冥想', task2:'点亮一位玩家', task3:'接受一位朋友的礼物', task4:'追逐散落星光', season_candles:'雨林', big_candles:'云野、雨林、暮土', created_at:new Date().toISOString().slice(0,10)+' 00:00:00'}
      ],
      task_checkins: [],
      achievement_defs: [
        {id:'first_post', name:'初次发声', description:'发布第一条留言', icon:'💬'},
        {id:'first_photo', name:'光影记录者', description:'上传第一张截图', icon:'📷'},
        {id:'warm_traveler', name:'温暖旅人', description:'收到10个赞', icon:'❤️'},
        {id:'hot_creator', name:'热门创作者', description:'一条留言获得20赞', icon:'🔥'},
        {id:'social_butterfly', name:'社交达人', description:'关注5位旅人', icon:'🦋'},
        {id:'collector', name:'收藏家', description:'收藏3张截图', icon:'⭐'}
      ],
      user_achievements: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
  
  function hash(pwd){
    let h=0;for(let i=0;i<pwd.length;i++){h=((h<<5)-h)+pwd.charCodeAt(i);h|=0;}return 'h'+Math.abs(h);
  }
  
  function getDB(){return JSON.parse(localStorage.getItem(DB_KEY)||'{}');}
  function saveDB(db){localStorage.setItem(DB_KEY, JSON.stringify(db));}
  
  function genId(prefix){return prefix+'_'+Math.random().toString(36).slice(2,10)+Date.now().toString(36);}
  
  function sanitize(str){
    if(!str)return '';
    return String(str).replace(/<\/?[a-z][\s\S]*?>/gi,'').replace(/javascript:/gi,'').replace(/on\w+=/gi,'').trim().slice(0,500);
  }
  
  function getUserFromToken(token){
    if(!token)return null;
    try{
      const payload=JSON.parse(atob(token.split('.')[1]));
      const db=getDB();
      return db.users.find(u=>u.id===payload.uid)||null;
    }catch(e){return null;}
  }
  
  function makeToken(user){
    const header=btoa(JSON.stringify({alg:'HS256',typ:'JWT'}));
    const payload=btoa(JSON.stringify({uid:user.id,username:user.username,exp:Date.now()+7*86400000}));
    return header+'.'+payload+'.mock';
  }
  
  function json(data,status=200){
    return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
  }
  
  // 拦截fetch
  const origFetch=window.fetch;
  window.fetch=async function(url,opts={}){
    if(typeof url!=='string'||!url.startsWith('/api/')){
      return origFetch.apply(this,arguments);
    }
    
    const path=url.replace('/api','').split('?')[0];
    const method=(opts.method||'GET').toUpperCase();
    const authHeader=opts.headers?.Authorization||opts.headers?.authorization||'';
    const token=authHeader.replace('Bearer ','');
    const user=getUserFromToken(token);
    let body={};
    if(opts.body){try{body=JSON.parse(opts.body);}catch(e){}}
    
    const db=getDB();
    
    try{
      // ===== 认证 =====
      if(path==='/auth/register'&&method==='POST'){
        const {username,password,email,nickname}=body;
        if(!username||!password)return json({success:false,error:'用户名和密码不能为空'});
        if(username.length<2||username.length>20)return json({success:false,error:'用户名长度2-20字符'});
        if(password.length<6||!/[a-zA-Z]/.test(password)||!/[0-9]/.test(password))return json({success:false,error:'密码至少6位，需包含字母和数字'});
        if(db.users.find(u=>u.username===username))return json({success:false,error:'用户名已存在'});
        const newUser={id:db.users.length+1,username,password:hash(password),email:email||'',nickname:nickname||username,is_admin:0,created_at:new Date().toISOString().replace('T',' ').slice(0,19),avatar_style:{hair:'default',cloak:'#f5a623'},bio:'',constellation:'',resident_map:'',instrument:'',online_time:'',tags:'',run_status:'',run_status_expire:'',watermark:0,watermark_text:'',theme:'light',bindings:{},highlights:'',achievements:'[]',is_new:1,game_duration:'',privacy:{profile_visible:'all',posts_visible:'all',photos_visible:'all',favorites_visible:'self',following_visible:'all',show_in_runlist:1}};
        db.users.push(newUser);saveDB(db);
        return json({success:true,token:makeToken(newUser),user:newUser});
      }
      
      if(path==='/auth/login'&&method==='POST'){
        const {username,password}=body;
        const u=db.users.find(x=>x.username===username);
        if(!u||u.password!==hash(password))return json({success:false,error:'用户名或密码错误'});
        return json({success:true,token:makeToken(u),user:u});
      }
      
      if(path==='/auth/me'&&method==='GET'){
        if(!user)return json({success:false,error:'未登录'},401);
        return json({success:true,user});
      }
      
      // ===== 用户资料 =====
      if(path==='/user/profile'&&method==='PUT'){
        if(!user)return json({success:false,error:'未登录'},401);
        const fields=['nickname','email','bio','constellation','resident_map','instrument','online_time','tags','run_status','run_status_expire','watermark','watermark_text','theme','avatar_style','bindings','highlights','game_duration'];
        fields.forEach(f=>{if(body[f]!==undefined)user[f]=body[f];});
        const idx=db.users.findIndex(u=>u.id===user.id);
        db.users[idx]=user;saveDB(db);
        return json({success:true,user});
      }
      
      if(path==='/user/password'&&method==='PUT'){
        if(!user)return json({success:false,error:'未登录'},401);
        const oldPwd=body.old_password||body.oldPassword;
        const newPwd=body.new_password||body.newPassword;
        if(!oldPwd||!newPwd)return json({success:false,error:'请填写完整'});
        if(user.password!==hash(oldPwd))return json({success:false,error:'旧密码错误'});
        if(newPwd.length<6||!/[a-zA-Z]/.test(newPwd)||!/[0-9]/.test(newPwd))return json({success:false,error:'新密码至少6位，需包含字母和数字'});
        user.password=hash(newPwd);
        const idx=db.users.findIndex(u=>u.id===user.id);
        db.users[idx]=user;saveDB(db);
        return json({success:true});
      }
      
      // ===== 隐私设置 =====
      if(path==='/user/privacy'&&method==='GET'){
        if(!user)return json({success:false,error:'未登录'},401);
        const privacy=user.privacy||{profile_visible:'all',posts_visible:'all',photos_visible:'all',favorites_visible:'self',following_visible:'all',show_in_runlist:1};
        return json({success:true,privacy});
      }
      if(path==='/user/privacy'&&method==='PUT'){
        if(!user)return json({success:false,error:'未登录'},401);
        const fields=['profile_visible','posts_visible','photos_visible','favorites_visible','following_visible','show_in_runlist'];
        const privacy=user.privacy||{};
        fields.forEach(f=>{if(body[f]!==undefined)privacy[f]=body[f];});
        user.privacy=privacy;
        const idx=db.users.findIndex(u=>u.id===user.id);
        db.users[idx]=user;saveDB(db);
        return json({success:true,privacy});
      }
      
      // ===== 用户公开主页 =====
      if(path.match(/^\/users\/\d+\/public-profile$/)&&method==='GET'){
        const userId=parseInt(path.split('/')[2]);
        const target=db.users.find(u=>u.id===userId);
        if(!target)return json({success:false,error:'用户不存在'});
        const privacy=target.privacy||{profile_visible:'all',posts_visible:'all',photos_visible:'all',favorites_visible:'self',following_visible:'all',show_in_runlist:1};
        // 检查主页是否可见
        if(privacy.profile_visible==='self'&&(!user||user.id!==target.id))return json({success:false,error:'该用户主页未公开'});
        if(privacy.profile_visible==='login'&&!user)return json({success:false,error:'请登录后查看'});
        // 统计数据
        const posts=db.posts.filter(p=>p.user_id===target.id&&p.status==='approved');
        const photos=db.photos.filter(p=>p.user_id===target.id&&p.status==='approved');
        const likes=posts.reduce((s,p)=>s+p.like_count,0)+photos.reduce((s,p)=>s+p.likes,0);
        const followers=db.follows.filter(f=>f.following_id===target.id).length;
        const following=db.follows.filter(f=>f.follower_id===target.id).length;
        // 根据隐私过滤留言
        let visiblePosts=posts;
        if(privacy.posts_visible==='self'&&(!user||user.id!==target.id))visiblePosts=[];
        else if(privacy.posts_visible==='login'&&!user)visiblePosts=[];
        // 根据隐私过滤截图
        let visiblePhotos=photos;
        if(privacy.photos_visible==='self'&&(!user||user.id!==target.id))visiblePhotos=[];
        else if(privacy.photos_visible==='login'&&!user)visiblePhotos=[];
        // 当前用户是否已关注
        const isFollowing=user?!!db.follows.find(f=>f.follower_id===user.id&&f.following_id===target.id):false;
        return json({success:true,user:{id:target.id,username:target.username,nickname:target.nickname,avatar_style:target.avatar_style,bio:target.bio,constellation:target.constellation,resident_map:target.resident_map,instrument:target.instrument,online_time:target.online_time,tags:target.tags,created_at:target.created_at},stats:{posts:posts.length,photos:photos.length,likes,followers,following},posts:visiblePosts.slice(0,20),photos:visiblePhotos.slice(0,20),is_following:isFollowing,is_own:user?user.id===target.id:false});
      }
      
      // ===== 留言 =====
      if(path==='/posts'&&method==='GET'){
        const urlObj=new URL('http://x'+url);
        const tag=urlObj.searchParams.get('tag')||'';
        const search=urlObj.searchParams.get('search')||urlObj.searchParams.get('keyword')||'';
        const sort=urlObj.searchParams.get('sort')||'latest';
        const page=parseInt(urlObj.searchParams.get('page')||'1');
        const pageSize=parseInt(urlObj.searchParams.get('pageSize')||urlObj.searchParams.get('limit')||'20');
        let posts=db.posts.filter(p=>p.status==='approved');
        if(tag&&tag!=='全部')posts=posts.filter(p=>p.tag===tag);
        if(search)posts=posts.filter(p=>p.content.includes(search)||(p.title||'').includes(search));
        if(sort==='hot')posts.sort((a,b)=>b.like_count-a.like_count);
        else posts.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        const total=posts.length;
        posts=posts.slice((page-1)*pageSize,page*pageSize);
        posts=posts.map(p=>{const u=db.users.find(x=>x.id===p.user_id);return {...p,nickname:u?.nickname||u?.username||'匿名',username:u?.username||''};});
        return json({success:true,posts,total});
      }
      
      if(path==='/posts'&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const {content,tag='日常分享',title=''}=body;
        if(!content)return json({success:false,error:'内容不能为空'});
        const post={id:genId('post'),user_id:user.id,title:sanitize(title),content:sanitize(content),tag,is_anonymous:0,like_count:0,reply_count:0,status:'approved',created_at:new Date().toISOString().replace('T',' ').slice(0,19)};
        db.posts.push(post);saveDB(db);
        return json({success:true,id:post.id});
      }
      
      if(path.match(/^\/posts\/[^/]+\/like$/)&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const postId=path.split('/')[2];
        const post=db.posts.find(p=>p.id===postId);
        if(!post)return json({success:false,error:'留言不存在'});
        const existing=db.post_likes.find(l=>l.post_id===postId&&l.user_id===user.id);
        let liked;
        if(existing){db.post_likes=db.post_likes.filter(l=>!(l.post_id===postId&&l.user_id===user.id));post.like_count=Math.max(0,post.like_count-1);liked=false;}
        else{db.post_likes.push({post_id:postId,user_id:user.id,created_at:new Date().toISOString()});post.like_count++;liked=true;}
        saveDB(db);
        return json({success:true,liked,like_count:post.like_count});
      }
      
      if(path.match(/^\/posts\/[^/]+\/replies$/)&&method==='GET'){
        const postId=path.split('/')[2];
        let replies=db.post_replies.filter(r=>r.post_id===postId);
        replies=replies.map(r=>{const u=db.users.find(x=>x.id===r.user_id);return {...r,nickname:u?.nickname||'匿名'};});
        return json({success:true,replies});
      }
      
      if(path.match(/^\/posts\/[^/]+\/replies$/)&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const postId=path.split('/')[2];
        const {content}=body;
        if(!content)return json({success:false,error:'内容不能为空'});
        const reply={id:db.post_replies.length+1,post_id:postId,user_id:user.id,content:sanitize(content),is_anonymous:0,created_at:new Date().toISOString().replace('T',' ').slice(0,19)};
        db.post_replies.push(reply);
        const post=db.posts.find(p=>p.id===postId);
        if(post)post.reply_count++;
        saveDB(db);
        return json({success:true});
      }
      
      // ===== 照片 =====
      if(path==='/photos'&&method==='GET'){
        const urlObj=new URL('http://x'+url);
        const page=parseInt(urlObj.searchParams.get('page')||'1');
        const pageSize=parseInt(urlObj.searchParams.get('pageSize')||urlObj.searchParams.get('limit')||'20');
        const sort=urlObj.searchParams.get('sort')||'new';
        const search=urlObj.searchParams.get('search')||urlObj.searchParams.get('keyword')||'';
        let photos=db.photos.filter(p=>p.status==='approved');
        if(search)photos=photos.filter(p=>(p.title||'').includes(search)||(p.description||'').includes(search));
        if(sort==='hot')photos.sort((a,b)=>b.likes-a.likes);
        else photos.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        const total=photos.length;
        photos=photos.slice((page-1)*pageSize,page*pageSize);
        photos=photos.map(p=>{const u=db.users.find(x=>x.id===p.user_id);return {...p,nickname:u?.nickname||u?.username||'匿名',username:u?.username||'',is_liked:user?!!db.photo_likes.find(l=>l.photo_id===p.id&&l.user_id===user.id):false,is_favorited:user?!!db.favorites.find(f=>f.photo_id===p.id&&f.user_id===user.id):false};});
        return json({success:true,photos,total});
      }
      
      if(path==='/photos'&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const {data_url,title='',description=''}=body;
        if(!data_url)return json({success:false,error:'图片不能为空'});
        const photo={id:genId('p'),user_id:user.id,title:sanitize(title),description:sanitize(description),data_url,likes:0,comments:0,status:'approved',created_at:new Date().toISOString().replace('T',' ').slice(0,19)};
        db.photos.push(photo);saveDB(db);
        return json({success:true,id:photo.id});
      }
      
      if(path.match(/^\/photos\/[^/]+$/)&&method==='GET'){
        const photoId=path.split('/')[2];
        const photo=db.photos.find(p=>p.id===photoId);
        if(!photo)return json({success:false,error:'照片不存在'});
        const u=db.users.find(x=>x.id===photo.user_id);
        return json({success:true,photo:{...photo,nickname:u?.nickname||'匿名',username:u?.username||''}});
      }
      
      if(path.match(/^\/photos\/[^/]+$/)&&method==='DELETE'){
        if(!user)return json({success:false,error:'未登录'},401);
        const photoId=path.split('/')[2];
        const photo=db.photos.find(p=>p.id===photoId);
        if(!photo)return json({success:false,error:'照片不存在'});
        if(photo.user_id!==user.id&&!user.is_admin)return json({success:false,error:'无权限'},403);
        db.photos=db.photos.filter(p=>p.id!==photoId);
        db.comments=db.comments.filter(c=>c.photo_id!==photoId);
        saveDB(db);
        return json({success:true});
      }
      
      if(path.match(/^\/photos\/[^/]+\/like$/)&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const photoId=path.split('/')[2];
        const photo=db.photos.find(p=>p.id===photoId);
        if(!photo)return json({success:false,error:'照片不存在'});
        const existing=db.photo_likes.find(l=>l.photo_id===photoId&&l.user_id===user.id);
        let liked;
        if(existing){db.photo_likes=db.photo_likes.filter(l=>!(l.photo_id===photoId&&l.user_id===user.id));photo.likes=Math.max(0,photo.likes-1);liked=false;}
        else{db.photo_likes.push({photo_id:photoId,user_id:user.id,created_at:new Date().toISOString()});photo.likes++;liked=true;}
        saveDB(db);
        return json({success:true,liked,likes:photo.likes});
      }
      
      if(path.match(/^\/photos\/[^/]+\/favorite$/)&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const photoId=path.split('/')[2];
        const existing=db.favorites.find(f=>f.photo_id===photoId&&f.user_id===user.id);
        let favorited;
        if(existing){db.favorites=db.favorites.filter(f=>!(f.photo_id===photoId&&f.user_id===user.id));favorited=false;}
        else{db.favorites.push({id:db.favorites.length+1,photo_id:photoId,user_id:user.id,created_at:new Date().toISOString()});favorited=true;}
        saveDB(db);
        return json({success:true,favorited});
      }
      
      if(path.match(/^\/photos\/[^/]+\/comments$/)&&method==='GET'){
        const photoId=path.split('/')[2];
        let comments=db.comments.filter(c=>c.photo_id===photoId);
        comments=comments.map(c=>{const u=db.users.find(x=>x.id===c.user_id);return {...c,nickname:u?.nickname||'匿名'};});
        return json({success:true,comments});
      }
      
      if(path.match(/^\/photos\/[^/]+\/comments$/)&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const photoId=path.split('/')[2];
        const {content}=body;
        if(!content)return json({success:false,error:'内容不能为空'});
        const comment={id:db.comments.length+1,photo_id:photoId,user_id:user.id,content:sanitize(content),created_at:new Date().toISOString().replace('T',' ').slice(0,19)};
        db.comments.push(comment);
        const photo=db.photos.find(p=>p.id===photoId);
        if(photo)photo.comments++;
        saveDB(db);
        return json({success:true});
      }
      
      // ===== 收藏 =====
      if(path==='/photos/mine'&&method==='GET'){
        if(!user)return json({success:false,error:'未登录'},401);
        const photos=db.photos.filter(p=>p.user_id===user.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        return json({success:true,photos});
      }
      
      if(path==='/favorites'&&method==='GET'){
        if(!user)return json({success:false,error:'未登录'},401);
        const favIds=db.favorites.filter(f=>f.user_id===user.id).map(f=>f.photo_id);
        const photos=db.photos.filter(p=>favIds.includes(p.id));
        return json({success:true,photos});
      }
      
      // ===== 私信 =====
      if(path==='/messages'&&method==='GET'){
        if(!user)return json({success:false,error:'未登录'},401);
        const urlObj=new URL('http://x'+url);
        const otherId=parseInt(urlObj.searchParams.get('user_id')||'0');
        let msgs=db.messages.filter(m=>(m.from_id===user.id&&m.to_id===otherId)||(m.from_id===otherId&&m.to_id===user.id));
        msgs=msgs.map(m=>{const u=db.users.find(x=>x.id===m.from_id);return {...m,nickname:u?.nickname||''};});
        return json({success:true,messages:msgs});
      }
      
      if(path==='/messages'&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const {to_id,content}=body;
        if(!to_id||!content)return json({success:false,error:'参数错误'});
        const msg={id:db.messages.length+1,from_id:user.id,to_id,content:sanitize(content),created_at:new Date().toISOString().replace('T',' ').slice(0,19),read:0};
        db.messages.push(msg);saveDB(db);
        return json({success:true});
      }
      
      // ===== 成就 =====
      if(path==='/achievements'&&method==='GET'){
        if(!user)return json({success:false,error:'未登录'},401);
        const unlocked=db.user_achievements.filter(a=>a.user_id===user.id).map(a=>a.achievement_id);
        return json({success:true,achievements:db.achievement_defs.map(a=>({...a,unlocked:unlocked.includes(a.id)}))});
      }
      
      // ===== 举报 =====
      if(path==='/reports'&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const {type,target_id,reason,report_category='其他'}=body;
        const report={id:db.reports.length+1,type,target_id,user_id:user.id,reason:sanitize(reason),report_category,status:'pending',admin_reply:'',admin_note:'',processed_at:null,created_at:new Date().toISOString().replace('T',' ').slice(0,19)};
        db.reports.push(report);saveDB(db);
        return json({success:true});
      }
      
      // ===== 活码 =====
      if(path==='/qrcode'&&method==='GET'){
        const setting=db.settings.find(s=>s.key==='group_qrcode');
        return json({success:true,qrcode:setting?.value||''});
      }
      
      // ===== 统计 =====
      if(path==='/stats'&&method==='GET'){
        return json({success:true,users:db.users.length,posts:db.posts.filter(p=>p.status==='approved').length,photos:db.photos.filter(p=>p.status==='approved').length});
      }
      
      // ===== 互心互火 =====
      if(path==='/exchange'&&method==='GET'){
        const urlObj=new URL('http://x'+url);
        const type=urlObj.searchParams.get('type')||'';
        let posts=db.exchange_posts.filter(p=>p.status==='active');
        if(type)posts=posts.filter(p=>p.type===type);
        posts.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        posts=posts.map(p=>{const u=db.users.find(x=>x.id===p.user_id);return {...p,nickname:u?.nickname||'匿名',username:u?.username||''};});
        return json({success:true,posts,total:posts.length});
      }
      
      if(path==='/exchange'&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const {type='heart',server='国服',content=''}=body;
        const post={id:genId('ep'),user_id:user.id,type,server,content:sanitize(content),status:'active',created_at:new Date().toISOString().replace('T',' ').slice(0,19)};
        db.exchange_posts.push(post);saveDB(db);
        return json({success:true,id:post.id});
      }
      
      // ===== 复刻先祖 =====
      if(path==='/spirits'&&method==='GET'){
        return json({success:true,spirits:db.traveling_spirits});
      }
      
      // ===== 每日任务 =====
      if(path==='/daily-tasks'&&method==='GET'){
        const urlObj=new URL('http://x'+url);
        const date=urlObj.searchParams.get('date')||new Date().toISOString().slice(0,10);
        const task=db.daily_tasks.find(t=>t.task_date===date);
        let checkins=[];
        if(user&&task)checkins=db.task_checkins.filter(c=>c.user_id===user.id&&c.task_date===date).map(c=>c.task_index);
        return json({success:true,task:task||null,checkins});
      }
      
      if(path==='/daily-tasks'&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const {task_index,date}=body;
        const taskDate=date||new Date().toISOString().slice(0,10);
        const existing=db.task_checkins.find(c=>c.user_id===user.id&&c.task_date===taskDate&&c.task_index===task_index);
        if(!existing){db.task_checkins.push({id:db.task_checkins.length+1,user_id:user.id,task_date:taskDate,task_index,created_at:new Date().toISOString()});}
        saveDB(db);
        return json({success:true,message:'打卡成功'});
      }
      
      // ===== 排行榜 =====
      if(path==='/rankings'&&method==='GET'){
        const urlObj=new URL('http://x'+url);
        const type=urlObj.searchParams.get('type')||'likes';
        let rankings=db.users.map(u=>{
          let count=0;
          if(type==='posts')count=db.posts.filter(p=>p.user_id===u.id&&p.status==='approved').length;
          else if(type==='followers')count=db.follows.filter(f=>f.following_id===u.id).length;
          else count=db.photos.filter(p=>p.user_id===u.id).reduce((s,p)=>s+p.likes,0)+db.posts.filter(p=>p.user_id===u.id).reduce((s,p)=>s+p.like_count,0);
          return {id:u.id,username:u.username,nickname:u.nickname,avatar_style:u.avatar_style,count};
        });
        rankings.sort((a,b)=>b.count-a.count);
        rankings=rankings.slice(0,20);
        return json({success:true,rankings,type});
      }
      
      // ===== 关注 =====
      if(path.match(/^\/users\/\d+\/follow$/)&&method==='POST'){
        if(!user)return json({success:false,error:'未登录'},401);
        const targetId=parseInt(path.split('/')[2]);
        const existing=db.follows.find(f=>f.follower_id===user.id&&f.following_id===targetId);
        let following;
        if(existing){db.follows=db.follows.filter(f=>!(f.follower_id===user.id&&f.following_id===targetId));following=false;}
        else{db.follows.push({id:db.follows.length+1,follower_id:user.id,following_id:targetId,created_at:new Date().toISOString()});following=true;}
        saveDB(db);
        return json({success:true,following});
      }
      
      if(path.match(/^\/users\/\d+\/follow-stats$/)&&method==='GET'){
        const userId=parseInt(path.split('/')[2]);
        return json({success:true,following:db.follows.filter(f=>f.following_id===userId).length,followers:db.follows.filter(f=>f.follower_id===userId).length});
      }
      
      if(path.match(/^\/users?\/\d+$/)&&method==='GET'){
        const userId=parseInt(path.split('/')[2]);
        const u=db.users.find(x=>x.id===userId);
        if(!u)return json({success:false,error:'用户不存在'});
        return json({success:true,user:{id:u.id,username:u.username,nickname:u.nickname,bio:u.bio,avatar_style:u.avatar_style,constellation:u.constellation,resident_map:u.resident_map,instrument:u.instrument,online_time:u.online_time,tags:u.tags,created_at:u.created_at}});
      }
      
      if(path==='/users/run-status'&&method==='GET'){
        const now=Date.now();
        const users=db.users.filter(u=>u.run_status&&u.run_status_expire&&u.run_status_expire>now);
        return json({success:true,users:users.map(u=>({id:u.id,nickname:u.nickname,run_status:u.run_status,avatar_style:u.avatar_style}))});
      }
      
      // ===== 管理后台 =====
      if(path==='/admin/stats'&&method==='GET'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const today=new Date().toISOString().slice(0,10);
        return json({success:true,users:db.users.length,photos:{total:db.photos.length,pending:db.photos.filter(p=>p.status==='pending').length,approved:db.photos.filter(p=>p.status==='approved').length,removed:db.photos.filter(p=>p.status==='removed').length},posts:db.posts.length,comments:db.comments.length,today:{users:db.users.filter(u=>u.created_at&&u.created_at.startsWith(today)).length,photos:db.photos.filter(p=>p.created_at&&p.created_at.startsWith(today)).length}});
      }
      
      if(path==='/admin/users'&&method==='GET'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        return json({success:true,users:db.users.map(u=>({id:u.id,username:u.username,nickname:u.nickname,email:u.email,created_at:u.created_at,is_admin:u.is_admin,is_banned:u.banned||0}))});
      }
      
      if(path.match(/^\/admin\/users?\/\d+\/password$/)&&method==='PUT'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const userId=parseInt(path.split('/')[3]);
        const {new_password}=body;
        if(!new_password||new_password.length<6||!/[a-zA-Z]/.test(new_password)||!/[0-9]/.test(new_password))return json({success:false,error:'新密码至少6位，需包含字母和数字'});
        const target=db.users.find(u=>u.id===userId);
        if(!target)return json({success:false,error:'用户不存在'});
        target.password=hash(new_password);
        saveDB(db);
        return json({success:true,message:'密码重置成功'});
      }
      
      if(path.match(/^\/admin\/users?\/\d+$/)&&method==='PUT'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const userId=parseInt(path.split('/')[3]);
        const {action,banned}=body;
        const target=db.users.find(u=>u.id===userId);
        if(target){if(action==='ban')target.banned=banned?1:0;saveDB(db);}
        return json({success:true});
      }
      
      if(path.match(/^\/admin\/users?\/\d+$/)&&method==='DELETE'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const userId=parseInt(path.split('/')[3]);
        db.users=db.users.filter(u=>u.id!==userId);
        saveDB(db);
        return json({success:true});
      }
      
      if(path==='/admin/photos'&&method==='GET'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        let photos=db.photos.map(p=>{const u=db.users.find(x=>x.id===p.user_id);return {...p,nickname:u?.nickname||''};});
        photos.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        return json({success:true,photos});
      }
      
      if(path.match(/^\/admin\/photos?\/[^/]+$/)&&method==='PUT'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const photoId=path.split('/')[3];
        const {status}=body;
        const photo=db.photos.find(p=>p.id===photoId);
        if(photo){photo.status=status;saveDB(db);}
        return json({success:true});
      }
      
      if(path.match(/^\/admin\/photos?\/[^/]+$/)&&method==='DELETE'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const photoId=path.split('/')[3];
        db.photos=db.photos.filter(p=>p.id!==photoId);
        saveDB(db);
        return json({success:true});
      }
      
      if(path==='/admin/posts'&&method==='GET'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        let posts=db.posts.map(p=>{const u=db.users.find(x=>x.id===p.user_id);return {...p,nickname:u?.nickname||''};});
        posts.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        return json({success:true,posts});
      }
      
      if(path.match(/^\/admin\/posts?\/[^/]+$/)&&method==='DELETE'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const postId=path.split('/')[3];
        db.posts=db.posts.filter(p=>p.id!==postId);
        saveDB(db);
        return json({success:true});
      }
      
      if(path==='/admin/comments'&&method==='GET'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        let comments=db.comments.map(c=>{const u=db.users.find(x=>x.id===c.user_id);return {...c,nickname:u?.nickname||''};});
        return json({success:true,comments});
      }
      
      if(path.match(/^\/admin\/comments?\/\d+$/)&&method==='DELETE'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const commentId=parseInt(path.split('/')[3]);
        db.comments=db.comments.filter(c=>c.id!==commentId);
        saveDB(db);
        return json({success:true});
      }
      
      if(path==='/admin/reports'&&method==='GET'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const urlObj=new URL('http://x'+url);
        const status=urlObj.searchParams.get('status')||'';
        let reports=db.reports.map(r=>{const u=db.users.find(x=>x.id===r.user_id);return {...r,nickname:u?.nickname||'',username:u?.username||''};});
        if(status)reports=reports.filter(r=>r.status===status);
        reports.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        return json({success:true,reports});
      }
      
      if(path.match(/^\/admin\/reports\/\d+$/)&&method==='PUT'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const reportId=parseInt(path.split('/')[3]);
        const {action,admin_reply=''}=body;
        const report=db.reports.find(r=>r.id===reportId);
        if(!report)return json({success:false,error:'举报不存在'});
        if(action==='delete'){
          // 删除被举报的内容
          if(report.type==='post'){db.posts=db.posts.filter(p=>p.id!==report.target_id);}
          else if(report.type==='photo'){db.photos=db.photos.filter(p=>p.id!==report.target_id);}
          report.status='resolved';report.admin_reply=admin_reply||'内容已删除';report.processed_at=new Date().toISOString().replace('T',' ').slice(0,19);
        }else if(action==='ignore'){
          report.status='ignored';report.admin_reply=admin_reply||'';report.processed_at=new Date().toISOString().replace('T',' ').slice(0,19);
        }else if(action==='resolve'){
          report.status='resolved';report.admin_reply=admin_reply||'';report.processed_at=new Date().toISOString().replace('T',' ').slice(0,19);
        }
        saveDB(db);
        return json({success:true});
      }
      
      if(path==='/admin/qrcode'&&method==='PUT'){
        if(!user||!user.is_admin)return json({success:false,error:'需要管理员权限'},403);
        const {qrcode}=body;
        let setting=db.settings.find(s=>s.key==='group_qrcode');
        if(setting)setting.value=qrcode;
        else db.settings.push({key:'group_qrcode',value:qrcode});
        saveDB(db);
        return json({success:true,message:'活码更新成功'});
      }
      
      // ===== 初始化 =====
      if(path==='/init'&&method==='GET'){
        initDB();
        return json({success:true});
      }
      
      // 音乐搜索（模拟）
      if(path.startsWith('/music/')){
        return json({success:true,songs:[],url:''});
      }
      
      return json({success:false,error:'API not found: '+path+' '+method},404);
      
    }catch(e){
      return json({success:false,error:e.message},500);
    }
  };
  
  // 初始化
  initDB();
  console.log('[LocalStorage API Mock] 已加载，所有/api请求将使用本地数据');
})();
