/*!
 * dog.js —— 软萌金毛立绘
 * ---------------------------------------------------------------------------
 * 全站小狗形象的唯一出口。当前使用一张离线 PNG（assets/images/dog.png），
 * 无网络依赖，file:// 直接打开也能显示。
 *
 * stage 参数保留是为了兼容各模块既有调用（baby / teen / adult），
 * 若后续想按成长阶段换图，只需在这里按 stage 返回不同文件即可，
 * 调用方一行都不用改。
 * ---------------------------------------------------------------------------
 */
window.CuteDog = (function () {
  var BASE = 'assets/images/';

  // 成长阶段 -> 图片文件名（目前三个阶段共用同一只金毛）
  var STAGE_IMG = {
    baby:  'dog.png',
    teen:  'dog.png',
    adult: 'dog.png'
  };

  /**
   * 返回小狗的 HTML 片段
   * @param {string} [stage] baby | teen | adult
   * @returns {string} <img> 标签字符串
   */
  function svg(stage) {
    var file = STAGE_IMG[stage || 'adult'] || STAGE_IMG.adult;
    return '<img class="cute-dog" src="' + BASE + file + '" alt="软萌金毛幼犬" loading="lazy" />';
  }

  return { svg: svg };
})();
