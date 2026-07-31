/* 作文素材数据层：万能模板 / 高级句式 / 低分词替换 / 话题语料 / 范文解析
 * 字段约定见各数组。window.ESSAYS 由 modules/essays.js 读取渲染。
 */
window.ESSAYS = {
  /* ---------- 万能模板：按体裁给可直接套用的段落骨架 ---------- */
  templates: [
    {
      type: "议论文 · 现象解释型",
      desc: "先描述现象，再分析原因/影响，最后给个人看法（四级最常见题型）",
      blocks: [
        { label: "开头段（现象）", text: "In recent years, [现象] has aroused wide concern among the public. It is generally accepted that this issue deserves our serious attention." },
        { label: "主体段一（原因）", text: "Several factors account for this phenomenon. To begin with, [原因1]. Besides, [原因2]. What's more, [原因3]." },
        { label: "主体段二（影响/看法）", text: "As for me, I hold the view that [个人看法]. On the one hand, [好处/坏处1]; on the other hand, [好处/坏处2]." },
        { label: "结尾段", text: "In conclusion, only by [建议/措施] can we [期望结果]. It is high time that we took effective action." }
      ]
    },
    {
      type: "议论文 · 观点对比型",
      desc: "Some... Others... I think（讨论两类观点的题型）",
      blocks: [
        { label: "开头段", text: "When it comes to [话题], opinions vary from person to person. A majority of people hold that [观点A]." },
        { label: "主体段一（观点A）", text: "They maintain that [支持A的理由]. For one thing, [理由1]; for another, [理由2]." },
        { label: "主体段二（观点B）", text: "However, others hold the opposite view. They argue that [观点B及理由]. Moreover, [补充理由]." },
        { label: "结尾段（我的看法）", text: "As far as I am concerned, [我的立场]. I am convinced that [结论]." }
      ]
    },
    {
      type: "图表作文 · 数据描述型",
      desc: "折线/柱状/饼图、表格类（先描述数据，再分析原因，最后预测/建议）",
      blocks: [
        { label: "开头段（总述图表）", text: "As is clearly shown in the chart/table, [总体趋势/最大变化]. Obviously, [核心数据结论]." },
        { label: "主体段一（细节）", text: "To be specific, [数据1] increased/declined from [A] to [B] between [年份]. By contrast, [数据2] witnessed a sharp change." },
        { label: "主体段二（原因）", text: "The reasons for this trend are as follows. First, [原因1]. Second, [原因2]." },
        { label: "结尾段", text: "In brief, this tendency will continue/should be addressed. It is advisable that [建议]." }
      ]
    },
    {
      type: "应用文 · 建议信",
      desc: "给学校/机构/朋友提建议（注意礼貌、具体、可操作）",
      blocks: [
        { label: "开头段", text: "I am writing to express my views on [主题] and offer some practical suggestions, which I hope will be of some help to you." },
        { label: "主体段一", text: "First and foremost, it would be beneficial if [建议1]. Additionally, [建议2] is also worth considering." },
        { label: "主体段二", text: "Last but not least, I suggest that [建议3]. Only in this way can [预期效果]." },
        { label: "结尾段", text: "I would appreciate it if you could take my suggestions into account. I am looking forward to your early reply." }
      ]
    },
    {
      type: "应用文 · 现象/投诉信",
      desc: "反映问题、表达改进诉求",
      blocks: [
        { label: "开头段", text: "I am a regular user of [事物]. I am writing to draw your attention to a problem that has been bothering me lately." },
        { label: "主体段", text: "The problem is that [具体问题]. This has caused [影响]. Therefore, I strongly recommend that [诉求]." },
        { label: "结尾段", text: "I would be grateful if you could solve the problem as soon as possible. Thank you for your time and consideration." }
      ]
    }
  ],

  /* ---------- 高级句式：可直接替换平淡表达的句型 ---------- */
  sentences: [
    { cat: "开头段", en: "It is universally acknowledged that...", zh: "众所周知……（比 Everyone knows 高级）" },
    { cat: "开头段", en: "Recently the issue of ... has been brought into sharp focus.", zh: "近来，……问题受到密切关注。" },
    { cat: "开头段", en: "There is a growing awareness that...", zh: "人们越来越意识到……" },
    { cat: "过渡/列举", en: "First and foremost, ... What's more, ... Last but not least, ...", zh: "首先……其次……最后（递进三连，比 first/second/third 高级）" },
    { cat: "过渡/列举", en: "A case in point is that...", zh: "一个典型的例子是……（举例高级表达）" },
    { cat: "强调", en: "It is ... that truly matters.", zh: "真正重要的是……（强调句 it is ... that）" },
    { cat: "强调", en: "Nothing is more important than the fact that...", zh: "最重要的是……（比 very important 高级）" },
    { cat: "对比", en: "While A brings convenience, it also gives rise to B.", zh: "A 带来便利的同时，也引发了 B。（让步对比）" },
    { cat: "对比", en: "The merits of A outweigh its demerits.", zh: "A 的优点多于缺点。" },
    { cat: "因果", en: "A contributes to B.", zh: "A 促成/导致 B。（比 A makes B 高级）" },
    { cat: "因果", en: "This is largely attributed to the fact that...", zh: "这在很大程度上归因于……" },
    { cat: "举例", en: "Take ... as a typical example.", zh: "以……为例。" },
    { cat: "利弊", en: "Every coin has two sides, and ... is no exception.", zh: "凡事有利有弊，……也不例外。" },
    { cat: "结尾", en: "Only by ... can we ...", zh: "只有……我们才能……（倒装句，结尾加分）" },
    { cat: "结尾", en: "It is high time that we took effective measures.", zh: "是我们采取有效措施的时候了。（虚拟语气）" },
    { cat: "结尾", en: "I am firmly convinced that ... will make a difference.", zh: "我坚信……会带来改变。" }
  ],

  /* ---------- 低分词替换：把小学词汇换成四级加分词 ---------- */
  upgrades: [
    { low: "good", high: "beneficial / desirable / favorable", note: "说好处时用 beneficial，说可取时用 desirable" },
    { low: "bad", high: "detrimental / harmful / adverse", note: "对……有害：be detrimental to" },
    { low: "important", high: "crucial / vital / significant / essential", note: "至关重要的：of crucial importance" },
    { low: "think", high: "maintain / hold the view that / be convinced that", note: "我认为：I maintain that..." },
    { low: "many", high: "a host of / a multitude of / numerous", note: "大量：a host of people" },
    { low: "should", high: "be supposed to / it is imperative that", note: "必须：it is imperative that we (should)..." },
    { low: "use", high: "employ / utilize / make full use of", note: "使用：employ a method" },
    { low: "help", high: "contribute to / play a part in", note: "有助于：contribute to success" },
    { low: "more and more", high: "increasingly / an growing number of", note: "越来越多：increasingly popular" },
    { low: "thing", high: "issue / matter / aspect", note: "事情：a pressing issue" },
    { low: "show", high: "demonstrate / illustrate / indicate", note: "表明：data demonstrate that..." },
    { low: "because", high: "in that / on account of / due to", note: "由于：on account of the fact that" },
    { low: "so", high: "consequently / as a result / thereby", note: "因此：consequently," },
    { low: "advantage", high: "merit / strength", note: "优点：the merits of..." },
    { low: "disadvantage", high: "drawback / demerit / weakness", note: "缺点：a major drawback" },
    { low: "happy", high: "delighted / pleased / overjoyed", note: "高兴的：I am delighted to..." },
    { low: "big", high: "considerable / substantial / enormous", note: "巨大的：a considerable number" },
    { low: "get", high: "obtain / acquire / gain", note: "获得：obtain knowledge" },
    { low: "problem", high: "dilemma / challenge / issue", note: "难题：face a dilemma" },
    { low: "improve", high: "enhance / promote / upgrade", note: "提升：enhance efficiency" }
  ],

  /* ---------- 话题语料：高频四级写作话题的词与短语 ---------- */
  topics: [
    { topic: "网络安全 / 数字生活", words: ["privacy 隐私", "cybercrime 网络犯罪", "leak 泄露", "account 账户", "authenticity 真实性"], phrases: ["protect personal information 保护个人信息", "fall victim to 成为……的受害者", "raise security awareness 提高安全意识", "under no circumstances 绝不"] },
    { topic: "人工智能", words: ["algorithm 算法", "automation 自动化", "efficiency 效率", "replace 取代", "ethical 伦理的"], phrases: ["double-edged sword 双刃剑", "pose a threat to 对……构成威胁", "boost productivity 提升生产力", "strike a balance 取得平衡"] },
    { topic: "环保 / 低碳", words: ["emission 排放", "sustainable 可持续的", "recycle 回收", "conservation 保护", "carbon 碳"], phrases: ["low-carbon lifestyle 低碳生活", "raise environmental awareness 提高环保意识", "take effective measures 采取有效措施", "leave a better planet 留下更美好的星球"] },
    { topic: "心理健康", words: ["stress 压力", "anxiety 焦虑", "well-being 幸福/安康", "resilience 韧性", "counseling 心理咨询"], phrases: ["under great pressure 压力巨大", "keep a positive attitude 保持积极心态", "seek help 寻求帮助", "mental health matters 心理健康很重要"] },
    { topic: "志愿服务 / 社会责任", words: ["volunteer 志愿者", "community 社区", "contribution 贡献", "charity 慈善", "responsibility 责任"], phrases: ["devote oneself to 投身于", "sense of achievement 成就感", "benefit both givers and receivers 赠人玫瑰手有余香", "fulfill one's duty 履行职责"] },
    { topic: "终身学习", words: ["knowledge 知识", "competence 能力", "self-discipline 自律", "qualification 资格", "adapt 适应"], phrases: ["keep pace with 跟上……步伐", "lifelong learning 终身学习", "broaden one's horizons 拓宽视野", "stay competitive 保持竞争力"] },
    { topic: "传统文化", words: ["heritage 遗产", "custom 习俗", "identity 认同", "revive 复兴", "root 根源"], phrases: ["cultural confidence 文化自信", "pass down 传承", "take pride in 以……为傲", "bridge the past and present 连接古今"] },
    { topic: "健康生活", words: ["balanced 均衡的", "routine 日常", "exercise 锻炼", "nutrition 营养", "habit 习惯"], phrases: ["a balanced diet 均衡饮食", "regular physical activity 规律运动", "form a good habit 养成好习惯", "stay in good shape 保持好身材/状态"] },
    { topic: "短视频与注意力", words: ["short-video 短视频", "attention 注意力", "distraction 分心", "algorithm 算法", "self-control 自律"], phrases: ["short-video fatigue 短视频疲劳", "lose focus 失去专注", "cultivate deep reading 培养深度阅读", "strike a balance 取得平衡"] },
    { topic: "数字素养 / 信息辨别", words: ["literacy 素养", "misinformation 虚假信息", "verify 核实", "critical 批判的", "source 来源"], phrases: ["think critically 批判思考", "verify before sharing 转发前核实", "distinguish truth from rumor 辨明真假", "media literacy 媒介素养"] }
  ],

  /* ---------- 范文解析：带结构与逐段翻译的真题方向范文 ---------- */
  models: [
    {
      title: "数字设备是否在削弱我们的人际交往？",
      type: "议论文（现象解释型 · 近年热点）",
      outline: "开头提现象 → 主体分析双面影响 → 结尾给平衡建议",
      paras: [
        { role: "开头段", en: "In recent years, the widespread use of digital devices has aroused wide concern. Many worry that face-to-face communication is being replaced by screen time.", zh: "近年来，数字设备的普及引发广泛关注。许多人担心面对面交流正被屏幕时间取代。" },
        { role: "主体段·利", en: "Admittedly, digital tools bring undeniable benefits. They enable us to keep in touch with distant friends and access information instantly, which strengthens some weak ties.", zh: "诚然，数字工具有不可否认的好处。它们让我们与远方朋友保持联系、即时获取信息，从而巩固了一些弱联系。" },
        { role: "主体段·弊", en: "Nevertheless, over-reliance on screens can be detrimental. People absorbed in phones often ignore companions nearby, and shallow online chat may weaken real empathy.", zh: "然而，过度依赖屏幕可能有害。沉迷手机的人常忽视身边的同伴，肤浅的线上闲聊也可能削弱真正的共情。" },
        { role: "结尾段", en: "In conclusion, technology is a tool, not a substitute. We should use it to assist, not replace, genuine interaction, and set aside phones when with people we care about.", zh: "总之，科技是工具而非替代品。我们应让它辅助而非取代真实互动，并在与在乎的人相处时放下手机。" }
      ],
      notes: "亮点：admittedly / nevertheless 让步对比；detrimental / empathy 加分词；结尾 it is a tool, not a substitute 收束有力。"
    },
    {
      title: "给图书馆的一封建议信",
      type: "应用文（建议信 · 高频题型）",
      outline: "礼貌开头 → 两条具体建议 → 期待回复",
      paras: [
        { role: "开头段", en: "I am writing to express my views on the school library and offer some practical suggestions, which I hope will be of some help to you.", zh: "我写此信是想表达对学校图书馆的看法，并提出一些实用建议，望对你有所帮助。" },
        { role: "主体段一", en: "First and foremost, it would be beneficial if the opening hours were extended during exam weeks. Additionally, more sockets for laptops would meet students' study needs.", zh: "首先，若能在考试周延长开放时间将很有益。此外，增设笔记本电脑插座能满足学生学习需求。" },
        { role: "主体段二", en: "Last but not least, I suggest that a quiet zone be clearly marked, so that those who need deep focus will not be disturbed.", zh: "最后，我建议明确划分安静区，让需要深度专注的人不被打扰。" },
        { role: "结尾段", en: "I would appreciate it if you could take my suggestions into account. I am looking forward to your early reply.", zh: "若您能考虑我的建议，我将十分感激。期待您的早日回复。" }
      ],
      notes: "亮点：it would be beneficial if... 委婉建议；Last but not least 递进；appreciate / take into account 礼貌收尾。"
    },
    {
      title: "大学生每日阅读时长变化（图表作文）",
      type: "图表作文（数据描述型）",
      outline: "总述图表 → 列具体数据 → 析原因 → 给建议",
      paras: [
        { role: "开头段", en: "As is clearly shown in the chart, the average daily reading time of college students rose from 38 minutes in 2021 to 72 minutes in 2024.", zh: "如图表所示，大学生日均阅读时长从 2021 年的 38 分钟上升到 2024 年的 72 分钟。" },
        { role: "主体段·细节", en: "To be specific, the figure jumped sharply in 2023, when reading apps and book clubs became popular on campus.", zh: "具体而言，该数字在 2023 年骤增，当时阅读类 App 与读书社团在校园流行。" },
        { role: "主体段·原因", en: "The reasons are as follows. First, students grew more aware of self-improvement. Second, short-video fatigue pushed many back to books.", zh: "原因有以下几点。首先，学生自我提升意识增强。其次，短视频疲劳促使许多人重返书本。" },
        { role: "结尾段", en: "In brief, this positive trend should be encouraged. It is advisable that schools provide more reading spaces.", zh: "简言之，这一积极趋势应被鼓励。学校提供更宜阅读的空间是明智之举。" }
      ],
      notes: "亮点：As is clearly shown / to be specific 图表标配；the figure jumped sharply 动态描述；positive trend 收束。"
    },
    {
      title: "短视频是否在改变我们的阅读方式？",
      type: "议论文（现象解释型 · 近年热点）",
      outline: "提现象 → 析两面影响 → 给平衡建议",
      paras: [
        { role: "开头段", en: "In recent years, short videos have flooded our screens and quietly reshaped how we read.", zh: "近年来，短视频充斥屏幕，悄悄重塑了我们的阅读方式。" },
        { role: "主体段·利", en: "Admittedly, they offer bite-sized knowledge and lower the barrier to learning for many.", zh: "诚然，它们提供碎片化知识，为许多人降低了学习门槛。" },
        { role: "主体段·弊", en: "Nevertheless, endless scrolling can shorten attention spans and weaken the habit of deep reading.", zh: "然而，无休止的刷屏会缩短注意力时长，削弱深度阅读的习惯。" },
        { role: "结尾段", en: "In conclusion, we should treat short videos as a starter, not a substitute, and set aside time for real books.", zh: "总之，我们应以短视频为引子而非替代，并为真正的书留出时间。" }
      ],
      notes: "亮点：admittedly / nevertheless 让步对比；bite-sized / shorten attention spans 加分词；结尾 starter vs substitute 收束有力。"
    }
  ]
};
