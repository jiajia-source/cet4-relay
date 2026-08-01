/* ===== 本地数据层（localStorage） =====
 * 所有学习进度、打卡、错题、狗粮、小狗成长均持久化于此。
 */
const Store = (() => {
  const KEY = 'cet4_workbench_state_v1';

  // 艾宾浩斯遗忘曲线复习间隔（天）：5分钟、30分钟、12小时、1天、2天、4天、7天、15天、30天
  // 首次学完单词后 level=0 → 5分钟到期；答对逐级延长，答错归零 → 5分钟重新巩固
  const EBBINGHAUS = [5/1440, 30/1440, 0.5, 1, 2, 4, 7, 15, 30];

  const defaults = () => ({
    words: {},        // wordId -> { status, reviewLevel, dueTs, lastTs }
    // 单词学习「本轮已学」集合：标记学过的卡片在本轮不再出现；
    // 当全部单词都学完时清空该集合，自动开启第二轮（已学单词再次出现）。
    roundLearned: {},
    // 单词学习：上次正在查看的单词 id，用于「重新打开模块时定位到进度所在单词」
    lastLearnWord: null,
    reviewLog: [],    // { ts, mode, correct, total }
    // 每个练习模式各自独立的「已复习单词」集合：三个模式进度互不影响
    // reviewedByMode[mode][id] = { correct:bool, ts:number }
    reviewedByMode: { dictation: {}, cn2word: {}, cloze: {} },
    wrong: { words: [], listening: [], reading: [] }, // 收藏的错题 id 列表
    checkin: { dates: {}, streak: 0, lastDate: null },
    food: 0,
    dog: {
      name: '奶糖',
      stage: 'baby',          // baby | teen | adult
      level: 1,
      intimacy: 0,            // 0-100
      growth: 0,              // 0-100 当前阶段成长进度
      skin: 'default',        // default | limited(连续7天打卡)
      partner: false,
      puppies: [],            // 繁育的小狗崽
      lastFed: null
    },
    // 小狗养成·世代循环完整数据（奶糖小狗）
    puppy: {
      gen: 1,
      currentId: 'd1',
      // 成长节奏 v2：年龄完全由真实时间推导（1 真实天 = 1 岁），不再有暂停 / 倍速 / 快进
      lifeV2: true,
      // 上次状态结算时刻：页面关闭期间按真实经过时间补算饥饿 / 心情 / 精力
      lastTick: 0,
      study: { total: 0, words: 0, listening: 0, reading: 0, essays: 0 },
      dogs: {
        d1: { id: 'd1', name: '奶糖', gen: 1, sex: 'F', colorKey: 'gold', stage: 'baby', age: 0, alive: true,
              bornAt: 0,
              hunger: 80, mood: 90, energy: 75, intimacy: 50, friends: [], partnerId: null, spouseId: null,
              married: false, affection: 0, offspring: [], talent: 50, parentId: null }
      },
      npcs: {},
      currentNPC: null,
      gifts: []
    },
    tasks: { daily: [] },
    stats: { learned: 0, reviews: 0, listening: 0, reading: 0, essays: 0 },

    /* ---- 数据看板所需 ---- */
    // 每日学习量埋点：'YYYY-MM-DD' -> { learned, reviews, listening, reading, essays }
    // 由 bumpStat 自动写入，学习模块无需改动
    daily: {},
    // 每日目标（可在看板里自定义）
    goals: { learned: 20, reviews: 20, listening: 1, reading: 1, essays: 1 },
    // 每日任务全达成的奖励领取标记：'YYYY-MM-DD' -> true
    bonus: {},

    /* ---- 单词闯关 ---- */
    // points: 累计积分 | rounds: 已闯关数 | passed: 过关数 | best: 单关最高分
    // correct/total: 累计答对/答题数
    quiz: { points: 0, rounds: 0, passed: 0, best: 0, correct: 0, total: 0 },

    /* ---- 单词消消乐 ---- */
    // points: 累计养成积分（同步计入小狗成长系统）| rounds: 完成局数 | best: 单局最高养成积分
    // pairs: 累计消除对数 | miss: 累计错配次数 | bestTime: 最快通关秒数（0=暂无记录）
    match: { points: 0, rounds: 0, best: 0, pairs: 0, miss: 0, bestTime: 0 }
  });

  let state = defaults();

  /* 成长节奏 v2 迁移：
   * 旧版小狗年龄靠定时器「每几秒 +1 天」推进，还带暂停/倍速/快进，一小时就能从幼年跑到老死。
   * 新版改为「出生时间戳 + 真实时间」推导年龄（1 真实天 = 1 岁），整段一生至少一个月。
   * 迁移策略：为每只狗补 bornAt；主角狗在测试期跑飞的年龄归零重新计时，
   * 名字 / 世代 / 天赋 / 婚姻 / 后代等身份数据一律保留。 */
  function migratePuppyLife(p) {
    if (!p || typeof p !== 'object') return;
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    p.dogs = p.dogs || {};
    if (!p.lifeV2) {
      p.lifeV2 = true;
      p.lastTick = now;
      delete p.speed;                       // 移除旧的时间倍速档位
      Object.keys(p.dogs).forEach(id => {
        const d = p.dogs[id];
        if (!d) return;
        if (id === p.currentId) {           // 主角狗：重新出生，正常节奏再走一遍
          d.bornAt = now; d.age = 0; d.stage = 'baby'; d.alive = true;
        } else {                            // 其它狗：按已有年龄反推出生时刻
          d.bornAt = now - (d.age || 0) * DAY;
        }
      });
      return;
    }
    if (!p.lastTick) p.lastTick = now;
    if (p.speed !== undefined) delete p.speed;
    Object.keys(p.dogs).forEach(id => {
      const d = p.dogs[id];
      if (d && !d.bornAt) d.bornAt = now - (d.age || 0) * DAY;
    });
  }

  // 守卫：补齐所有子对象字段，兼容任意旧存档 / 外部导入的不完整进度
  function guard(s) {
    s.reviewedByMode = s.reviewedByMode || {};
    ['dictation', 'cn2word', 'cloze'].forEach(m => {
      if (!s.reviewedByMode[m]) s.reviewedByMode[m] = {};
    });
    s.daily = s.daily || {};
    s.bonus = s.bonus || {};
    s.goals = Object.assign({ learned: 20, reviews: 20, listening: 1, reading: 1, essays: 1 }, s.goals || {});
    s.quiz = Object.assign({ points: 0, rounds: 0, passed: 0, best: 0, correct: 0, total: 0 }, s.quiz || {});
    s.match = Object.assign({ points: 0, rounds: 0, best: 0, pairs: 0, miss: 0, bestTime: 0 }, s.match || {});
    s.wrong = s.wrong || { words: [], listening: [], reading: [] };
    s.checkin = s.checkin || { dates: {}, streak: 0, lastDate: null };
    s.dog = s.dog || defaults().dog;
    s.puppy = s.puppy || defaults().puppy;
    migratePuppyLife(s.puppy);
    if (typeof s.food !== 'number') s.food = 0;
    s.words = s.words || {};
    s.roundLearned = s.roundLearned || {};
    if (s.lastLearnWord === undefined) s.lastLearnWord = null;
    return s;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { console.warn('Store load failed', e); }
    guard(state);
    return state;
  }

  /* ---- 进度导出 / 导入（用于跨设备 / U 盘携带） ---- */
  function exportState() {
    // 返回完整状态的深拷贝，调用方可包成带元信息的 JSON 下载
    return JSON.parse(JSON.stringify(state));
  }
  function importState(obj) {
    if (!obj || typeof obj !== 'object') throw new Error('进度文件格式无效');
    // 以 defaults 为底座合并导入数据，再走统一守卫补齐字段
    state = guard(Object.assign(defaults(), obj));
    save();
    return JSON.parse(JSON.stringify(state));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Store save failed', e); }
    // 同步层钩子：开启同步(房间名已设置)且当前不是「应用远端更新」时，把进度推到中继
    try {
      if (window.CET4Sync && !window.CET4Sync._applying && window.CET4Sync.isOn && window.CET4Sync.isOn()) {
        window.CET4Sync.push(state);
      }
    } catch (e) { console.warn('Store→Sync push skipped', e); }
  }

  function reset() { state = defaults(); save(); }

  const todayStr = () => new Date().toISOString().slice(0, 10);
  const dayMs = 86400000;

  /* ---- 单词状态 ---- */
  function setWordStatus(id, status) {
    state.words[id] = state.words[id] || {};
    state.words[id].status = status;
    save();
  }
  function getWordStatus(id) { return (state.words[id] || {}).status; }

  /* ---- 单词学习「本轮」状态：标记学过的卡片在本轮不再出现 ---- */
  function addRoundLearned(id) { state.roundLearned[id] = true; save(); }
  function isRoundLearned(id) { return !!(state.roundLearned && state.roundLearned[id]); }
  // 清空本轮记录 → 全部单词重新进入下一轮（已学卡片再次出现）
  function resetRound() { state.roundLearned = {}; save(); }
  function getRoundLearnedCount() {
    return state.roundLearned ? Object.keys(state.roundLearned).length : 0;
  }

  /* ---- 单词学习：记录 / 读取「上次正在看的单词」，实现重新打开即续学 ---- */
  function setLastLearnWord(id) { state.lastLearnWord = id; save(); }
  function getLastLearnWord() { return state.lastLearnWord != null ? state.lastLearnWord : null; }

  /* ---- 复习调度（艾宾浩斯） ---- */
  function scheduleWord(id, level = 0) {
    state.words[id] = state.words[id] || {};
    const days = EBBINGHAUS[Math.min(level, EBBINGHAUS.length - 1)];
    state.words[id].reviewLevel = level;
    state.words[id].dueTs = Date.now() + days * dayMs;
    save();
  }
  function getDueWords() {
    const now = Date.now();
    return Object.keys(state.words).filter(id => {
      const w = state.words[id];
      return w && w.dueTs && w.dueTs <= now && w.status !== 'mastered';
    });
  }
  function recordReview(id, correct) {
    const w = state.words[id] || {};
    let lvl = w.reviewLevel || 0;
    lvl = correct ? Math.min(lvl + 1, EBBINGHAUS.length - 1)
                  : 0;
    scheduleWord(id, lvl);
  }

  /* ---- 每模式独立的复习队列（三个模式互不影响） ---- */
  function getDueWordsForMode(mode) {
    const done = (state.reviewedByMode && state.reviewedByMode[mode]) || {};
    // 仅过滤掉「本模式已复习过」的词；其他模式做没做过不影响本模式显示
    return getDueWords().filter(id => !done[id]);
  }

  /* ---- 记录某模式下的复习结果 ----
   * 只把该词加入「本模式」已复习集合；
   * 仅当三种模式都复习过该词时，才推进全局艾宾浩斯排期（三模式全对才延长，否则缩短），
   * 并清空三个模式的该词记录，使其下次到期时重新进入所有模式。
   */
  const MODES = ['dictation', 'cn2word', 'cloze'];
  function markModeReviewed(id, mode, correct) {
    state.reviewedByMode = state.reviewedByMode || {};
    MODES.forEach(m => { if (!state.reviewedByMode[m]) state.reviewedByMode[m] = {}; });
    state.reviewedByMode[mode][id] = { correct: !!correct, ts: Date.now() };
    const allModesDone = MODES.every(m => state.reviewedByMode[m][id]);
    if (allModesDone) {
      const allCorrect = MODES.every(m => state.reviewedByMode[m][id].correct);
      recordReview(id, allCorrect); // 三模式全对→延长；任一答错→缩短
      MODES.forEach(m => { delete state.reviewedByMode[m][id]; });
    }
    save();
    return allModesDone;
  }
  function logReview(mode, correct, total) {
    state.reviewLog.push({ ts: Date.now(), mode, correct, total });
    save();
  }

  /* ---- 狗粮 ---- */
  // 学习赚到狗粮后自动投喂给小狗（由 puppy 模块注册 window.PuppyAuto.autoFeed）。
  // 只在小狗真的饿了时才消耗，吃饱后新赚的狗粮照常入账，不会被白吃掉。
  function addFood(n) {
    state.food += n;
    save();
    try {
      if (window.PuppyAuto && typeof window.PuppyAuto.autoFeed === 'function') window.PuppyAuto.autoFeed(n);
    } catch (e) { console.warn('[Store] 自动投喂失败', e); }
  }
  function spendFood(n) {
    if (state.food < n) return false;
    state.food -= n; save(); return true;
  }
  function getFood() { return state.food; }

  /* ---- 打卡 ---- */
  function hasCheckedToday() { return !!state.checkin.dates[todayStr()]; }
  function doCheckin() {
    const t = todayStr();
    if (state.checkin.dates[t]) return { ok: false, streak: state.checkin.streak };
    state.checkin.dates[t] = true;
    const y = new Date(Date.now() - dayMs).toISOString().slice(0, 10);
    state.checkin.streak = (state.checkin.lastDate === y) ? state.checkin.streak + 1 : 1;
    state.checkin.lastDate = t;
    // 连续7天解锁限定皮肤
    if (state.checkin.streak >= 7) state.dog.skin = 'limited';
    save();
    return { ok: true, streak: state.checkin.streak };
  }

  /* ---- 错题收藏 ---- */
  function addWrong(coll, id) {
    const arr = state.wrong[coll] || (state.wrong[coll] = []);
    if (!arr.includes(id)) { arr.push(id); save(); }
  }
  function removeWrong(coll, id) {
    const arr = state.wrong[coll] || [];
    state.wrong[coll] = arr.filter(x => x !== id); save();
  }
  function getWrong(coll) { return state.wrong[coll] || []; }

  /* ---- 小狗 ---- */
  function getDog() { return state.dog; }
  function updateDog(patch) { Object.assign(state.dog, patch); save(); }

  /* ---- 统计（同时写入每日埋点，供数据看板绘制趋势） ---- */
  function bumpStat(key, n = 1) {
    state.stats[key] = (state.stats[key] || 0) + n;
    const t = todayStr();
    state.daily = state.daily || {};
    const d = state.daily[t] || (state.daily[t] = { learned: 0, reviews: 0, listening: 0, reading: 0, essays: 0 });
    d[key] = (d[key] || 0) + n;
    save();
  }

  /* ---- 看板：每日数据 / 目标 / 每日奖励 ---- */
  const EMPTY_DAY = () => ({ learned: 0, reviews: 0, listening: 0, reading: 0, essays: 0 });

  // 取某天的学习量（默认今天）
  function getDay(dateStr) {
    const t = dateStr || todayStr();
    return Object.assign(EMPTY_DAY(), (state.daily || {})[t] || {});
  }
  // 取最近 n 天（含今天），按时间正序返回 [{date, learned, ...}]
  function getRecentDays(n = 7) {
    const out = [];
    // 以 UTC 基准推算，与 todayStr()（toISOString 切片）口径一致，避免时区偏移一天
    const p = todayStr().split('-').map(Number);
    const base = Date.UTC(p[0], p[1] - 1, p[2]);
    for (let i = n - 1; i >= 0; i--) {
      const key = new Date(base - i * dayMs).toISOString().slice(0, 10);
      out.push(Object.assign({ date: key }, getDay(key)));
    }
    return out;
  }
  // 有学习记录的总天数
  function getStudyDays() {
    return Object.keys(state.daily || {}).filter(k => {
      const d = state.daily[k];
      return d && (d.learned || d.reviews || d.listening || d.reading || d.essays);
    }).length;
  }
  function getGoals() { return Object.assign({}, state.goals); }
  function setGoals(patch) { Object.assign(state.goals, patch || {}); save(); }

  // 今日 5 项任务是否全部达标
  function allGoalsDone() {
    const d = getDay(), g = state.goals;
    return ['learned', 'reviews', 'listening', 'reading', 'essays']
      .every(k => (g[k] || 0) <= 0 || (d[k] || 0) >= g[k]);
  }
  function bonusClaimed(dateStr) { return !!(state.bonus || {})[dateStr || todayStr()]; }
  // 领取每日全勤奖励（狗粮），一天仅一次
  function claimDailyBonus(amount = 20) {
    const t = todayStr();
    if (bonusClaimed(t) || !allGoalsDone()) return { ok: false };
    state.bonus[t] = true;
    state.food += amount;
    save();
    return { ok: true, amount };
  }

  /* ---- 单词闯关：结算一关（积分/正确数落库 + 每日埋点，供数据看板展示） ---- */
  function addQuizScore(points, correct, total, passed) {
    const q = state.quiz;
    q.points += points;
    q.rounds += 1;
    if (passed) q.passed += 1;
    if (points > q.best) q.best = points;
    q.correct += correct;
    q.total += total;
    // 每日埋点：当天闯关次数（daily 其余键由 bumpStat 维护，互不影响）
    const t = todayStr();
    state.daily = state.daily || {};
    const d = state.daily[t] || (state.daily[t] = { learned: 0, reviews: 0, listening: 0, reading: 0, essays: 0 });
    d.quiz = (d.quiz || 0) + 1;
    d.quizPts = (d.quizPts || 0) + points;
    save();
    return Object.assign({}, q);
  }
  function getQuiz() { return Object.assign({}, state.quiz); }

  /* ---- 单词消消乐：结算一局 ----
   * points 为本局获得的养成积分（已由模块实时 gain 进小狗成长系统，这里只做累计留档）
   */
  function addMatchScore(points, pairs, miss, seconds) {
    const m = state.match;
    m.points += points;
    m.rounds += 1;
    m.pairs += pairs;
    m.miss += miss;
    if (points > m.best) m.best = points;
    if (seconds > 0 && (!m.bestTime || seconds < m.bestTime)) m.bestTime = seconds;
    // 每日埋点（daily 其余键由 bumpStat 维护，互不影响）
    const t = todayStr();
    state.daily = state.daily || {};
    const d = state.daily[t] || (state.daily[t] = { learned: 0, reviews: 0, listening: 0, reading: 0, essays: 0 });
    d.match = (d.match || 0) + 1;
    d.matchPts = (d.matchPts || 0) + points;
    save();
    return Object.assign({}, m);
  }
  function getMatch() { return Object.assign({}, state.match); }

  /* ---- 任务 ---- */
  function getTasks() { return state.tasks.daily; }
  function setTasks(arr) { state.tasks.daily = arr; save(); }

  return {
    load, save, reset,
    exportState, importState,
    setWordStatus, getWordStatus,
    addRoundLearned, isRoundLearned, resetRound, getRoundLearnedCount,
    setLastLearnWord, getLastLearnWord,
    scheduleWord, getDueWords, getDueWordsForMode, recordReview, markModeReviewed, logReview,
    addFood, spendFood, getFood,
    hasCheckedToday, doCheckin,
    addWrong, removeWrong, getWrong,
    getDog, updateDog,
    bumpStat, getTasks, setTasks,
    getDay, getRecentDays, getStudyDays,
    getGoals, setGoals, allGoalsDone, bonusClaimed, claimDailyBonus,
    addQuizScore, getQuiz,
    addMatchScore, getMatch,
    get state() { return state; },
    EBBINGHAUS
  };
})();

/* 顶层 const 不会自动挂到 window 上，这里显式导出，
   保证各模块里 `window.Store && ...` 这类判断能正常生效（否则会静默跳过狗粮结算）。 */
window.Store = Store;
