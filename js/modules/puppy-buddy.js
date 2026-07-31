/* 复习页 · 右上角常驻悬浮金毛小狗伙伴
 * ------------------------------------------------------------
 * · 形象素材：直接复用「🐶 小狗养成」模块（modules/puppy.js）里同一只矢量金毛
 *   （同样的耳朵/大眼/淡腮红/上扬尾巴与配色 #f6d98a / #fbe6b0 / #e9c46a）。
 * · 数值逻辑：狗粮走 Store.addFood()，亲密度/心情走 window.PuppyPet.reward()，
 *   与养成模块共用同一份 Store.state.puppy 数据，不新增第二套数值体系。
 * · 不遮挡：容器 pointer-events:none，仅小狗本体与折叠按钮可点击，
 *   鼠标落在小狗以外的区域会直接穿透到下面的卡片/按钮上。
 * · 侵入性：复习模块只调用 attach() / react()，判分、排期、结算逻辑一行未改。
 */
window.ReviewBuddy = (function () {
  "use strict";

  /* ============ 文案 ============ */
  const PRAISE = [
    '答对啦！这个词你拿下了 🎉',
    '汪！记性真好，继续保持～',
    '太棒了，这词以后见到就眼熟啦',
    '稳！我尾巴都摇成螺旋桨了',
    '这就是学霸的味道吗 ✨',
    '记住咯～下次遇见它别忘了我',
    '厉害！奖励你摸摸我的头',
    '这道题被你秒了！',
    '汪汪，四级词汇又少一个敌人',
    '好耶！我又能吃上狗粮啦 🦴'
  ];
  const COMFORT = [
    '没关系，记错一次才记得更牢～',
    '这个词有点狡猾，我们再看一眼',
    '别灰心，我陪你重来一遍嘛',
    '错题会变成你的宝藏，真的',
    '呜…不过我相信你下次能对',
    '慢慢来，考试之前记住就好啦',
    '我把它记进小本本了，等会儿再考你',
    '别皱眉啦，摸摸我就不难过了',
    '一个词而已，你已经背了好多了',
    '汪…我们下一题扳回来！'
  ];
  const PET = [
    '嘿嘿，好舒服～',
    '摸摸头，充电完毕！',
    '汪！我一直在这儿陪你',
    '休息三秒，然后继续冲鸭',
    '你身上有认真学习的味道'
  ];
  const HELLO = [
    '一起复习吧，我在这儿陪你 🐾',
    '今天也要把单词吃干净哦～',
    '汪！准备好接受考验了吗'
  ];

  /* ============ 奖励参数（与养成模块口径一致） ============ */
  const FOOD_PER_CORRECT = 2;   // 每答对一题的狗粮
  const STREAK_N = 5;           // 连对多少题触发额外奖励
  const STREAK_BONUS = 3;       // 连对额外狗粮
  const INTIMACY_PER_CORRECT = 1;
  const MOOD_PER_CORRECT = 1;
  const FOLD_KEY = 'cet4_reviewbuddy_folded';

  /* ============ 样式 ============ */
  const STYLE = `<style>
  :host{
    position:fixed; right:14px; top:72px; z-index:45;
    pointer-events:none;
    font-family:'PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;
  }
  *{box-sizing:border-box;}
  .rb{ position:relative; width:112px; display:flex; flex-direction:column; align-items:center; }

  /* ---- 气泡 ---- */
  /* 小狗在右上角 → 气泡朝左侧弹出，避免遮住下方卡片内容 */
  .bubble{
    position:absolute; top:16px; right:100%; margin-right:10px;
    background:#fff; color:#6b5563; border:1px solid #ffe0ea;
    padding:8px 12px; border-radius:14px; font-size:12.5px; line-height:1.5;
    width:max-content; max-width:206px; text-align:left;
    box-shadow:0 8px 20px rgba(255,143,171,.22);
    opacity:0; transform:translateX(8px) scale(.94); transform-origin:100% 24%;
    transition:opacity .22s ease, transform .22s ease; pointer-events:none;
  }
  .bubble.show{opacity:1; transform:translateX(0) scale(1);}
  .bubble.bad{border-color:#dfe7f5; box-shadow:0 8px 20px rgba(120,140,180,.2);}
  .bubble::after{
    content:''; position:absolute; right:-7px; top:14px;
    width:12px; height:12px; background:#fff; border-right:1px solid #ffe0ea; border-top:1px solid #ffe0ea;
    transform:rotate(45deg);
  }
  .bubble.bad::after{border-color:#dfe7f5;}

  /* ---- 小狗本体 ---- */
  .dog{
    width:112px; height:148px; display:block; overflow:visible;
    pointer-events:auto; cursor:pointer;
    filter:drop-shadow(0 10px 16px rgba(233,196,106,.35));
    transition:filter .2s;
  }
  .dog:hover{filter:drop-shadow(0 12px 20px rgba(255,143,171,.4));}

  #breath{transform-box:fill-box; transform-origin:50% 100%; animation:rbBreath 3.4s ease-in-out infinite;}
  #tail{transform-box:fill-box; transform-origin:0% 100%; animation:rbWag 1.5s ease-in-out infinite;}
  #head{transform-box:fill-box; transform-origin:50% 80%; transition:transform .35s ease;}
  #earL,#earR{transform-box:fill-box; transform-origin:50% 8%; transition:transform .4s cubic-bezier(.34,1.3,.64,1);}
  #earL{transform:rotate(-16deg);} #earR{transform:rotate(16deg);}
  .eyeball{transform-box:fill-box; transform-origin:50% 50%; transition:transform .09s linear;}
  .eyeHappy,.brow,#tear,#mouthSad,#mouthOpen,#tongue{transition:opacity .2s;}

  /* 眨眼 */
  .dog.blink .eyeball{transform:scaleY(.12);}

  /* ---- 开心：跳跃 + 弯弯眼 + 张嘴吐舌 + 快速摇尾 ---- */
  .dog.happy #dogRoot{animation:rbJump 1.15s cubic-bezier(.3,.9,.4,1);}
  .dog.happy #tail{animation:rbWagFast .2s ease-in-out infinite;}
  .dog.happy .eyeball{opacity:0;}
  .dog.happy .eyeHappy{opacity:1;}
  .dog.happy #mouth{opacity:0;}
  .dog.happy #mouthOpen,.dog.happy #tongue{opacity:1;}
  .dog.happy #earL{transform:rotate(-30deg);} .dog.happy #earR{transform:rotate(30deg);}

  /* ---- 委屈：耷拉耳朵 + 低头 + 垂尾 + 皱眉 + 眼泪 ---- */
  .dog.sad #dogRoot{animation:rbSlump 2s ease-in-out;}
  .dog.sad #earL{transform:rotate(-62deg) translateY(7px);}
  .dog.sad #earR{transform:rotate(62deg) translateY(7px);}
  .dog.sad #head{transform:translateY(7px) rotate(-4deg);}
  .dog.sad #tail{animation:none; transform:rotate(46deg);}
  .dog.sad #mouth{opacity:0;} .dog.sad #mouthSad{opacity:1;}
  .dog.sad .brow{opacity:.9;}
  .dog.sad #tear{opacity:1; animation:rbTear 1.6s ease-in infinite;}
  .dog.sad #breath{animation-duration:5s;}

  /* ---- 底部亲密度小条 ---- */
  .meta{
    margin-top:-6px; pointer-events:auto;
    background:rgba(255,255,255,.94); border:1px solid #ffe0ea; border-radius:999px;
    padding:3px 10px; font-size:11px; color:#9a8593; white-space:nowrap;
    box-shadow:0 4px 12px rgba(255,143,171,.18);
  }
  .meta b{color:#ff8fab; font-weight:700;}

  /* ---- 折叠 ---- */
  .fold{
    position:absolute; top:-2px; right:-2px; width:22px; height:22px; line-height:20px;
    border-radius:50%; border:1px solid #ffe0ea; background:#fff; color:#c8b3bf;
    font-size:12px; text-align:center; cursor:pointer; pointer-events:auto;
    opacity:0; transition:opacity .2s; padding:0;
  }
  .rb:hover .fold{opacity:1;}
  .fold:hover{color:#ff8fab; border-color:#ffb3c6;}
  .opener{
    display:none; width:46px; height:46px; border-radius:50%; border:1px solid #ffe0ea;
    background:#fff; font-size:22px; line-height:44px; text-align:center; cursor:pointer;
    pointer-events:auto; box-shadow:0 6px 16px rgba(255,143,171,.25); padding:0;
  }
  .rb.folded{width:46px;}
  .rb.folded .dog,.rb.folded .meta,.rb.folded .fold{display:none;}
  .rb.folded .opener{display:block;}

  /* ---- 飘字 / 星光 ---- */
  .fx{position:absolute; pointer-events:none; font-size:15px; font-weight:700; color:#ff8fab;}
  .fx.food{right:6px; top:14px; animation:rbFoodUp 1.15s ease-out forwards;}
  .fx.spark{font-size:16px; animation:rbSpark .95s ease-out forwards;}

  @keyframes rbBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.028);}}
  @keyframes rbWag{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(11deg);}}
  @keyframes rbWagFast{0%,100%{transform:rotate(-16deg);}50%{transform:rotate(22deg);}}
  @keyframes rbJump{
    0%{transform:translateY(0) scaleY(1);}
    12%{transform:translateY(4px) scaleY(.94);}
    32%{transform:translateY(-22px) scaleY(1.06);}
    52%{transform:translateY(0) scaleY(.97);}
    68%{transform:translateY(-11px) scaleY(1.03);}
    84%{transform:translateY(0) scaleY(.99);}
    100%{transform:translateY(0) scaleY(1);}
  }
  @keyframes rbSlump{
    0%{transform:translateY(0);}
    25%{transform:translateY(5px) scaleY(.97);}
    60%{transform:translateY(3px) scaleY(.985);}
    100%{transform:translateY(0);}
  }
  @keyframes rbTear{0%{opacity:0; transform:translateY(0);}30%{opacity:1;}100%{opacity:0; transform:translateY(16px);}}
  @keyframes rbFoodUp{0%{opacity:0; transform:translateY(6px) scale(.8);}25%{opacity:1; transform:translateY(-4px) scale(1.1);}100%{opacity:0; transform:translateY(-38px) scale(1);}}
  @keyframes rbSpark{0%{opacity:0; transform:translate(0,0) scale(.5);}30%{opacity:1;}100%{opacity:0; transform:translate(var(--dx),-42px) scale(1.15);}}

  @media (max-width:560px){
    :host{right:8px; top:64px;}
    .rb{width:86px;} .dog{width:86px; height:114px;}
    .bubble{font-size:11.5px; max-width:150px; padding:6px 10px; margin-right:8px;}
    .meta{font-size:10px; padding:2px 8px;}
  }
  @media (max-height:520px){ .rb{width:84px;} .dog{width:84px; height:112px;} }
  @media (prefers-reduced-motion:reduce){
    #breath,#tail,.dog.happy #dogRoot,.dog.sad #dogRoot{animation:none !important;}
  }
  </style>`;

  /* ============ 结构（金毛素材与养成模块同源） ============ */
  const HTML = `<div class="rb" id="rb">
    <div class="bubble" id="bubble"></div>
    <button class="fold" id="fold" title="收起小狗">–</button>
    <button class="opener" id="opener" title="唤回小狗">🐶</button>
    <svg class="dog" id="dog" viewBox="140 74 190 258">
      <g id="dogRoot">
        <path id="tail" d="M278,238 q54,-16 40,-70" stroke="#e9c46a" stroke-width="15" fill="none" stroke-linecap="round"/>
        <g id="breath">
          <ellipse cx="220" cy="250" rx="70" ry="62" fill="#f6d98a"/>
          <ellipse cx="220" cy="266" rx="46" ry="46" fill="#fbe6b0"/>
          <rect x="188" y="292" width="24" height="30" rx="12" fill="#f0cf78"/>
          <rect x="228" y="292" width="24" height="30" rx="12" fill="#e9c46a"/>
          <g id="head">
            <ellipse id="earL" cx="186" cy="112" rx="18" ry="27" fill="#e9c46a"/>
            <ellipse id="earR" cx="254" cy="112" rx="18" ry="27" fill="#e0b85a"/>
            <circle cx="220" cy="162" r="58" fill="#f6d98a"/>
            <ellipse cx="220" cy="190" rx="36" ry="28" fill="#fbe6b0"/>
            <ellipse cx="220" cy="180" rx="11" ry="8" fill="#5b4636"/>
            <path id="mouth" d="M220,188 q0,12 -12,14 M220,188 q0,12 12,14" stroke="#5b4636" stroke-width="2.6" fill="none" stroke-linecap="round"/>
            <path id="mouthSad" d="M206,207 q14,-14 28,0" stroke="#5b4636" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0"/>
            <ellipse id="mouthOpen" cx="220" cy="201" rx="12" ry="10" fill="#7a4a3a" opacity="0"/>
            <ellipse id="tongue" cx="220" cy="207" rx="7.5" ry="5.5" fill="#ff8fab" opacity="0"/>
            <g class="eye">
              <g class="eyeball"><circle cx="198" cy="158" r="9" fill="#3a2c22"/><circle cx="201" cy="155" r="2.8" fill="#fff"/></g>
              <path class="eyeHappy" d="M189,161 q9,-11 18,0" stroke="#3a2c22" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0"/>
              <path class="brow" d="M187,145 q10,-1 19,-7" stroke="#c89b4f" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0"/>
            </g>
            <g class="eye">
              <g class="eyeball"><circle cx="242" cy="158" r="9" fill="#3a2c22"/><circle cx="245" cy="155" r="2.8" fill="#fff"/></g>
              <path class="eyeHappy" d="M233,161 q9,-11 18,0" stroke="#3a2c22" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0"/>
              <path class="brow" d="M234,138 q9,-6 19,7" stroke="#c89b4f" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0"/>
            </g>
            <ellipse cx="180" cy="182" rx="12" ry="7" fill="#ffc2d1" opacity=".5"/>
            <ellipse cx="260" cy="182" rx="12" ry="7" fill="#ffc2d1" opacity=".5"/>
            <path id="tear" d="M188,170 q4.5,8 0,12.5 q-4.5,-4.5 0,-12.5z" fill="#8ecae6" opacity="0"/>
          </g>
        </g>
      </g>
    </svg>
    <div class="meta" id="meta"></div>
  </div>`;

  /* ============ 运行时 ============ */
  let hostEl = null, root = null;
  let stateTimer = null, bubbleTimer = null, blinkTimer = null;
  let streak = 0, lastLine = '';

  const $ = s => (root ? root.querySelector(s) : null);
  function pick(arr) {
    if (arr.length < 2) return arr[0] || '';
    let v = arr[Math.floor(Math.random() * arr.length)];
    if (v === lastLine) v = arr[(arr.indexOf(v) + 1) % arr.length];
    lastLine = v; return v;
  }
  const folded = () => { try { return localStorage.getItem(FOLD_KEY) === '1'; } catch (e) { return false; } };
  const setFolded = v => { try { localStorage.setItem(FOLD_KEY, v ? '1' : '0'); } catch (e) {} };

  function say(text, kind) {
    const b = $('#bubble'); if (!b) return;
    b.textContent = text;
    b.classList.toggle('bad', kind === 'bad');
    b.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => b.classList.remove('show'), kind === 'bad' ? 3200 : 2600);
  }

  function renderMeta() {
    const el = $('#meta'); if (!el) return;
    const name = (window.PuppyPet && window.PuppyPet.name()) || '奶糖';
    const st = window.PuppyPet && window.PuppyPet.stats();
    const inti = st ? st.intimacy : null;
    el.innerHTML = inti === null
      ? `🐾 ${name}`
      : `🐾 ${name} · 亲密度 <b>${inti}</b>`;
  }

  function floatFood(text) {
    const rb = $('#rb'); if (!rb) return;
    const d = document.createElement('div');
    d.className = 'fx food'; d.textContent = text;
    rb.appendChild(d);
    setTimeout(() => d.remove(), 1200);
  }

  function sparkle() {
    const rb = $('#rb'); if (!rb) return;
    const icons = ['✨', '💛', '⭐'];
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('div');
      s.className = 'fx spark';
      s.textContent = icons[i % icons.length];
      s.style.left = (26 + i * 30) + 'px';
      s.style.top = '30px';
      s.style.setProperty('--dx', (i - 1) * 16 + 'px');
      s.style.animationDelay = (i * 90) + 'ms';
      rb.appendChild(s);
      setTimeout(() => s.remove(), 1400);
    }
  }

  function clearState() {
    const d = $('#dog'); if (d) d.classList.remove('happy', 'sad');
  }

  function startBlink() {
    clearInterval(blinkTimer);
    blinkTimer = setInterval(() => {
      const d = $('#dog');
      if (!d || d.classList.contains('sad')) return;
      d.classList.add('blink');
      setTimeout(() => d.classList.remove('blink'), 150);
    }, 4200 + Math.random() * 2600);
  }

  /* ---- 对外：答题反馈 ---- */
  function react(ok) {
    if (!root) return;
    const dog = $('#dog'); if (!dog) return;
    clearTimeout(stateTimer);
    clearState();
    void dog.offsetWidth; // 重置动画，连续答题也能每次重放

    if (ok) {
      streak++;
      dog.classList.add('happy');
      let food = FOOD_PER_CORRECT, extra = '';
      if (streak % STREAK_N === 0) { food += STREAK_BONUS; extra = ` 连对 ${streak} 题，加餐 +${STREAK_BONUS}！`; }
      // 复用项目现有狗粮逻辑
      try { if (window.Store && Store.addFood) Store.addFood(food); } catch (e) {}
      if (typeof window.updateChrome === 'function') window.updateChrome();
      // 复用养成模块亲密度/心情逻辑
      if (window.PuppyPet) window.PuppyPet.reward(INTIMACY_PER_CORRECT, MOOD_PER_CORRECT);
      floatFood('+' + food + ' 🦴');
      sparkle();
      say(pick(PRAISE) + extra, 'ok');
      stateTimer = setTimeout(clearState, 1500);
    } else {
      streak = 0;
      dog.classList.add('sad');
      say(pick(COMFORT), 'bad');   // 答错只安慰，不扣任何数值
      stateTimer = setTimeout(clearState, 2600);
    }
    renderMeta();
  }

  function bind() {
    const dog = $('#dog');
    if (dog) dog.onclick = () => {
      if (dog.classList.contains('sad')) { clearState(); }
      dog.classList.add('happy');
      say(pick(PET), 'ok');
      clearTimeout(stateTimer);
      stateTimer = setTimeout(clearState, 1200);
    };
    const fold = $('#fold'), opener = $('#opener'), rb = $('#rb');
    if (fold) fold.onclick = () => { rb.classList.add('folded'); setFolded(true); };
    if (opener) opener.onclick = () => {
      rb.classList.remove('folded'); setFolded(false);
      renderMeta(); say(pick(HELLO), 'ok');
    };
  }

  /* ---- 对外：挂载 / 卸载 ---- */
  function attach(container) {
    if (!container) return;
    detach();
    hostEl = document.createElement('div');
    hostEl.className = 'review-buddy-host';
    container.appendChild(hostEl);
    root = hostEl.attachShadow({ mode: 'open' });
    root.innerHTML = STYLE + HTML;
    bind();
    if (folded()) $('#rb').classList.add('folded');
    renderMeta();
    startBlink();
    streak = 0;
    setTimeout(() => { if (root && !folded()) say(pick(HELLO), 'ok'); }, 700);
  }

  function detach() {
    clearTimeout(stateTimer); clearTimeout(bubbleTimer); clearInterval(blinkTimer);
    if (hostEl && hostEl.parentNode) hostEl.parentNode.removeChild(hostEl);
    hostEl = null; root = null;
  }

  return { attach, detach, react, say, renderMeta };
})();
