/* 分级阅读数据层：近年四级方向的仔细阅读篇章（文章横排、点句出翻译、无朗读、题目接近真题难度）
 * 字段约定：
 *   id / level(1-5) / title / genre / year(近年) / stars(难度1-5)
 *   paras: 段落数组，每段落是 [{en, zh}] 句子数组（点 en 浮现 zh）
 *   vocab: [{w, m}] 生词提示（可选折叠）
 *   questions: [{q, options[4], answer(0基), explain}]
 */
window.READING = [
  {
    id: "rd_ai_work",
    level: 3,
    title: "AI in the Workplace: Threat or Assistant?",
    genre: "科技与社会",
    year: "2024.12",
    stars: 4,
    paras: [
      [
        { en: "Artificial intelligence has quietly moved from science fiction into the ordinary routines of the modern office.", zh: "人工智能已悄然从科幻小说走进现代办公室的日常运转之中。" },
        { en: "It now filters our emails, drafts replies, and ranks the tasks we should do next.", zh: "它现在会筛选邮件、起草回复，并为我们要做的下一项任务排序。" },
        { en: "This shift has renewed a familiar fear: that smart machines will one day take people's jobs.", zh: "这一转变重新唤起了一个熟悉的担忧：智能机器终有一天会夺走人们的工作。" }
      ],
      [
        { en: "Historians of technology note that automation has repeatedly changed work rather than erased it.", zh: "技术史学家指出，自动化一再改变工作，而非将其抹去。" },
        { en: "When automated teller machines appeared, many assumed bank clerks would vanish.", zh: "当自动取款机出现时，许多人以为银行柜员会消失。" },
        { en: "Instead, branches multiplied and the total number of clerks actually rose for years.", zh: "结果分行成倍增加，柜员的总数反而连续多年上升。" }
      ],
      [
        { en: "A similar pattern is likely with artificial intelligence, but the transition will not be painless.", zh: "人工智能很可能重演类似模式，但这一转变不会毫无痛感。" },
        { en: "Roles built on routine data processing are already shrinking, while demand grows for skills machines lack.", zh: "以常规数据处理为基础的岗位正在萎缩，而对机器所缺技能的需求却在增长。" },
        { en: "Workers who cannot reskill risk being pushed to the margins of a changing labor market.", zh: "无法再培训的劳动者，面临被推入不断变化劳动力市场边缘的风险。" }
      ],
      [
        { en: "The practical answer is not to reject the technology but to redesign how people and machines cooperate.", zh: "务实的应对不是拒绝这项技术，而是重新设计人与机器的协作方式。" },
        { en: "Companies that pair employees with AI tools report higher output and fewer burnout cases.", zh: "让员工与人工智能工具搭配的企业，报告了更高的产出与更少的倦怠案例。" },
        { en: "In the end, the winners will be those who treat lifelong learning as a necessity, not a luxury.", zh: "归根结底，赢家将是那些把终身学习当作必需、而非奢侈的人。" }
      ]
    ],
    vocab: [
      { w: "automation", m: "n. 自动化" },
      { w: "erase", m: "v. 抹去，消除" },
      { w: "routine", m: "adj. 日常的，常规的" },
      { w: "margin", m: "n. 边缘；余地" },
      { w: "burnout", m: "n. 倦怠，精疲力竭" }
    ],
    questions: [
      { q: "What is the main idea of the passage?", options: ["AI will soon make most office jobs disappear forever.", "Technology changes jobs but does not simply destroy them, and reskilling matters.", "Bank clerks should return to school to learn programming.", "Companies must reject AI to protect their workers."], answer: 1, explain: "全文围绕“技术改变而非消灭工作、再培训关键”展开，首段提担忧、二段用 ATM 例证、三段讲阵痛、四段给解法，B 最概括。" },
      { q: "Why does the author mention automated teller machines?", options: ["To show that new technology always reduces employment.", "To prove that banks no longer need human clerks.", "To illustrate that automation can increase rather than cut certain jobs.", "To argue that cash will disappear in the future."], answer: 2, explain: "第二段以 ATM 为例，说明新技术反而使柜员总数上升，佐证“自动化改变而非摧毁岗位”。" },
      { q: "The word \"margins\" in Paragraph 3 is closest in meaning to ______.", options: ["the edges or outside positions", "the center of attention", "the top salaries", "the training programs"], answer: 0, explain: "be pushed to the margins 指“被推到边缘/外围”，与 edges / outside positions 同义，呼应“被劳动力市场抛下”。" },
      { q: "What can be inferred about workers who fail to reskill?", options: ["They will be promoted to manage AI systems.", "They may be left behind by the changing job market.", "They will earn more because machines cannot replace them.", "They will be hired by technology companies."], answer: 1, explain: "第三段末句指出无法再培训者“面临被推入市场边缘的风险”，可推知他们可能被变革甩下。" },
      { q: "According to the passage, what separates the winners in the AI era?", options: ["Avoiding all contact with new technology.", "Treating continuous learning as essential.", "Working longer hours than before.", "Refusing to cooperate with machines."], answer: 1, explain: "末段明确说赢家是“把终身学习当作必需而非奢侈”的人，对应 B。" }
    ]
  },

  {
    id: "rd_green_city",
    level: 4,
    title: "Urban Green Spaces and Public Health",
    genre: "环境与自然",
    year: "2025.06",
    stars: 5,
    paras: [
      [
        { en: "A growing body of research suggests that city parks are not merely decoration but a form of public health infrastructure.", zh: "越来越多的研究表明，城市公园不只是装饰，而是一种公共健康基础设施。" },
        { en: "People who live within a short walk of green space report lower stress and better sleep than those who do not.", zh: "住在步行可达绿地附近的人，比没有这种条件的人压力更低、睡眠更好。" },
        { en: "The effect appears across income groups, though poorer neighborhoods often have the least access.", zh: "这种效应跨越收入群体都存在，尽管较贫困的社区往往最难享受到。" }
      ],
      [
        { en: "One explanation lies in how nature restores attention and calms the nervous system.", zh: "一种解释在于自然如何恢复注意力、平抚神经系统。" },
        { en: "After a few minutes among trees, measurements of blood pressure and heart rate tend to fall.", zh: "在树林中待上几分钟后，血压和心率的测值往往会下降。" },
        { en: "This is why some hospitals now prescribe time outdoors as part of recovery.", zh: "正因如此，一些医院现在把“户外时间”作为康复的一部分来开具。" }
      ],
      [
        { en: "Yet the benefits depend on quality, not just quantity, of green space.", zh: "然而益处取决于绿地的质量，而非仅仅数量。" },
        { en: "A neglected lot full of litter provides little relief, while a safe, well-kept park invites daily use.", zh: "一个堆满垃圾的荒废空地几乎无助于舒缓，而安全、维护良好的公园则吸引日常使用。" },
        { en: "Equity matters: a city can have many parks and still fail its most vulnerable residents.", zh: "公平很重要：一座城市可以有许多公园，却仍辜负其最脆弱的居民。" }
      ],
      [
        { en: "Planners are beginning to treat canopy cover and walkability as measurable health targets.", zh: "规划者开始把树冠覆盖率和步行可达性当作可衡量的健康指标。" },
        { en: "Singapore and several European cities have set binding goals for tree planting and park access.", zh: "新加坡与若干欧洲城市已为植树和公园可达性设定了有约束力的目标。" },
        { en: "If the trend holds, a leafy street may one day be seen as essential as a clinic.", zh: "若这一趋势延续，绿树成荫的街道有朝一日或将被视作与诊所同样必要。" }
      ]
    ],
    vocab: [
      { w: "infrastructure", m: "n. 基础设施" },
      { w: "restore", m: "v. 恢复，修复" },
      { w: "canopy", m: "n. （树木的）冠层" },
      { w: "equity", m: "n. 公平，公正" },
      { w: "vulnerable", m: "adj. 脆弱的，易受伤的" }
    ],
    questions: [
      { q: "The author views city parks primarily as ______.", options: ["expensive decorations for the wealthy", "a kind of public health infrastructure", "a threat to urban safety", "a complete substitute for hospitals"], answer: 1, explain: "首段首句直接点明公园“是一种公共健康基础设施”，对应 B。" },
      { q: "According to the passage, the health benefits of green space ______.", options: ["are limited to rich neighborhoods", "appear across income groups but access is uneven", "only work for young people", "require living far from the city"], answer: 1, explain: "首段末句说效应跨收入群体存在，但贫困社区最难享受，即“普遍存在却分配不均”。" },
      { q: "The word \"canopy\" in Paragraph 4 most nearly means ______.", options: ["the layer of tree branches and leaves above the ground", "the network of public transport", "the budget of a city government", "the surface of a river"], answer: 0, explain: "canopy cover 指“树冠覆盖率”，即地面上空枝叶构成的层次，A 正确。" },
      { q: "What point does the author make about equity?", options: ["Poor neighborhoods already have the most parks.", "A city can have many parks yet still fail its weakest residents.", "Green space should be reserved for hospitals.", "Tree planting is unimportant for health."], answer: 1, explain: "第三段末句强调公平：城市公园再多，若分配不公仍会辜负最脆弱居民。" },
      { q: "The author's attitude toward the planning trend is best described as ______.", options: ["hopeful", "hostile", "indifferent", "pessimistic"], answer: 0, explain: "末段用“若趋势延续……或将被视作必要”表达期待与认可，态度是乐观/有希望的。" }
    ]
  },

  {
    id: "rd_experience",
    level: 3,
    title: "The Rise of the Experience Economy",
    genre: "经济与消费",
    year: "2024.06",
    stars: 4,
    paras: [
      [
        { en: "Among younger consumers, a quiet shift is reshaping what people choose to spend money on.", zh: "在年轻消费者中，一场悄然的转变正在重塑人们花钱的选择。" },
        { en: "Rather than accumulating objects, many now prefer to pay for experiences such as travel, concerts, and classes.", zh: "许多人不再囤积物品，而是更愿意为旅行、演唱会、课程等体验付费。" },
        { en: "Market researchers call this the rise of the experience economy.", zh: "市场研究者称之为体验经济的兴起。" }
      ],
      [
        { en: "The appeal is partly psychological: memories outlast products, and stories are easier to share.", zh: "其吸引力部分来自心理层面：记忆比物品更持久，故事也更易分享。" },
        { en: "A well-designed trip can deliver more lasting satisfaction than a new phone that feels outdated within a year.", zh: "一趟精心设计的旅行，带来的满足感会比一年就过时的新手机更持久。" },
        { en: "Social media amplifies the effect by rewarding visible, shareable moments.", zh: "社交媒体通过奖励可见、可分享的瞬间，放大了这种效应。" }
      ],
      [
        { en: "Businesses have noticed and are repackaging ordinary goods as experiences.", zh: "企业已注意到这点，正把普通商品重新包装成体验。" },
        { en: "Shops host workshops, restaurants stage shows, and brands sell memberships instead of items.", zh: "商店办起工作坊，餐厅安排演出，品牌售卖会员资格而非单件物品。" },
        { en: "The line between buying a thing and buying a feeling has grown thin.", zh: "购买一件东西与购买一种感受之间的界限，已变得模糊。" }
      ],
      [
        { en: "Critics warn that the model can encourage overspending on fleeting pleasures.", zh: "批评者警告，这种模式会刺激人们在转瞬即逝的快乐上过度消费。" },
        { en: "Yet for many, the trade reflects a clearer sense of what actually brings happiness.", zh: "但对许多人而言，这种取舍反映出对“什么真正带来幸福”更清醒的认识。" },
        { en: "If nothing else, it forces companies to think harder about why a customer should care.", zh: "即便仅此一点，它也迫使企业更认真思考：客户为何应当在意。" }
      ]
    ],
    vocab: [
      { w: "accumulate", m: "v. 积累，积聚" },
      { w: "amplify", m: "v. 放大，增强" },
      { w: "repackage", m: "v. 重新包装" },
      { w: "fleeting", m: "adj. 短暂的，飞逝的" },
      { w: "overspending", m: "n. 过度消费" }
    ],
    questions: [
      { q: "What does the passage say young consumers increasingly prefer?", options: ["Collecting expensive electronic devices.", "Paying for experiences rather than objects.", "Saving money in the bank.", "Buying houses and cars."], answer: 1, explain: "首段明确说年轻人“更愿意为体验付费而非囤积物品”，B 正确。" },
      { q: "Why do experiences seem more attractive than products, according to the author?", options: ["They are always cheaper.", "Memories and stories last longer and are more shareable.", "They never become outdated.", "Social media forbids product photos."], answer: 1, explain: "第二段指出记忆比产品持久、故事更易分享，且社交媒体放大效应，对应 B。" },
      { q: "The phrase \"the line ... has grown thin\" implies that ______.", options: ["queues in shops are shorter", "the difference between buying a product and a feeling is shrinking", "prices have fallen sharply", "returns are no longer accepted"], answer: 1, explain: "line 此处指“界限”，grow thin 即“变模糊”，指买东西与买感受的差别在缩小。" },
      { q: "What concern do critics raise about the experience economy?", options: ["It may push people to overspend on short-lived pleasures.", "It reduces the quality of concerts.", "It makes travel impossible.", "It hurts social media companies."], answer: 0, explain: "第四段首句说批评者担忧该模式诱使人在短暂快乐上过度消费，A 正确。" },
      { q: "The author suggests the experience economy ultimately forces companies to ______.", options: ["lower all prices", "consider why customers should care", "stop selling memberships", "abandon social media"], answer: 1, explain: "末句指出它迫使企业更认真思考“客户为何应当在意”，对应 B。" }
    ]
  },

  {
    id: "rd_sleep",
    level: 2,
    title: "Why Sleep Matters More Than You Think",
    genre: "教育与心理",
    year: "2023.12",
    stars: 3,
    paras: [
      [
        { en: "Students often treat sleep as a luxury to cut when exams approach, yet the science says otherwise.", zh: "学生常把睡眠当作考试临近时可削减的奢侈，然而科学给出的结论相反。" },
        { en: "Memory is not fixed at the moment of study; it is strengthened later, largely while we sleep.", zh: "记忆并非在学习当下固定，而是在之后、主要在我们睡眠时被巩固。" },
        { en: "Skipping rest can undo hours of careful revision.", zh: "省略休息，可能让数小时认真复习付诸东流。" }
      ],
      [
        { en: "During deep sleep, the brain replays the day's material and moves it into long-term storage.", zh: "在深度睡眠中，大脑会重放当天的素材，并将其转入长期储存。" },
        { en: "This is why a fact learned today is far easier to recall after a full night's rest.", zh: "正因如此，今天学到的知识在整夜休息后更容易被回忆起来。" },
        { en: "Lack of sleep, by contrast, weakens both focus and the ability to form new connections.", zh: "相反，缺睡会同时削弱专注力与建立新联结的能力。" }
      ],
      [
        { en: "Practical steps help: a steady schedule, less screen light before bed, and shorter but regular study blocks.", zh: "一些实用做法有帮助：固定作息、睡前少看屏幕光、学习时段更短却更规律。" },
        { en: "Cramming at 3 a.m. may feel productive but rarely survives the test.", zh: "凌晨三点填鸭式恶补或许让人感觉高效，却很少能扛过考试。" },
        { en: "Rest, it turns out, is part of the work, not a break from it.", zh: "结果表明，休息是工作的一部分，而非脱离工作的中断。" }
      ],
      [
        { en: "Schools that start later in the morning report better mood and higher grades among teens.", zh: "早上推迟开学的学校，报告了青少年更好的情绪与更高的成绩。" },
        { en: "The lesson is simple yet ignored: protecting sleep is protecting learning.", zh: "教训简单却被忽视：保护睡眠就是保护学习。" },
        { en: "Treating rest as training rather than wasted time changes results.", zh: "把休息当作训练而非浪费时间，会改变结果。" }
      ]
    ],
    vocab: [
      { w: "revision", m: "n. 复习，修订" },
      { w: "storage", m: "n. 储存，存储" },
      { w: "cramming", m: "n. 填鸭式学习，突击备考" },
      { w: "recall", m: "v. 回忆，记起" },
      { w: "ignore", m: "v. 忽视，忽略" }
    ],
    questions: [
      { q: "According to the passage, memory is mainly strengthened ______.", options: ["at the moment of studying", "during deep sleep", "while eating", "through cramming at night"], answer: 1, explain: "首段与第二段都指明记忆主要在睡眠（尤其是深度睡眠）中被巩固，B 正确。" },
      { q: "What happens to material learned after a full night's sleep?", options: ["It is forgotten quickly.", "It becomes easier to recall.", "It stays only in short-term memory.", "It disappears during dreams."], answer: 1, explain: "第二段说“今天学到的知识在整夜休息后更容易被回忆”，对应 B。" },
      { q: "The word \"cramming\" in Paragraph 3 is closest in meaning to ______.", options: ["exercising regularly", "studying intensively at the last minute", "sleeping deeply", "teaching others"], answer: 1, explain: "cramming 指“考前突击/填鸭式学习”，与“最后一刻高强度学习”同义。" },
      { q: "Which practice does the author recommend for better learning?", options: ["Cutting sleep before exams.", "A steady schedule and less screen light at night.", "Studying only at 3 a.m.", "Long, irregular study blocks."], answer: 1, explain: "第三段给出建议：固定作息、睡前少看屏幕光、规律短时段学习，B 符合。" },
      { q: "The author's main message is that ______.", options: ["sleep is wasted time", "protecting sleep protects learning", "exams require no rest", "teens do not need much sleep"], answer: 1, explain: "倒数第二段点明主旨：“保护睡眠就是保护学习”，B 正确。" }
    ]
  },

  {
    id: "rd_success",
    level: 5,
    title: "Redefining Success for the Post-2000s Generation",
    genre: "文化与社会",
    year: "2025.12",
    stars: 5,
    paras: [
      [
        { en: "For the generation born after 2000, the word success no longer points to a single, fixed destination.", zh: "对 2000 年后出生的一代而言，“成功”一词不再指向单一、固定的终点。" },
        { en: "Where earlier cohorts measured achievement by title and salary, many young people weigh balance, meaning, and autonomy.", zh: "早先的同龄群体以头衔和薪水衡量成就，而许多年轻人更看重平衡、意义与自主权。" },
        { en: "The shift unsettles employers who still equate ambition with long hours.", zh: "这种转变让仍把野心等同于长时间加班的雇主感到不安。" }
      ],
      [
        { en: "Part of the change is economic: rising costs have made traditional milestones harder to reach on time.", zh: "转变部分源于经济：上涨的成本让传统人生里程碑更难按时达成。" },
        { en: "Housing, childcare, and education now absorb income that previous generations could save or invest.", zh: "住房、育儿与教育如今吞噬着上一代人本可储蓄或投资的收入。" },
        { en: "Faced with this, some have lowered expectations of material gain and raised those of daily well-being.", zh: "面对此景，一些人降低了对物质收益的预期，转而提高对日常幸福感的要求。" }
      ],
      [
        { en: "Another driver is values: a stronger preference for work that feels useful and aligned with personal belief.", zh: "另一驱动力是价值观：更偏好“有用且与个人信念一致”的工作。" },
        { en: "Surveys show pay matters, but purpose and respect rank nearly as high for this cohort.", zh: "调查显示薪水固然重要，但对这一群体而言，意义与尊重的排序几乎同样靠前。" },
        { en: "A job that pays well yet feels empty loses talent to one that pays less but means more.", zh: "一份高薪却空洞的工作，会把人才输给薪水更低却更有意义的工作。" }
      ],
      [
        { en: "Critics call the trend a withdrawal from responsibility, but the evidence is more nuanced.", zh: "批评者称这一趋势是对责任的逃避，但证据要更微妙复杂。" },
        { en: "Many young workers simply refuse to sacrifice health and family for a promotion that may never come.", zh: "许多年轻劳动者只是拒绝为未必到来的晋升，牺牲健康与家庭。" },
        { en: "If firms adapt, they may find a steadier, more committed workforce than the one they mourn.", zh: "若企业适应，或许能找到比他们所怀念的更稳、更投入的劳动力队伍。" }
      ]
    ],
    vocab: [
      { w: "cohort", m: "n. 同批群体，一代人" },
      { w: "autonomy", m: "n. 自主权，自治" },
      { w: "equate", m: "v. 等同于，认为…相等" },
      { w: "milestone", m: "n. 里程碑，重大阶段" },
      { w: "nuanced", m: "adj. 微妙复杂的，细腻的" }
    ],
    questions: [
      { q: "How does the post-2000 generation's view of success differ from earlier ones?", options: ["They care only about salary.", "They add balance, meaning, and autonomy to the measure of achievement.", "They reject all forms of work.", "They value titles above everything."], answer: 1, explain: "首段对比指出年轻人把平衡、意义、自主权也纳入成就衡量，B 正确。" },
      { q: "The passage suggests rising costs have led many young people to ______.", options: ["expect higher material gains", "lower material expectations and raise those of well-being", "abandon work entirely", "move back in with parents forever"], answer: 1, explain: "第二段末句说他们“降低物质预期、提高对日常幸福感的要求”，对应 B。" },
      { q: "The word \"cohort\" in Paragraph 3 most nearly means ______.", options: ["a random group of strangers", "a group of people born around the same time", "a type of investment", "a style of management"], answer: 1, explain: "前文提到“born after 2000 / earlier cohorts”，cohort 指“同批出生的人、一代人”，B 正确。" },
      { q: "What can be inferred about purpose and respect for this generation?", options: ["They are ignored in favor of pay alone.", "They rank almost as high as salary in importance.", "They matter less than overtime.", "They are required by law."], answer: 1, explain: "第三段说“意义与尊重排序几乎同样靠前”，可推知它们重要性几乎比肩薪水。" },
      { q: "The author's attitude toward the critics' \"withdrawal from responsibility\" claim is ______.", options: ["fully agreeing", "rejecting it as overly simple", "indifferent", "uncertain"], answer: 1, explain: "第四段首句说“证据更微妙复杂”，即认为批评者的说法过于简单并予以否定，B 正确。" }
    ],
  },

  {
    id: "rd_digital",
    level: 4,
    title: "The Cost of Constant Distraction",
    genre: "科技与社会",
    year: "2025.06",
    stars: 4,
    paras: [
      [
        { en: "The average person now checks a phone more than a hundred times a day, often without a clear reason.", zh: "如今普通人每天查看手机超过一百次，且往往没有明确理由。" },
        { en: "Each buzz pulls attention away from whatever task is at hand, and the cost is easy to miss.", zh: "每一次震动都把注意力从手头任务上拽走，而代价很容易被人忽略。" },
        { en: "Researchers call this state continuous partial attention, and they warn it harms deep thinking.", zh: "研究者称这种状态为持续性的部分注意，并警告它会损害深度思考。" }
      ],
      [
        { en: "Experiments show that even the presence of a silent phone on the desk lowers performance on memory tests.", zh: "实验表明，即便桌上只放一部静音手机，也会拉低记忆测试的表现。" },
        { en: "The brain seems to spend effort not looking at the device, leaving less for the work itself.", zh: "大脑似乎要耗费精力忍住不去看设备，留给任务本身的资源就变少了。" },
        { en: "Over weeks, people report feeling restless when they try to focus without a screen nearby.", zh: "几周下来，人们反映当试图在身边没有屏幕时专注，会感到焦躁不安。" }
      ],
      [
        { en: "The problem is not the tool but the habit of letting it interrupt at every moment.", zh: "问题不在工具本身，而在任由它每时每刻打断我们的习惯。" },
        { en: "Setting short, phone-free blocks has helped students read longer texts and recall more of them.", zh: "设定短暂的无手机时段，已帮助学生读更长的文章并记住更多内容。" },
        { en: "Some schools now ask for device-free hours during which only paper and pens are allowed.", zh: "一些学校现在要求无设备时段，期间只允许使用纸和笔。" }
      ],
      [
        { en: "Attention, like a muscle, grows stronger with use and weaker with constant distraction.", zh: "注意力像肌肉，越用越强，在持续分心中则越来越弱。" },
        { en: "Small rules, such as charging the phone in another room at night, can rebuild the habit.", zh: "一些微小的规矩，比如夜里在另一个房间充电，就能重建这个习惯。" },
        { en: "In the end, controlling the device matters more than owning the latest one.", zh: "归根结底，掌控设备比拥有最新款更重要。" }
      ]
    ],
    vocab: [
      { w: "continuous", m: "adj. 持续的" },
      { w: "partial", m: "adj. 部分的，不完整的" },
      { w: "restless", m: "adj. 不安的，焦躁的" },
      { w: "interrupt", m: "v. 打断，打扰" },
      { w: "device", m: "n. 设备，装置" }
    ],
    questions: [
      { q: "What is the passage mainly about?", options: ["How to buy the cheapest smartphone.", "The harm of constant phone distraction to deep thinking and how to fix it.", "Why memory tests are unfair to students.", "The history of mobile phones."], answer: 1, explain: "全文讲手机持续分心损害深度思考，并给出无手机时段等修复办法，B 最概括。" },
      { q: "What do experiments in Paragraph 2 show?", options: ["Silent phones on the desk reduce memory-test performance.", "Phones improve focus automatically.", "Students prefer screens to paper.", "Memory tests are too easy."], answer: 0, explain: "第二段实验指出桌上静音手机也会降低记忆测试表现，对应 A。" },
      { q: "The phrase \"continuous partial attention\" in Paragraph 1 refers to ______.", options: ["full focus on one task", "being half-attentive across many interruptions", "sleeping with the phone", "turning the device off"], answer: 1, explain: "该短语指在多番打断中只保持半吊子注意，与 B 同义。" },
      { q: "What can be inferred about phone-free blocks?", options: ["They waste students' time.", "They help people read and remember more.", "They are required by law.", "They make phones break."], answer: 1, explain: "第三段说无手机时段帮助学生读得更多、记得更牢，可推知 B。" },
      { q: "The author's tone toward small self-rules is ______.", options: ["supportive", "mocking", "fearful", "indifferent"], answer: 0, explain: "末段肯定微小规矩能重建习惯，态度是支持的。" }
    ]
  },

  {
    id: "rd_remote",
    level: 3,
    title: "The Rise and Limits of Remote Work",
    genre: "职场与人际",
    year: "2024.12",
    stars: 4,
    paras: [
      [
        { en: "After the pandemic, working from home shifted from a rare perk to a normal expectation for many office jobs.", zh: "疫情之后，居家办公从罕见的福利变成了许多办公室岗位的正常预期。" },
        { en: "Companies discovered that a large share of tasks could be done without a daily commute.", zh: "企业发现相当大比例的工作无需每天通勤也能完成。" },
        { en: "Yet the change brought gains and losses that managers are still learning to balance.", zh: "然而这一变化带来的得失，管理者至今仍在学着权衡。" }
      ],
      [
        { en: "On the plus side, employees save time and money, and many report higher focus at home.", zh: "从好的一面看，员工省下时间与金钱，许多人反映在家更专注。" },
        { en: "Fewer meetings and quieter spaces let some finish in less time what took all day in the office.", zh: "更少的会议与更安静的环境，让一些人用更短的时间完成了在办公室耗一整天的事。" },
        { en: "For parents and caregivers, flexibility can be the difference between keeping a job and quitting.", zh: "对父母与照护者而言，弹性往往是保住工作与辞职之间的分水岭。" }
      ],
      [
        { en: "The downsides are real: weak training, slow promotion, and a sense of isolation for newcomers.", zh: "弊端也实实在在：培训薄弱、晋升缓慢，以及新人的孤立感。" },
        { en: "Young staff miss the casual advice that flows from sharing a room with experienced colleagues.", zh: "年轻员工错失了与资深同事共处一室时自然流出的那些随口指点。" },
        { en: "Some firms now require a few office days a week to keep mentorship and team spirit alive.", zh: "一些公司现在要求每周到办公室几天，以维持导师指导与团队士气。" }
      ],
      [
        { en: "The likely future is hybrid, mixing remote and on-site work rather than choosing one.", zh: "可能的未来是混合制，把远程与现场办公结合，而非二选一。" },
        { en: "Success depends less on the policy than on clear goals and trust between managers and staff.", zh: "成败更多取决于清晰的目标与上下级间的信任，而非政策本身。" },
        { en: "Used well, distance becomes a tool, not a barrier, for getting the work done.", zh: "用得好，距离就成了完成工作的工具，而非障碍。" }
      ]
    ],
    vocab: [
      { w: "perk", m: "n. 额外福利" },
      { w: "commute", m: "n. 通勤" },
      { w: "isolation", m: "n. 孤立，隔离" },
      { w: "mentorship", m: "n. 导师指导" },
      { w: "hybrid", m: "adj. 混合的" }
    ],
    questions: [
      { q: "What is the passage mainly discussing?", options: ["Why offices should close forever.", "The rise of remote work and its mixed effects on managers and staff.", "How to buy a better computer.", "Why commuting is fun."], answer: 1, explain: "全文讲远程办公的兴起及其对管理者与员工的利弊，B 最概括。" },
      { q: "According to Paragraph 2, a benefit of working from home is ______.", options: ["longer commutes", "saved time and money and higher focus", "more daily meetings", "guaranteed promotion"], answer: 1, explain: "第二段列明省时省钱、更专注等好处，对应 B。" },
      { q: "Why do some firms ask staff to come in a few days?", options: ["To cut salaries.", "To preserve mentorship and team spirit.", "To end remote work completely.", "To monitor phones."], answer: 1, explain: "第三段末句说要求到岗几天是为保住导师指导与团队士气，对应 B。" },
      { q: "The word \"hybrid\" in Paragraph 4 most nearly means ______.", options: ["fully remote", "mixing remote and on-site", "old-fashioned", "illegal"], answer: 1, explain: "hybrid 指混合远程与现场，B 正确。" },
      { q: "The author's view of distance work used well is ______.", options: ["it becomes a helpful tool", "it is always harmful", "it should be banned", "it replaces managers"], answer: 0, explain: "末句明确说用得好距离就成了工具，对应 A。" }
    ]
  },

  {
    id: "rd_fastfood",
    level: 2,
    title: "Fast Food and Public Health",
    genre: "健康与生活",
    year: "2023.12",
    stars: 3,
    paras: [
      [
        { en: "Fast food is cheap, tasty, and everywhere, which is exactly why it is hard to resist.", zh: "快餐便宜、好吃又随处可见，这恰恰正是它难以抗拒的原因。" },
        { en: "Eaten once in a while, it does little harm, but daily habits tell a different story.", zh: "偶尔吃一次危害不大，但日复一日的习惯就完全是另一回事。" },
        { en: "Health agencies now link frequent fast-food meals to rising rates of obesity and diabetes.", zh: "卫生机构如今把频繁的快餐饮食与肥胖、糖尿病发病率上升联系起来。" }
      ],
      [
        { en: "The reason is simple: such meals are rich in fat, sugar, and salt but poor in fiber and vitamins.", zh: "原因很简单：这类餐食富含脂肪、糖与盐，却缺乏纤维与维生素。" },
        { en: "A single combo can exceed the calorie need of an adult for most of a day.", zh: "一份套餐的热量就可能超过一个成年人大半天所需。" },
        { en: "Over months, the extra energy stores as body fat and strains the body's systems.", zh: "数月下来，多余的能量以体脂形式储存，并让身体各系统不堪重负。" }
      ],
      [
        { en: "The good news is that small swaps make a large difference without giving up convenience.", zh: "好消息是，小小的替换就能带来大不同，又不必放弃便利。" },
        { en: "Choosing water over soda, a side salad over fries, and grilled over fried cuts the risk.", zh: "用白水代替汽水、用沙拉代替薯条、用烧烤代替油炸，都能降低风险。" },
        { en: "Cooking a few simple meals each week also resets taste and lowers the bill.", zh: "每周自己动手做几顿简单的饭，还能重置口味并省下开销。" }
      ],
      [
        { en: "Public health campaigns urge clear labeling so buyers know what they eat.", zh: "公共健康宣传呼吁清晰标识，让购买者知道自己在吃什么。" },
        { en: "Some cities tax sugary drinks, while schools ban junk food near campuses.", zh: "一些城市对含糖饮料征税，学校则在校园周边禁售垃圾食品。" },
        { en: "In the end, knowledge plus choice, not strict rules alone, shifts the trend.", zh: "归根结底，是认知加选择，而非单靠硬性规定，才能扭转趋势。" }
      ]
    ],
    vocab: [
      { w: "obesity", m: "n. 肥胖" },
      { w: "diabetes", m: "n. 糖尿病" },
      { w: "fiber", m: "n. 膳食纤维" },
      { w: "combo", m: "n. 套餐，组合" },
      { w: "strain", m: "v. 使超负荷，拉紧" }
    ],
    questions: [
      { q: "The passage mainly argues that ______.", options: ["fast food should be banned by law", "frequent fast food harms health but small changes help", "cooking is too expensive", "soda is good for children"], answer: 1, explain: "全文先讲常吃快餐伤身，再讲小改变有用，B 最概括。" },
      { q: "Why is regular fast food unhealthy?", options: ["It has too much fiber.", "It is high in fat, sugar, salt but low in fiber and vitamins.", "It is too cheap.", "It tastes bad."], answer: 1, explain: "第二段点明快餐高脂高糖高盐、缺纤维与维生素，B 正确。" },
      { q: "What can be inferred about simple swaps?", options: ["They are useless.", "They can cut health risk while keeping convenience.", "They cost more than hospitals.", "They require quitting work."], answer: 1, explain: "第三段说小替换在不失便利下降低风险，可推知 B。" },
      { q: "The word \"strains\" in Paragraph 2 is closest to ______.", options: ["relaxes", "puts pressure on", "improves", "measures"], answer: 1, explain: "strains 此处指“使系统超负荷/施压”，与 B 同义。" },
      { q: "The author supports ______.", options: ["clear labeling and informed choice", "a total ban on all food", "removing all drinks", "ignoring the problem"], answer: 0, explain: "末段主张认知加选择，并提到清晰标识，对应 A。" }
    ]
  },

  {
    id: "rd_shortvideo",
    level: 4,
    title: "Short Videos and the Habit of Reading",
    genre: "科技与社会",
    year: "2025.06",
    stars: 5,
    paras: [
      [
        { en: "Short video platforms have become the default pastime for millions, offering endless clips in seconds.", zh: "短视频平台已成为数百万人的日常消遣，几秒内便提供无穷尽的片段。" },
        { en: "The format rewards speed and surprise, training the eye to expect a new stimulus every few seconds.", zh: "这种形式奖赏速度与惊喜，训练眼睛习惯每隔几秒就期待一个新刺激。" },
        { en: "Educators worry this rhythm weakens the patience needed for long-form reading.", zh: "教育者们担忧，这种节奏会削弱长文阅读所需的耐心。" }
      ],
      [
        { en: "A study found that heavy short-video users struggled more to finish a full book chapter.", zh: "一项研究发现，重度短视频用户更难读完完整的一本书章节。" },
        { en: "Their minds, used to rapid cuts, drifted when the text moved slowly and without sound.", zh: "他们的思维习惯了快速切换，当文字缓慢而无声地推进时便开始走神。" },
        { en: "Comprehension dropped not because the words were hard, but because attention wandered.", zh: "理解力下降并非因为字词难，而是因为注意力飘走了。" }
      ],
      [
        { en: "The effect is not destiny; reading is a skill that returns with practice.", zh: "这种影响并非命中注定；阅读是一项随练习而回归的技能。" },
        { en: "Starting with short articles, then longer essays, rebuilds the habit step by step.", zh: "从短文开始，再到长文，便能一步步重建这个习惯。" },
        { en: "Libraries report rising use of audio and print when phones are set aside for an hour.", zh: "当手机被搁下一小时，图书馆报告有声书与纸质书的借阅都在上升。" }
      ],
      [
        { en: "The goal is balance, not rejection: use clips for fun, but protect time for deep reading.", zh: "目标是平衡而非排斥：用短视频取乐，但也要保护深度阅读的时间。" },
        { en: "Schools that teach media literacy help students choose when to scroll and when to study.", zh: "开设媒介素养课的学校，帮学生分清何时刷、何时学。" },
        { en: "In the end, controlling the feed is a form of freedom, not a loss of it.", zh: "归根结底，掌控信息流是一种自由，而非自由的丧失。" }
      ]
    ],
    vocab: [
      { w: "pastime", m: "n. 消遣，娱乐" },
      { w: "clip", m: "n. 短视频片段" },
      { w: "rhythm", m: "n. 节奏" },
      { w: "comprehension", m: "n. 理解（力）" },
      { w: "literacy", m: "n. 素养" }
    ],
    questions: [
      { q: "The passage mainly discusses ______.", options: ["why short videos are banned in schools", "how short videos may hurt reading patience and how to rebuild it", "how to make better videos", "why books are outdated"], answer: 1, explain: "全文讲短视频可能削弱阅读耐心及如何重建，B 最概括。" },
      { q: "The study in Paragraph 2 found heavy users ______.", options: ["read faster than others", "struggled more to finish a full book chapter", "remembered more words", "preferred print only"], answer: 1, explain: "第二段研究指出重度用户更难读完章节，对应 B。" },
      { q: "Why did comprehension drop?", options: ["The words were too difficult.", "Attention wandered due to habit of rapid cuts.", "The books were in another language.", "The students were sleeping."], answer: 1, explain: "第二段末句说理解下降是因为注意力飘走，对应 B。" },
      { q: "The word \"literacy\" in Paragraph 4 means ______.", options: ["the ability to read and judge media", "a type of video", "a school building", "a phone app"], answer: 0, explain: "media literacy 指媒介素养，即读写与判别媒体的能力，A 正确。" },
      { q: "The author's final view is that ______.", options: ["we should reject all short videos", "balance and controlling the feed is a form of freedom", "reading is useless", "schools should ban phones entirely"], answer: 1, explain: "末段主张平衡、掌控信息流即自由，对应 B。" }
    ]
  },

  {
    id: "rd_lifelong",
    level: 3,
    title: "Lifelong Learning as a New Norm",
    genre: "教育与心理",
    year: "2024.06",
    stars: 4,
    paras: [
      [
        { en: "The idea that education ends with a degree no longer fits the world we live in.", zh: "“教育随学位而终结”的观念，已不再契合我们所处的世界。" },
        { en: "New tools and new jobs appear faster than any single course can cover.", zh: "新工具与新岗位出现的速度，快过任何一门课程所能覆盖。" },
        { en: "More adults now return to study not for a title but to stay useful and confident.", zh: "如今更多成年人重返学习，不为头衔，只为保持有用与自信。" }
      ],
      [
        { en: "Online platforms have lowered the cost and the distance of learning to almost nothing.", zh: "在线平台把学习的成本与距离几乎降到了零。" },
        { en: "A worker can learn a new skill at night, then apply it the next morning at the office.", zh: "一名劳动者晚上学项新技能，第二天一早就能在办公室用上。" },
        { en: "This just-in-time learning suits a labor market that changes by the quarter.", zh: "这种即时学习，恰好适配一个按季度变化的劳动力市场。" }
      ],
      [
        { en: "Yet self-study demands discipline that classrooms once provided for free.", zh: "然而自学所需的自律，曾是课堂免费提供的。" },
        { en: "Without a plan, many start courses and quit when the novelty fades.", zh: "没有计划，许多人开课兴致勃勃，新鲜感一过便放弃。" },
        { en: "Communities of learners, even online, keep people going when motivation dips.", zh: "学习社群——即便在线上——能在动力下滑时让人坚持下去。" }
      ],
      [
        { en: "Employers who fund study hours signal that growth is part of the job, not a hobby.", zh: "为学习时长买单的雇主，释放出一个信号：成长是工作的一部分，而非爱好。" },
        { en: "Workers who keep learning tend to adapt better when their role is reshaped.", zh: "持续学习的人在岗位被重塑时，往往适应得更好。" },
        { en: "In the long run, the habit of learning may matter more than any one certificate.", zh: "长远看，学习的习惯或许比任何一张证书都更重要。" }
      ]
    ],
    vocab: [
      { w: "degree", m: "n. 学位" },
      { w: "discipline", m: "n. 自律，纪律" },
      { w: "novelty", m: "n. 新鲜感" },
      { w: "motivation", m: "n. 动力，积极性" },
      { w: "certificate", m: "n. 证书" }
    ],
    questions: [
      { q: "The passage suggests that ______.", options: ["a degree is enough for life", "lifelong learning is now necessary because jobs change fast", "adults should never study", "online learning is illegal"], answer: 1, explain: "首段与第二段指出岗位快速变化，终身学习因而必要，B 正确。" },
      { q: "What advantage do online platforms give?", options: ["They raise the cost of learning.", "They lower cost and distance, enabling just-in-time learning.", "They replace all jobs.", "They ban self-study."], answer: 1, explain: "第二段说平台降低成本与距离，实现即时学习，对应 B。" },
      { q: "Why do many quit self-study?", options: ["It is too easy.", "They lack discipline once the novelty fades.", "Employers forbid it.", "The courses are free."], answer: 1, explain: "第三段说新鲜感一过便放弃，源于缺乏自律，对应 B。" },
      { q: "The word \"discipline\" in Paragraph 3 means ______.", options: ["a school subject", "self-control and consistent effort", "a punishment", "a certificate"], answer: 1, explain: "此处 discipline 指自律与持续努力，B 正确。" },
      { q: "The author believes the habit of learning ______.", options: ["matters more than any single certificate", "is a waste of time", "should be banned", "replaces all jobs"], answer: 0, explain: "末句明确说习惯比任何证书都重要，对应 A。" }
    ]
  },

  {
    id: "rd_urban",
    level: 5,
    title: "The Lonely Crowd in the City",
    genre: "文化与社会",
    year: "2025.12",
    stars: 5,
    paras: [
      [
        { en: "Cities promise connection, yet studies keep finding that urban life can leave people feeling strangely alone.", zh: "城市许诺联结，可研究不断发现都市生活却让人莫名地孤独。" },
        { en: "Dense streets and busy trains surround us, but few of those faces are known or named.", zh: "稠密街道与拥挤车厢把我们包围，可那些面孔少有人认识或叫得出名字。" },
        { en: "The paradox puzzles planners who assumed proximity would breed friendship.", zh: "这一悖论让规划者困惑，他们本以为邻近会催生友谊。" }
      ],
      [
        { en: "Part of the cause is mobility: residents move for jobs so often that roots never settle.", zh: "部分原因在流动性：居民为工作频繁搬迁，根从未扎下。" },
        { en: "Neighbors change every year, and the casual trust of a small town is hard to rebuild.", zh: "邻居年年更换，小镇里那种随口的信任难以重建。" },
        { en: "Digital contact helps, but a screen rarely replaces the ease of a shared physical space.", zh: "数字联系有帮助，可屏幕极少能替代共处一室的自在。" }
      ],
      [
        { en: "Some cities fight back with design: more benches, shared gardens, and events that pull strangers together.", zh: "一些城市用设计反击：更多长椅、共享花园，以及把陌生人聚拢的活动。" },
        { en: "Third places, neither home nor office, give loose ties a chance to form and deepen.", zh: "第三空间——既非家也非办公室——让松散的关系有机会建立并加深。" },
        { en: "Where such spaces thrive, surveys show higher trust and lower reported loneliness.", zh: "在这类空间兴盛的地方，调查显示信任更高、自报的孤独更少。" }
      ],
      [
        { en: "The lesson is not to flee the city but to build it for meeting, not only for moving through.", zh: "教训不是逃离城市，而是为相遇而非仅仅穿过而建造它。" },
        { en: "Belonging, it turns out, is engineered as much as it is felt.", zh: "结果表明，归属感既被感知，也被设计出来。" },
        { en: "A metropolis can be warm if its corners invite people to pause and stay.", zh: "若城市的角落邀人停留，大都市也可以温暖。" }
      ]
    ],
    vocab: [
      { w: "paradox", m: "n. 悖论，矛盾" },
      { w: "proximity", m: "n. 接近，邻近" },
      { w: "mobility", m: "n. 流动性" },
      { w: "metropolis", m: "n. 大都市" },
      { w: "belonging", m: "n. 归属感" }
    ],
    questions: [
      { q: "The passage mainly explores ______.", options: ["why cities are always happy", "urban loneliness and how design can rebuild belonging", "how to move to a village", "why trains are crowded"], answer: 1, explain: "全文探讨都市孤独及如何用设计重建归属感，B 最概括。" },
      { q: "What paradox is mentioned?", options: ["Cities are empty but people feel crowded.", "Cities promise connection yet many feel alone despite density.", "Everyone knows each other.", "Loneliness is illegal."], answer: 1, explain: "首段悖论：城市许诺联结，人多却仍孤独，对应 B。" },
      { q: "Why is digital contact insufficient?", options: ["It is too cheap.", "A screen rarely replaces shared physical space.", "It bans friendship.", "It costs too much."], answer: 1, explain: "第二段末句说屏幕难替共处空间，对应 B。" },
      { q: "The word \"proximity\" in Paragraph 1 is closest to ______.", options: ["distance", "nearness", "speed", "noise"], answer: 1, explain: "proximity 指邻近、接近，B 正确。" },
      { q: "The author's view of cities is ______.", options: ["they can be warm if designed for meeting", "they should all be abandoned", "they are hopeless", "they ban friendship"], answer: 0, explain: "末段说若为人相遇而设计，都市可温暖，对应 A。" }
    ]
  },

  {
    id: "rd_ai_art",
    level: 5,
    title: "When Machines Make Art",
    genre: "科技与社会",
    year: "2024.12",
    stars: 5,
    paras: [
      [
        { en: "When machines began producing poems, pictures, and music, an old question returned: what counts as creation?", zh: "当机器开始创作诗歌、图画与音乐，一个老问题回来了：什么才算创作？" },
        { en: "Critics argue that AI only recombines what humans already made, with no intent or feeling.", zh: "批评者认为，人工智能只是重组人类已有的成果，并无意图或情感。" },
        { en: "Supporters reply that the tool extends the maker, much as the camera once extended the eye.", zh: "支持者则回应，这工具延伸了创作者，正如相机曾延伸了眼睛。" }
      ],
      [
        { en: "The legal fight centers on training data taken from artists without clear consent or pay.", zh: "法律之争聚焦于从艺术家处取走、却未获明确同意或报酬的训练数据。" },
        { en: "Courts in several regions are weighing whether such use is fair or a quiet theft of labor.", zh: "多个地区的法院正在权衡：这种使用是合理，还是对劳动的悄然窃取。" },
        { en: "Meanwhile, some platforms now label AI output so buyers know what they get.", zh: "与此同时，一些平台开始标注人工智能产出，让买家心里有数。" }
      ],
      [
        { en: "For working creators, the pressure is real: cheap auto-made art floods the market overnight.", zh: "对从业创作者而言，压力是真实的：廉价的自动生成作品一夜之间涌入市场。" },
        { en: "Yet others use the tools to sketch faster, then add the judgment only a person can give.", zh: "然而也有人用这些工具更快打草稿，再加回只有人才能给的判断。" },
        { en: "The scarce skill shifts from making the first draft to choosing and refining the right one.", zh: "稀缺的技能，从写出初稿转向挑选并完善对的那个。" }
      ],
      [
        { en: "History suggests each new medium first frightens, then folds into practice.", zh: "历史表明，每种新媒介都先令人畏惧，随后融入实践。" },
        { en: "The print press, the camera, and now the model all redrew the line of who may create.", zh: "印刷机、照相机，以及如今的模型，都重画了谁能创作的界限。" },
        { en: "What stays human is the taste, the intent, and the meaning we attach to the work.", zh: "留为人之所有的，是我们赋予作品的那份品味、意图与意义。" }
      ]
    ],
    vocab: [
      { w: "recombine", m: "v. 重新组合" },
      { w: "consent", m: "n. 同意，许可" },
      { w: "theft", m: "n. 窃取" },
      { w: "refine", m: "v. 精炼，完善" },
      { w: "medium", m: "n. 媒介，手段" }
    ],
    questions: [
      { q: "The passage is mainly about ______.", options: ["why AI should be banned from art", "the debate over AI creativity, rights, and the human role", "how to paint like a machine", "why cameras are illegal"], answer: 1, explain: "全文围绕人工智能创作的争议、权利与人 role 展开，B 最概括。" },
      { q: "What is the legal fight about?", options: ["The color of pictures.", "Training data used from artists without consent or pay.", "The speed of printers.", "The price of music."], answer: 1, explain: "第二段点明争议在未经同意或报酬取用训练数据，对应 B。" },
      { q: "How do some creators benefit?", options: ["They stop working.", "They use tools to sketch faster then add human judgment.", "They ban all AI.", "They quit art."], answer: 1, explain: "第三段说有人借工具提速再加人的判断，对应 B。" },
      { q: "The word \"theft\" in Paragraph 2 means ______.", options: ["a gift", "stealing of labor", "a type of tool", "a law"], answer: 1, explain: "theft 指窃取，此处指对劳动的窃取，B 正确。" },
      { q: "The author's final claim is that ______.", options: ["machines fully replace human artists", "the human part—taste, intent, meaning—remains", "art is dead", "only lawyers create"], answer: 1, explain: "末句强调人的品味、意图、意义仍在，对应 B。" }
    ]
  },

  {
    id: "rd_consumer",
    level: 3,
    title: "Stuff, Experience, and Happiness",
    genre: "经济与消费",
    year: "2024.06",
    stars: 4,
    paras: [
      [
        { en: "Advertising teaches a simple loop: see a want, buy a thing, feel better, then want again.", zh: "广告教给人们一个简单循环：看到想要、买下东西、感觉变好，然后再次想要。" },
        { en: "The lift is real but brief, and soon the new item joins the pile of forgotten purchases.", zh: "那点提振真实却短暂，很快新物件就加入了被遗忘的购买堆。" },
        { en: "Economists note that beyond a basic level, more stuff correlates weakly with more joy.", zh: "经济学家指出，越过基本线之后，更多的东西与更多的快乐关联甚微。" }
      ],
      [
        { en: "By contrast, time spent with friends, in nature, or on a skill tends to pay longer dividends.", zh: "相比之下，与朋友相处、亲近自然或钻研一门技艺，往往带来更长久的回报。" },
        { en: "These experiences build memory and identity, which objects rarely do.", zh: "这些体验构建记忆与身份认同，而物品几乎做不到。" },
        { en: "A walk, a talk, a lesson—none sits on a shelf, yet all outlast the latest gadget.", zh: "一次散步、一场交谈、一节课——都不摆在架子上，却都比最新小玩意更持久。" }
      ],
      [
        { en: "The trap is that buying is easy while slowing down is hard in a busy life.", zh: "陷阱在于：购买很容易，而在忙碌生活里慢下来很难。" },
        { en: "Sales and feeds are engineered to nudge us at the weakest moment.", zh: "促销与信息流被精心设计，在我们最薄弱的时刻推我们一把。" },
        { en: "Awareness is the first defense: ask whether the want is need or noise.", zh: "觉察是第一步防线：问问这欲望是需求还是噪音。" }
      ],
      [
        { en: "None of this means never shopping; it means shopping with aim, not by reflex.", zh: "这并非说永不再购物，而是说带着目的买，而非出于反射。" },
        { en: "People who budget for experiences often report steadier mood than those who chase deals.", zh: "为体验做预算的人，情绪往往比追逐折扣的人更稳定。" },
        { en: "Happiness, it seems, is less a product than a practice.", zh: "幸福似乎与其说是商品，不如说是种实践。" }
      ]
    ],
    vocab: [
      { w: "correlate", m: "v. （与…）相关" },
      { w: "dividend", m: "n. 回报，收益" },
      { w: "gadget", m: "n. 小器具" },
      { w: "nudge", m: "v. 轻推，促使" },
      { w: "reflex", m: "n. 反射，本能反应" }
    ],
    questions: [
      { q: "The passage argues that ______.", options: ["shopping always brings joy", "beyond basics, more goods barely raise happiness; experiences pay more", "never buy anything", "ads are illegal"], answer: 1, explain: "首段与第二段对比指出物品难增幸福、体验回报更久，B 最概括。" },
      { q: "What do economists note?", options: ["More stuff strongly raises joy.", "Beyond a basic level, more goods weakly correlate with happiness.", "Objects build identity.", "Gadgets never fade."], answer: 1, explain: "首段末句说越过基本线后物质与快乐弱相关，对应 B。" },
      { q: "Why is slowing down hard?", options: ["It is free.", "Buying is easy while busy life makes pausing hard; feeds nudge us.", "Walking is banned.", "Friends cost money."], answer: 1, explain: "第三段说购买易、慢下来难，且信息流在弱点推人，对应 B。" },
      { q: "The word \"dividends\" in Paragraph 2 means ______.", options: ["payments of joy/return", "a type of shop", "a law", "a gadget"], answer: 0, explain: "dividends 此处指回报、收益，A 正确。" },
      { q: "The author suggests happiness is ______.", options: ["a product to buy", "more a practice than a product", "impossible", "only for the rich"], answer: 1, explain: "末句说幸福更是实践而非商品，对应 B。" }
    ]
  },

  {
    id: "rd_climate",
    level: 4,
    title: "Youth on the Front Line of Climate",
    genre: "环境与自然",
    year: "2025.06",
    stars: 5,
    paras: [
      [
        { en: "Young people have moved from worried observers to active players in the fight against climate change.", zh: "年轻人已从忧心忡忡的旁观者，变成对抗气候变化的主动参与者。" },
        { en: "Strikes, campus pledges, and local clean-ups show a generation unwilling to wait for others.", zh: "罢课、校园承诺与社区清扫，展现了一代人不愿坐等他人出手。" },
        { en: "Their message is plain: the future being decided now is, in fact, their own.", zh: "他们的信息很直白：此刻被决定的未来，其实就是他们自己的。" }
      ],
      [
        { en: "Surveys find that concern runs high even where action feels out of personal reach.", zh: "调查发现，即便在个人觉得无力行动的地方，担忧程度也很高。" },
        { en: "Many feel torn between daily choices and a problem that seems too large for one person.", zh: "许多人在日常选择与一个似乎个人无法撼动的问题之间感到撕裂。" },
        { en: "Educators respond by teaching not just the science but the steps that scale.", zh: "教育者的回应是不仅讲授科学，也讲授那些能推广落地的步骤。" }
      ],
      [
        { en: "Small acts—less meat, less waste, more repair—add up when millions repeat them.", zh: "少吃肉、少浪费、多修理这类小行动，当数百万人重复时就会累积成势。" },
        { en: "Yet youth leaders insist that system change, not just lifestyle, is the real target.", zh: "但青年领袖坚持，真正的目标是系统变革，而非仅仅是生活方式。" },
        { en: "They push firms and governments to price carbon and fund clean energy at speed.", zh: "他们推动企业与政府为碳定价，并迅速资助清洁能源。" }
      ],
      [
        { en: "Critics say the young exaggerate, but polls show voters of all ages now share the worry.", zh: "批评者说年轻人言过其实，但民调显示各年龄层选民如今都抱有同样担忧。" },
        { en: "The shift in mood may prove more lasting than any single policy.", zh: "这种情绪上的转变，或许比任何单项政策都更持久。" },
        { en: "Whether through a ballot or a bus ride, this generation is rewriting what responsibility means.", zh: "无论通过选票还是一次公交出行，这一代正在重写责任的含义。" }
      ]
    ],
    vocab: [
      { w: "pledge", m: "n. 承诺，誓言" },
      { w: "scale", m: "v. 扩大规模" },
      { w: "carbon", m: "n. 碳" },
      { w: "ballot", m: "n. 选票" },
      { w: "exaggerate", m: "v. 夸大" }
    ],
    questions: [
      { q: "The passage is mainly about ______.", options: ["why youth should ignore climate", "youth moving from observers to active climate actors and their demands", "how to ban elections", "why strikes are illegal"], answer: 1, explain: "全文讲青年从旁观走向行动及其诉求，B 最概括。" },
      { q: "What do surveys in Paragraph 2 show?", options: ["Young people do not care.", "Concern is high even where personal action feels out of reach.", "The problem is solved.", "Only old people worry."], answer: 1, explain: "第二段说即便觉无力行动，担忧仍高，对应 B。" },
      { q: "What do youth leaders insist?", options: ["Only lifestyle change matters.", "System change, not just lifestyle, is the real target.", "Firms should ignore energy.", "Carbon is good."], answer: 1, explain: "第三段说青年领袖坚持系统变革才是真正目标，对应 B。" },
      { q: "The word \"scale\" in Paragraph 2 means ______.", options: ["to enlarge in reach/size", "a kitchen tool", "a type of fish", "a law"], answer: 0, explain: "scale 此处指扩大规模/推广，A 正确。" },
      { q: "The author's view of the generational shift is ______.", options: ["it may outlast any single policy", "it is harmful", "it should be banned", "it is exaggeration only"], answer: 0, explain: "第四段说情绪转变比单项政策更持久，对应 A。" }
    ]
  },

  {
    id: "rd_tradition",
    level: 2,
    title: "The Quiet Return of Tradition",
    genre: "文化与社会",
    year: "2023.12",
    stars: 3,
    paras: [
      [
        { en: "A quiet wave of interest in traditional culture is sweeping through China's younger crowd.", zh: "一股对传统文化的悄然兴趣浪潮，正席卷中国的年轻群体。" },
        { en: "From hanfu on the street to ancient poems set to pop music, the old feels suddenly new.", zh: "从街头的汉服到被谱成流行音乐的古诗，旧事物突然有了新意。" },
        { en: "What once seemed dull in textbooks now trends on social feeds and campus events.", zh: "曾经在课本里显得枯燥的东西，如今在社交动态与校园活动中成了风潮。" }
      ],
      [
        { en: "Part of the pull is pride: a generation more sure of its roots seeks symbols of its own.", zh: "吸引力的一部分来自自豪感：更认同自身根源的一代，在寻找属于自己的符号。" },
        { en: "Learning a craft, a dance, or a verse becomes a way to belong and to stand apart.", zh: "学一门手艺、一支舞或一首诗，成了既归属其中又彰显独特的方式。" },
        { en: "Museums report record visits as exhibits meet the language of memes and short clips.", zh: "当展品用起网络梗和短视频的语言，博物馆迎来了创纪录的参观人次。" }
      ],
      [
        { en: "Brands rush to ride the wave, yet depth beats mere decoration when the crowd matures.", zh: "品牌争相逐浪，但当受众成熟后，深度胜过表面的装饰。" },
        { en: "Buyers tire of fake motifs and ask what the pattern truly means and where it came from.", zh: "买家厌倦了假纹样，开始追问图案真正的含义与来历。" },
        { en: "The serious fan wants story, not just style, and creators rise to meet that bar.", zh: "认真的爱好者要的是故事而非仅仅是样式，创作者也随之抬高了门槛。" }
      ],
      [
        { en: "The trend is more than nostalgia; it is a live link between past and present.", zh: "这股风潮不止是怀旧，它是过去与现在之间一条活的纽带。" },
        { en: "When a young singer quotes an old line, centuries lean close to listen.", zh: "当年轻歌者引用一句古诗，数个世纪便凑近倾听。" },
        { en: "Culture survives not in glass cases but in the hands and voices of those who reuse it.", zh: "文化不是保存在玻璃柜里，而是活在那些重新使用它的人手中与口中。" }
      ]
    ],
    vocab: [
      { w: "hanfu", m: "n. 汉服" },
      { w: "motif", m: "n. 图案，纹样" },
      { w: "nostalgia", m: "n. 怀旧" },
      { w: "meme", m: "n. 网络梗，模因" },
      { w: "exhibit", m: "n. 展品" }
    ],
    questions: [
      { q: "The passage mainly describes ______.", options: ["why textbooks are boring", "the revival of traditional culture among youth and what it means", "how to ban pop music", "why museums close"], answer: 1, explain: "全文描述传统文化在青年中的复兴及其意义，B 最概括。" },
      { q: "What signals the trend?", options: ["Falling museum visits.", "Hanfu, ancient poems set to pop, and traditional crafts trending.", "Less interest in roots.", "Banning social feeds."], answer: 1, explain: "第一段举汉服、古诗新唱、传统手艺走红为证，对应 B。" },
      { q: "What do mature buyers now want?", options: ["Fake motifs only.", "Story and meaning, not just style.", "No patterns.", "Foreign brands only."], answer: 1, explain: "第三段说成熟买家要故事与含义而非仅样式，对应 B。" },
      { q: "The word \"motif\" in Paragraph 3 means ______.", options: ["a decorative pattern or theme", "a type of food", "a law", "a song"], answer: 0, explain: "motif 指装饰图案或主题，A 正确。" },
      { q: "The author sees the trend as ______.", options: ["mere nostalgia", "a living link between past and present", "harmful", "a fad that will die"], answer: 1, explain: "末段说这是过去与现在之间活的纽带，对应 B。" }
    ]
  },

  /* ===== 以下为近年四级阅读真题（标记 isExam，题目/答案来自公开备考资料，仅供个人学习） ===== */

  {
    id: "rd_exam_hypo",
    level: 4,
    title: "Hypochondria and Cyberchondria",
    genre: "健康与生活",
    year: "2023.12",
    stars: 4,
    isExam: true,
    source: "2023年12月四级阅读真题（新东方在线）",
    paras: [
      [
        { en: "It happens to every medical student sooner or later.", zh: "每个医学生迟早都会遇到这种情况。" },
        { en: "You get a cough that persists for a while.", zh: "你咳嗽了一阵子。" },
        { en: "Ordinarily, you would just ignore it—but now, armed with your rapidly growing medical knowledge, you can't help worrying.", zh: "通常你会置之不理——但现在，仗着自己快速增长的医学知识，你忍不住担心起来。" },
        { en: "The cough could mean just a cold, but it could also be a sign of lung cancer.", zh: "咳嗽可能只是感冒，但也可能是一肺癌的迹象。" }
      ],
      [
        { en: "For doctors in training, nurses and medical journalists, hypochondria is an occupational danger.", zh: "对实习医生、护士和医学记者来说，疑病症是一种职业危险。" },
        { en: "The feeling usually passes after a while, leaving only a funny story to tell at a dinner party.", zh: "这种感觉通常过一阵就过去，只留下一个饭桌上讲的趣事。" },
        { en: "But for the tens of thousands who suffer from true hypochondria they live in constant terror that they are dying of some awful disease, or even several awful diseases at once.", zh: "但对成千上万真正患疑病症的人而言，他们生活在持续的恐惧中，害怕自己死于某种可怕的病，甚至同时死于好几种病。" },
        { en: "Doctors can assure them that there's nothing wrong, but since the cough is real, the assurances fall on deaf ears.", zh: "医生向他们保证没毛病，但因咳嗽是真实的，这些保证被充耳不闻。" },
        { en: "And because no physician or test can offer a 100% guarantee that one doesn't have cancer, a hypochondriac always has fuel to feed his or her worst fears.", zh: "而且因为没有医生或检测能提供100%的保证说某人没得癌症，疑病患者总有为最糟恐惧添柴加火的理由。" }
      ],
      [
        { en: "Hypochondriacs don't harm just themselves; they block the whole healthcare system.", zh: "疑病患者不只害自己，还拖垮整个医疗体系。" },
        { en: "Although they account for only about 6% of the patients who visit doctors every year, they tend to burden their physicians with frequent visits that take up excessive amounts of time.", zh: "虽然他们只占每年看医生病人的约6%，却常以频繁就诊加重医生负担，耗费大量时间。" },
        { en: "And the problem may be worse, thanks to the popularity of medical information on the Internet.", zh: "而由于网上医疗信息流行，问题可能更糟。" },
        { en: "They go on the Web and learn about new diseases and new presentations of old diseases that they never even knew about before.", zh: "他们上网了解以前从未知晓的新疾病和旧病的新表现。" },
        { en: "Doctors have taken to calling this phenomenon cyberchondria (网络疑病症).", zh: "医生们已开始把这种现象称为'网络疑病症'。" }
      ]
    ],
    vocab: [
      { w: "hypochondria", m: "n. 疑病症（无端怀疑自己患病）" },
      { w: "cyberchondria", m: "n. 网络疑病症" },
      { w: "persists", m: "v. 持续，顽固存在" },
      { w: "fall on deaf ears", m: "短语：被充耳不闻，不被理睬" },
      { w: "fuel", m: "v. 加剧，给…火上浇油" }
    ],
    questions: [
      { q: "According to the passage, if you suffer from hypochondria, ______.", options: ["you must be a medical student, or a medical worker", "you are haunted by a possibly inexistent disease", "you will never get rid of this disease", "you always tell funny stories at dinner parties"], answer: 1, explain: "细节题。第二段说明真正的疑病患者总害怕自己得了并不存在的重病，故选 B。" },
      { q: "Which of the following best summarizes the main idea of the passage?", options: ["Hypochondria happens to everybody sooner or later.", "We needn't worry about hypochondria since it is not dangerous at all.", "Hypochondria originates from too much knowledge of medicine.", "Not only individuals but also the healthcare system might be disturbed by unnecessary terrors."], answer: 3, explain: "主旨题。文章先引入疑病症，再论述它不仅困扰个人、还干扰医疗体系，D 最全面。" },
      { q: "Why can't doctors convince the sufferers that there is nothing wrong?", options: ["Because the doctors can't cure the minor diseases", "Because the doctors don't assure them of that", "Because the sufferers are deaf and cannot hear what the doctors say", "Because lack of absolute guarantee makes the patients doubtful"], answer: 3, explain: "细节题。原文 'no physician or test can offer a 100% guarantee' 说明缺乏绝对保证使患者怀疑，选 D。" },
      { q: "The problem becomes worse due to ______.", options: ["the increasing number of patients", "the widespread medical knowledge on the Internet", "the patients' regular visits to doctors that occupy too much time", "new diseases and symptoms emerge constantly"], answer: 1, explain: "推断题。thanks to 表原因，引出网络医疗信息泛滥使问题更严重，选 B。" },
      { q: "What does the author most probably think about hypochondria?", options: ["The author considers that hypochondria is an incurable disease", "The author thinks that the consequences of hypochondria might be disastrous", "The author suggests that the patients who have hypochondria should set their hearts at rest", "The author sympathizes with the patients who suffer from hypochondria"], answer: 2, explain: "态度题。作者认为此病源于多疑、并非不治之症，只要放宽心即可，故选 C。" }
    ]
  },

  {
    id: "rd_exam_social",
    level: 3,
    title: "Interpersonal Relationships and Social Support",
    genre: "文化与社会",
    year: "2024.12",
    stars: 3,
    isExam: true,
    source: "2024年12月四级阅读试题（新东方在线）",
    paras: [
      [
        { en: "Since we are social beings, the quality of our lives depends in large measure on our interpersonal relationships.", zh: "既然我们是社会性生物，生活质量在很大程度上取决于人际关系。" },
        { en: "One strength of the human condition is our tendency to give and receive support from one another under stressful circumstances.", zh: "人类处境的一大优势，是在压力情境下相互给予和接受支持的倾向。" },
        { en: "Social support consists of the exchange of resources among people based on their interpersonal ties.", zh: "社会支持指人们基于人际关系进行的资源交换。" },
        { en: "Those of us with strong support systems appear better able to cope with major life changes and daily hassles (困难).", zh: "拥有强大支持系统的人，似乎更能应对重大人生变故与日常烦扰。" },
        { en: "People with strong social ties live longer and have better health than those without such ties.", zh: "社交纽带强的人比没有的人更长寿、更健康。" },
        { en: "Studies over a range of illnesses, from depression to heart disease, reveal that the presence of social support helps people fend off (挡开) illness, and the absence of such support makes poor health more likely.", zh: "从抑郁到心脏病的一系列疾病研究表明，有社会支持助人抵御疾病，缺乏则更易健康不佳。" }
      ],
      [
        { en: "Social support cushions stress in a number of ways.", zh: "社会支持以多种方式缓冲压力。" },
        { en: "First, friends, relatives, and co-workers may let us know that they value us.", zh: "首先，朋友、亲戚和同事会让我们知道他们看重我们。" },
        { en: "Our self-respect is strengthened when we feel accepted by others despite our faults and difficulties.", zh: "当我们感到被他人接纳，尽管有缺点和困难，自尊便得到增强。" },
        { en: "Second, other people often provide us with informational support.", zh: "其次，他人常提供信息性支持。" },
        { en: "They help us to define and understand our problems and find solutions to them.", zh: "他们帮我们界定、理解问题并找到解决办法。" },
        { en: "Third, we typically find social companionship supportive.", zh: "第三，我们通常会发现社交陪伴很有支持作用。" },
        { en: "Engaging in leisure-time activities with others helps us to meet our social needs while at the same time distracting (转移…注意力) us from our worries and troubles.", zh: "与他人进行休闲活动，既满足社交需求，又使我们暂时忘却烦恼。" },
        { en: "Finally, other people may give us instrumental support—financial aid, material resources, and needed services—that reduces stress by helping us resolve and cope with our problems.", zh: "最后，他人可能给予工具性支持——经济援助、物质资源和所需服务——通过帮我们解决问题来减轻压力。" }
      ]
    ],
    vocab: [
      { w: "interpersonal", m: "adj. 人际的" },
      { w: "cushions", m: "v. 缓冲，减轻（冲击/压力）" },
      { w: "informational support", m: "信息性支持（提供建议、资讯）" },
      { w: "instrumental support", m: "工具性支持（物质/服务援助）" },
      { w: "fend off", m: "短语：挡开，抵御" }
    ],
    questions: [
      { q: "Interpersonal relationships are important because ______.", options: ["they are indispensable to people's social well-being", "they awaken people's desire to exchange resources", "they help people to cope with life in the information era", "they can cure a range of illnesses such as heart disease, etc"], answer: 0, explain: "细节题。首段指出生活质量取决于人际关系，社会支持对社交福祉不可或缺，选 A。" },
      { q: "Research shows that people's physical and mental health ______.", options: ["relies on the social welfare systems which support them", "has much to do with the amount of support they get from others", "depends on their ability to deal with daily worries and troubles", "is closely related to their strength for coping with major changes in their lives"], answer: 1, explain: "细节题。研究表明有无社会支持与身心健康密切相关，选 B。" },
      { q: "Which of the following is closest in meaning to the word \"cushions\" (Line 1, Para. 2)?", options: ["Adds up to.", "Does away with.", "Lessens the effect of.", "Lays the foundation for."], answer: 2, explain: "词义题。cushions 在文中指'缓冲、减轻'，与 Lessens the effect of 最接近，选 C。" },
      { q: "Helping a sick neighbor with some repair work is an example of ______.", options: ["instrumental support", "informational support", "social companionship", "the strengthening of self-respect"], answer: 0, explain: "细节题。帮邻居修理是提供物质/服务援助，即工具性支持，选 A。" },
      { q: "Social companionship is beneficial in that ______.", options: ["it helps strengthen our ties with relatives", "it enables us to eliminate our faults and mistakes", "it makes our leisure-time activities more enjoyable", "it draws our attention away from our worries and troubles"], answer: 3, explain: "细节题。社交陪伴通过休闲活动转移我们对烦恼的注意力，选 D。" }
    ]
  },

  {
    id: "rd_exam_edu",
    level: 4,
    title: "Education: Progress or Profit?",
    genre: "教育与心理",
    year: "2023.12",
    stars: 4,
    isExam: true,
    source: "2023年12月四级阅读真题（新东方在线）",
    paras: [
      [
        { en: "At the close of each business day, most trained teachers, administrators, politicians, and statesmen make objective analyses of all that has transpired.", zh: "每个工作日结束时，大多数训练有素的教师、管理者、政客和政治家都会对发生的一切做客观分析。" },
        { en: "They then carefully evaluate performance in the achievement of certain specified objectives.", zh: "然后他们仔细评估在达成某些既定目标方面的表现。" },
        { en: "You, as a student, would be wise to adopt the same practice and reflect upon your performance in relating to the achievement of certain personal and educational objectives.", zh: "作为学生，你若采用同样的做法、反思自己达成个人与教育目标的表现，会是明智的。" }
      ],
      [
        { en: "First, what was your purpose, your motivational force in seeking an education?", zh: "首先，你寻求教育的目的是什么，你的动力是什么？" },
        { en: "Did you seek an education in active performance, or did you seek to be educated in passive reception and automatic acquisition (获取) of information that was fed to you?", zh: "你是主动作为地求学，还是被动接收、自动获取喂给你的信息？" },
        { en: "Was the profit motive your primary motivation for obtaining an education?", zh: "逐利是你受教育的主要动机吗？" },
        { en: "Do you want a better education for the sole purpose of getting a better job?", zh: "你想要更好的教育，仅仅是为了找份更好的工作吗？" },
        { en: "What does the educational process really mean to you?", zh: "教育过程对你究竟意味着什么？" }
      ],
      [
        { en: "We are part of a world in which men thrill to the touch of gold and hearts respond to the word money instead of being thrilled by the thought of good.", zh: "我们所处的世界里，人们因黄金而激动，心因'金钱'二字而非'善'的念头而震颤。" },
        { en: "We live in a world in which we are taught that the pursuit of happiness is an equation for the most rapid acquisition of money, by whatever means.", zh: "我们生活在一个被教导'追求幸福等于以任何手段最快攫取金钱'的世界里。" }
      ],
      [
        { en: "If profit and money are your first priorities, and compassion and commitment to people your least concern, you have done little other than accumulate some facts and compile some information for future reference.", zh: "若利润与金钱是你的首要，而对人的同情与担当最不在意，你不过积累了一些事实、汇编了一些待用信息。" },
        { en: "If making money is your daydream and losing money your nightmare, if poverty is your worst fear and making money your most fervent prayer, you have missed the opportunity for education.", zh: "若赚钱是你的白日梦、赔钱是你的噩梦，若贫穷是最怕、赚钱是最热切的祈祷，你就错过了教育的机会。" },
        { en: "You have failed yourself and have only received some instruction.", zh: "你辜负了自己，只接受了些灌输。" }
      ]
    ],
    vocab: [
      { w: "transpired", m: "v. 发生（委婉）" },
      { w: "acquisition", m: "n. 获取，习得" },
      { w: "compassion", m: "n. 同情，怜悯" },
      { w: "nightmare", m: "n. 噩梦；可怕的事" },
      { w: "fervent", m: "adj. 热切的，强烈的" }
    ],
    questions: [
      { q: "This passage suggests that students should ______.", options: ["assess their aims for learning", "learn more to earn more", "evaluate their politicians and statesmen", "keep knowledge to themselves"], answer: 0, explain: "主旨题。文章开篇建议学生像职场人一样反思目标，即评估学习目的，选 A。" },
      { q: "The educational procedure should be one in which the student ______.", options: ["does what he is told", "gets a better education to get a better job", "makes principles of education for self-betterment of their aims", "approaches the benefits of being well-off"], answer: 2, explain: "推断题。作者主张学生应主动建构教育原则以自我提升，选 C。" },
      { q: "The author seems to feel that ______.", options: ["people's welfare should be the chief concern in learning", "profit has nothing to do with people", "poverty is good for the soul", "knowledge is not the main objective for learning"], answer: 0, explain: "态度题。作者强调对人的同情与担当应优先于逐利，选 A。" },
      { q: "A good title for the selection might be ______.", options: ["The Benefit of Education", "Education Motivation—Progress or Profit", "Self-Education", "Profit and Money"], answer: 1, explain: "主旨题。文章围绕教育动机（进步 vs 利润）展开，B 最贴切。" },
      { q: "The word \"nightmare\" in the last paragraph is nearest in meaning to ______.", options: ["a very bad dream", "unhappiness", "sleeplessness", "a hazard to your health"], answer: 0, explain: "词义题。nightmare 本义'噩梦'，与 a very bad dream 最近，选 A。" }
    ]
  },

  /* ===== 新增话题文章（原创，四级方向） ===== */
  {
    id: "rd_social_media",
    level: 4, stars: 4, year: "2025.12", genre: "科技与社会",
    title: "The Attention Economy: Who Owns Your Focus?",
    paras: [
      [
        { en: "Social media platforms are no longer just tools for staying in touch; they are businesses built to capture your attention.", zh: "社交媒体平台早已不只是联络工具，而是以攫取你的注意力为生的生意。" },
        { en: "Every scroll, like, and notification is engineered to keep you online a little longer.", zh: "每一次滑动、点赞与提醒，都被精心设计成让你多停留片刻。" }
      ],
      [
        { en: "Behind the screen, algorithms learn what triggers your emotions and feed you more of the same.", zh: "屏幕背后，算法学习什么会触发你的情绪，并推送更多同类内容。" },
        { en: "This creates filter bubbles that narrow the information you see.", zh: "这制造了信息茧房，收窄了你所能看到的信息。" }
      ],
      [
        { en: "Critics argue that constant interruption harms deep thinking and weakens memory.", zh: "批评者认为，持续的打断损害深度思考、削弱记忆力。" },
        { en: "Young people report feeling anxious when they try to put the phone down.", zh: "年轻人表示，试着放下手机时会感到焦虑。" }
      ],
      [
        { en: "The solution is not to abandon technology but to use it with intent.", zh: "对策不是抛弃科技，而是带着自觉去使用它。" },
        { en: "Setting boundaries on screen time can give your focus back to you.", zh: "为屏幕时间设限，便能把专注力重新交还给自己。" }
      ]
    ],
    vocab: [
      { w: "algorithm", m: "n. 算法" },
      { w: "trigger", m: "v. 触发" },
      { w: "filter bubble", m: "n. 信息茧房" },
      { w: "interruption", m: "n. 打断，干扰" },
      { w: "intent", m: "n. 意图，自觉" }
    ],
    questions: [
      { q: "The passage mainly discusses ______.", options: ["why social media is only for friends", "how platforms profit from users' attention and its effects", "why phones are so cheap", "how to write algorithms"], answer: 1, explain: "全文围绕平台如何攫取注意力及其影响展开，B 最概括。" },
      { q: "The term \"filter bubbles\" refers to ______.", options: ["personalized information that limits exposure", "soap bubbles", "a type of advertisement", "a privacy tool"], answer: 0, explain: "信息茧房指算法推送导致所见信息变窄，对应 A。" },
      { q: "What can be inferred about young people?", options: ["they never use phones", "they may feel uneasy without their phones", "they have all quit social media", "they prefer printed books"], answer: 1, explain: "第三段说年轻人放下手机会感到焦虑，可推知离开手机会不安。" },
      { q: "The word \"trigger\" is closest in meaning to ______.", options: ["cause to happen", "delete", "hide", "praise"], answer: 0, explain: "trigger 在此意为“触发”，与 cause to happen 最近。" },
      { q: "The author's attitude toward technology is ______.", options: ["wholly negative", "balanced, suggesting mindful use", "indifferent", "worshipful"], answer: 1, explain: "末段主张带着自觉使用而非抛弃，态度是理性、平衡的。" }
    ]
  },
  {
    id: "rd_minimal",
    level: 3, stars: 4, year: "2025.06", genre: "经济与消费",
    title: "Minimalism: The Quiet Rebellion Against Consumerism",
    paras: [
      [
        { en: "A growing number of people are choosing to own less, not more.", zh: "越来越多人选择少拥有，而非多拥有。" },
        { en: "Minimalism is not about poverty but about freeing life from excess stuff.", zh: "极简主义无关贫穷，而是把生活从过剩的物品中解放出来。" }
      ],
      [
        { en: "Advertising tells us that buying more brings happiness, yet the feeling fades fast.", zh: "广告告诉我们买得更多带来幸福，但这种感觉转瞬即逝。" },
        { en: "Many find that clearing clutter reduces stress and sharpens focus.", zh: "许多人发现清理杂物能减压、让注意力更集中。" }
      ],
      [
        { en: "This shift challenges the idea that self-worth equals what we possess.", zh: "这种转变挑战了“自我价值等于拥有之物”的观念。" },
        { en: "It also lowers spending and, often, one's environmental footprint.", zh: "它也降低了开支，往往还减小了环境足迹。" }
      ],
      [
        { en: "Minimalism is personal: for some it means fewer clothes, for others fewer commitments.", zh: "极简主义是很个人的：有人是少买衣服，有人是少些牵绊。" },
        { en: "The point is to make room for what truly matters.", zh: "重点是腾出空间给真正重要的事。" }
      ]
    ],
    vocab: [
      { w: "excess", m: "adj. 过量的" },
      { w: "clutter", m: "n. 杂乱（物）" },
      { w: "footprint", m: "n. （环境）足迹" },
      { w: "possession", m: "n. 拥有物" },
      { w: "commitment", m: "n. 牵绊，承诺" }
    ],
    questions: [
      { q: "The passage is mainly about ______.", options: ["why minimalism means being poor", "a movement toward owning less and its benefits", "how to get rich quickly", "why advertising always works"], answer: 1, explain: "全文讲极简主义（少拥有）及其好处，B 最贴切。" },
      { q: "According to the passage, the happiness from buying ______.", options: ["lasts forever", "fades quickly", "is forbidden by law", "never appears"], answer: 1, explain: "第二段说买东西带来的幸福感转瞬即逝。" },
      { q: "Clearing clutter is likely to ______.", options: ["increase stress", "reduce stress and sharpen focus", "cause debt", "isolate people"], answer: 1, explain: "第二段指出清理杂物能减压、提升专注。" },
      { q: "The word \"footprint\" here refers to ______.", options: ["a shoe mark", "environmental impact", "a store", "a tax"], answer: 1, explain: "此处 environmental footprint 指环境足迹/影响。" },
      { q: "The author's attitude toward minimalism is ______.", options: ["critical", "approving", "mocking", "purely neutral"], answer: 1, explain: "全文正面描述极简主义的好处，态度是认可的。" }
    ]
  },
  {
    id: "rd_reading_mind",
    level: 4, stars: 4, year: "2025.12", genre: "教育与心理",
    title: "Reading and the Training of the Mind",
    paras: [
      [
        { en: "Reading long-form text is a workout for the brain, not a passive pastime.", zh: "阅读长文是大脑的运动，而非被动消遣。" },
        { en: "It demands sustained attention and builds the capacity to follow complex arguments.", zh: "它需要持续专注，并培养追踪复杂论证的能力。" }
      ],
      [
        { en: "Studies link regular reading with larger vocabulary and better writing.", zh: "研究把规律阅读与更大词汇量、更好写作联系起来。" },
        { en: "It also strengthens empathy by letting us live inside others' viewpoints.", zh: "它还通过让我们置身他人视角，增强共情力。" }
      ],
      [
        { en: "In an age of quick clips, deep reading is a skill at risk of erosion.", zh: "在短视频盛行的时代，深度阅读是一项面临退化的技能。" },
        { en: "Students who read little struggle to concentrate on textbooks.", zh: "读得少的学生难以专注于课本。" }
      ],
      [
        { en: "Schools and families can protect the habit with daily reading time.", zh: "学校与家庭可用每日阅读时间守住这一习惯。" },
        { en: "A single chapter a day can rebuild the mental stamina reading requires.", zh: "每天一章，便能重建阅读所需的心理耐力。" }
      ]
    ],
    vocab: [
      { w: "sustained", m: "adj. 持续的" },
      { w: "empathy", m: "n. 共情" },
      { w: "viewpoint", m: "n. 视角" },
      { w: "erosion", m: "n. 侵蚀，退化" },
      { w: "stamina", m: "n. 耐力" }
    ],
    questions: [
      { q: "The main idea is that ______.", options: ["reading is a waste of time", "reading trains the mind and matters", "textbooks should be short", "clips are better than books"], answer: 1, explain: "首段点明阅读是大脑训练，全文论证其价值。" },
      { q: "Regular reading is linked to ______.", options: ["smaller vocabulary", "larger vocabulary and better writing", "poor empathy", "weak focus"], answer: 1, explain: "第二段说规律阅读关联更大词汇量与更好写作。" },
      { q: "Students who read little may ______.", options: ["focus better", "struggle to concentrate on textbooks", "write novels", "ignore short clips"], answer: 1, explain: "第三段指出读得少的学生难专注课本。" },
      { q: "The word \"erosion\" is closest to ______.", options: ["growth", "gradual weakening", "a color", "a law"], answer: 1, explain: "erosion 本义侵蚀，此处指技能逐渐退化。" },
      { q: "The author views daily reading time as ______.", options: ["harmful", "protective and helpful", "pointless", "old-fashioned"], answer: 1, explain: "末段主张用每日阅读守住习惯，态度积极。" }
    ]
  },
  {
    id: "rd_exercise_mood",
    level: 3, stars: 3, year: "2024.12", genre: "健康与生活",
    title: "Exercise as Medicine for the Mood",
    paras: [
      [
        { en: "A brisk walk can do more for a low mood than many people expect.", zh: "一阵快走对低落情绪的改善，超出许多人的预期。" },
        { en: "Physical activity releases chemicals that ease tension and lift spirits.", zh: "身体活动释放的化学物质能缓解紧张、提振精神。" }
      ],
      [
        { en: "Even ten minutes of movement can lower anxiety in the short term.", zh: "即便十分钟的活动，也能在短期内降低焦虑。" },
        { en: "Regular exercise is associated with better sleep and sharper memory.", zh: "规律运动与更好睡眠、更敏锐记忆相关。" }
      ],
      [
        { en: "You need not run marathons; consistency beats intensity.", zh: "不必跑马拉松，规律胜过高强度。" },
        { en: "Stairs, cycling to class, or dancing all count.", zh: "爬楼、骑车上课或跳舞都算数。" }
      ],
      [
        { en: "Treating movement as daily care, not a chore, makes it stick.", zh: "把运动当作日常养护而非苦差，才容易坚持。" },
        { en: "Over weeks, the lift in mood tends to compound.", zh: "数周下来，情绪的提升往往会累积放大。" }
      ]
    ],
    vocab: [
      { w: "brisk", m: "adj. 轻快的" },
      { w: "tension", m: "n. 紧张" },
      { w: "lift", m: "v. 提振（情绪）" },
      { w: "anxiety", m: "n. 焦虑" },
      { w: "consistency", m: "n. 规律，一致性" }
    ],
    questions: [
      { q: "The passage mainly says ______.", options: ["exercise harms mood", "exercise improves mood and how", "marathons are required", "sleep is bad"], answer: 1, explain: "全文讲运动改善情绪及其机理。" },
      { q: "A ten-minute movement can ______ in the short term.", options: ["raise anxiety", "lower anxiety", "cause pain", "do nothing"], answer: 1, explain: "第二段说十分钟活动短期降低焦虑。" },
      { q: "The author implies that ______.", options: ["only marathons help", "small regular activity helps", "exercise is a chore", "sleep worsens"], answer: 1, explain: "第三段强调规律的小运动也有益。" },
      { q: "The word \"brisk\" means ______.", options: ["slow", "quick and energetic", "lazy", "cold"], answer: 1, explain: "brisk walk 指轻快的散步。" },
      { q: "The author's attitude toward exercise as daily care is ______.", options: ["negative", "positive", "sarcastic", "indifferent"], answer: 1, explain: "全文积极倡导把运动当日常养护。" }
    ]
  },
  {
    id: "rd_plastic",
    level: 4, stars: 4, year: "2025.06", genre: "环境与自然",
    title: "The Hidden Cost of Plastic",
    paras: [
      [
        { en: "Plastic is cheap, light, and useful, which is exactly why it floods the planet.", zh: "塑料廉价、轻便、好用——这正是它淹没地球的原因。" },
        { en: "Much of it is used once and then discarded within minutes.", zh: "其中大量使用一次，几分钟内就被丢弃。" }
      ],
      [
        { en: "In oceans, it breaks into bits that enter the food chain.", zh: "在海洋中，它碎成微粒进入食物链。" },
        { en: "Microplastics have been found in fish, salt, and even human blood.", zh: "微塑料已在鱼、盐甚至人体血液中被发现。" }
      ],
      [
        { en: "Recycling helps but cannot keep pace with production.", zh: "回收有用，却跟不上生产速度。" },
        { en: "The real fix lies in using less and designing for reuse.", zh: "真正的解决之道在于少用、并为重复使用而设计。" }
      ],
      [
        { en: "Communities that ban single-use items show cleaner streets and seas.", zh: "禁一次性用品的社区，街道与海洋更干净。" },
        { en: "Small rules, multiplied by millions, shift the curve.", zh: "微小的规定，乘以数百万倍，便扭转趋势。" }
      ]
    ],
    vocab: [
      { w: "discard", m: "v. 丢弃" },
      { w: "microplastic", m: "n. 微塑料" },
      { w: "food chain", m: "n. 食物链" },
      { w: "pace", m: "n. 步伐，速度" },
      { w: "single-use", m: "adj. 一次性的" }
    ],
    questions: [
      { q: "The passage is mainly about ______.", options: ["plastic being harmless", "plastic pollution, its costs and solutions", "how to make plastic", "why oceans are blue"], answer: 1, explain: "全文讲塑料污染的成本与解决思路。" },
      { q: "Microplastics have been found in ______.", options: ["only fish", "fish, salt, and human blood", "only the air", "rocks"], answer: 1, explain: "第二段列举鱼、盐、人体血液。" },
      { q: "Recycling alone is ______.", options: ["enough", "insufficient against production", "harmful", "illegal"], answer: 1, explain: "第三段说回收跟不上生产速度，单靠不够。" },
      { q: "The word \"discard\" means ______.", options: ["keep", "throw away", "sell", "recycle"], answer: 1, explain: "discard 意为丢弃。" },
      { q: "The author's attitude toward bans on single-use plastic is ______.", options: ["opposed", "supportive", "neutral", "mocking"], answer: 1, explain: "末段以正面结果描述禁令，态度支持。" }
    ]
  },
  {
    id: "rd_volunteer",
    level: 3, stars: 4, year: "2025.12", genre: "文化与社会",
    title: "Why Young People Choose to Volunteer",
    paras: [
      [
        { en: "Volunteering is rising among the young, often beyond school requirements.", zh: "年轻人志愿服务的参与在上升，且常超出学校要求。" },
        { en: "They give time to shelters, libraries, and environmental groups.", zh: "他们把时间投入救助站、图书馆与环保组织。" }
      ],
      [
        { en: "For many, it is a way to belong and to learn skills no classroom teaches.", zh: "对许多人而言，这是获得归属感、学到课堂不授技能的途径。" },
        { en: "Teamwork and empathy grow through real responsibility.", zh: "团队合作与共情在真实责任中生长。" }
      ],
      [
        { en: "It also builds a sense of agency in a world that feels out of control.", zh: "在一个似乎失控的世界里，它也建立一种“能有所为”的主体感。" },
        { en: "Small acts, repeated, make a community feel less abstract.", zh: "微小行动反复发生，让“社区”不再抽象。" }
      ],
      [
        { en: "Critics warn against unpaid labor replacing real jobs.", zh: "批评者警示无偿劳动替代真实工作。" },
        { en: "Yet most volunteers report the reward is meaning, not a paycheck.", zh: "但多数志愿者说，回报是意义，而非薪水。" }
      ]
    ],
    vocab: [
      { w: "shelter", m: "n. 收容所" },
      { w: "belong", m: "v. 归属" },
      { w: "agency", m: "n. 能动性" },
      { w: "abstract", m: "adj. 抽象的" },
      { w: "paycheck", m: "n. 薪水" }
    ],
    questions: [
      { q: "The passage mainly discusses ______.", options: ["volunteering declining", "young people's volunteering and its meaning", "how to get paid", "why schools forbid it"], answer: 1, explain: "全文讲年轻人志愿服务及其意义。" },
      { q: "Volunteers often gain ______.", options: ["classroom degrees", "skills and a sense of belonging", "high pay", "nothing"], answer: 1, explain: "第二段说志愿者获得技能与归属感。" },
      { q: "Volunteering may help young people feel ______.", options: ["powerless", "more agentic and empowered", "lonely", "rich"], answer: 1, explain: "第三段说志愿服务建立主体感/能动感。" },
      { q: "The word \"agency\" here means ______.", options: ["an office", "a sense of being able to act", "a tax", "a vehicle"], answer: 1, explain: "此处 agency 指“能有所为”的能动性。" },
      { q: "The author's attitude toward volunteering is ______.", options: ["dismissive", "largely appreciative with a caveat", "hostile", "indifferent"], answer: 1, explain: "全文肯定志愿精神，仅末尾附带一点警示，态度以赞赏为主。" }
    ]
  },
  {
    id: "rd_softskill",
    level: 4, stars: 4, year: "2025.06", genre: "职场与人际",
    title: "Soft Skills: The New Hard Currency at Work",
    paras: [
      [
        { en: "Employers increasingly say technical skill gets you hired, but soft skills keep you employed.", zh: "雇主越来越常说：硬技能让你被录用，软技能让你留下来。" },
        { en: "Communication, teamwork, and adaptability now rank high on hiring lists.", zh: "沟通、协作与适应力，如今在招聘清单上排得很高。" }
      ],
      [
        { en: "A brilliant coder who cannot explain ideas may stall a project.", zh: "一个不会表达想法的天才程序员，可能拖垮项目。" },
        { en: "Listening well often resolves conflict before it grows.", zh: "好好倾听，常在冲突扩大前就将其化解。" }
      ],
      [
        { en: "Unlike fixed talent, soft skills can be trained on the job.", zh: "与固定天赋不同，软技能可在工作中训练。" },
        { en: "Feedback and practice turn awkward moments into strength.", zh: "反馈与练习把尴尬时刻转化为力量。" }
      ],
      [
        { en: "The workers who thrive are those who pair skill with people sense.", zh: "真正出众的人，是把能力与人际感结合在一起的人。" },
        { en: "In a shifting economy, that combination is the safest bet.", zh: "在变动的经济里，这种组合是最稳妥的赌注。" }
      ]
    ],
    vocab: [
      { w: "adaptability", m: "n. 适应力" },
      { w: "stall", m: "v. 使停滞" },
      { w: "conflict", m: "n. 冲突" },
      { w: "thrive", m: "v. 兴旺，茁壮成长" },
      { w: "combination", m: "n. 组合" }
    ],
    questions: [
      { q: "The main idea is that ______.", options: ["hard skills alone decide careers", "soft skills matter as much as technical ones", "coding is useless", "feedback is banned"], answer: 1, explain: "首段点明软技能与硬技能同等重要，甚至决定去留。" },
      { q: "A coder who cannot explain ideas may ______.", options: ["get promoted", "stall a project", "code faster", "be loved by all"], answer: 1, explain: "第二段说不会表达的程序员可能拖垮项目。" },
      { q: "Soft skills can be ______.", options: ["trained", "only born, never learned", "ignored", "fixed at birth"], answer: 0, explain: "第三段明确说软技能可在工作中训练。" },
      { q: "The word \"stall\" means ______.", options: ["speed up", "cause to stop progressing", "praise", "hire"], answer: 1, explain: "stall 此处指使项目停滞。" },
      { q: "The author's attitude toward combining skill and people sense is ______.", options: ["negative", "positive and supportive", "mocking", "neutral"], answer: 1, explain: "末段称这种组合最稳妥，态度积极支持。" }
    ]
  }
,
  /* ===== 新增：近年四级真题方向篇章（自建，仅供个人练习，标记 isExam） ===== */
  {
  "id": "rd_exam_filter",
  "level": 4,
  "stars": 4,
  "year": "2024.12",
  "genre": "科技与社会",
  "title": "算法推荐与信息茧房",
  "isExam": true,
  "source": "近年四级真题方向（自建，仅供练习）",
  "paras": [
    [
      {
        "en": "Every time you open a video app, an algorithm is guessing what you want to watch next.",
        "zh": "每次打开视频软件，算法都在猜你接下来想看什么。"
      },
      {
        "en": "It learns from your clicks and quietly builds a world that looks just like your old tastes.",
        "zh": "它从你的点击中学习，悄悄搭建一个与你旧口味相似的世界。"
      },
      {
        "en": "The result is a cozy but narrow space that people call a filter bubble.",
        "zh": "结果是一个舒适却狭窄的空间，人们称之为过滤气泡。"
      }
    ],
    [
      {
        "en": "Inside the bubble, opposing views rarely appear, so disagreement feels rare.",
        "zh": "在气泡里，对立观点很少出现，于是分歧显得稀少。"
      },
      {
        "en": "Users may believe everyone thinks the same way, which weakens real discussion.",
        "zh": "用户可能以为人人想法一致，这削弱了真正的讨论。"
      },
      {
        "en": "Over time, this can deepen social division rather than bridge it.",
        "zh": "久而久之，这反而可能加深而非弥合社会分裂。"
      }
    ],
    [
      {
        "en": "Yet the algorithm itself is not evil; it only follows the goal of keeping you watching.",
        "zh": "然而算法本身并非邪恶，它只是遵循让你一直看的目标。"
      },
      {
        "en": "The real question is how platforms should balance profit with public interest.",
        "zh": "真正的问题是平台该如何在盈利与公共利益之间取得平衡。"
      }
    ],
    [
      {
        "en": "A good start is for users to seek different sources on purpose.",
        "zh": "好的开始是用户主动去接触不同来源。"
      },
      {
        "en": "By stepping out of the bubble now and then, we keep our minds open.",
        "zh": "不时走出气泡，我们才能让头脑保持开放。"
      }
    ]
  ],
  "questions": [
    {
      "q": "The passage is mainly about ______.",
      "options": [
        "why video apps are popular",
        "how recommendation algorithms create filter bubbles and their effects",
        "how to make a better algorithm",
        "why people dislike social media"
      ],
      "answer": 1,
      "explain": "全文围绕推荐算法如何制造过滤气泡及其对讨论与社会的影响展开。"
    },
    {
      "q": "Inside the filter bubble, opposing views ______.",
      "options": [
        "appear more often",
        "seldom show up",
        "always win debates",
        "are encouraged"
      ],
      "answer": 1,
      "explain": "第二段说气泡里对立观点很少出现。"
    },
    {
      "q": "The word \"division\" in Paragraph 2 is closest in meaning to ______.",
      "options": [
        "unity and peace",
        "separation or conflict between groups",
        "a type of app",
        "a kind of profit"
      ],
      "answer": 1,
      "explain": "deepen social division 指加深群体间的分裂与对立。"
    },
    {
      "q": "What can be inferred about the algorithm?",
      "options": [
        "It wants to harm users on purpose.",
        "It simply optimizes for keeping users engaged.",
        "It refuses to show any video.",
        "It is controlled by the government."
      ],
      "answer": 1,
      "explain": "第三段说算法只遵循让你持续观看的目标，并非恶意，只是在优化用户停留。"
    },
    {
      "q": "The author's attitude toward recommendation algorithms is ______.",
      "options": [
        "fully supportive",
        "completely hostile",
        "critical but balanced",
        "indifferent"
      ],
      "answer": 2,
      "explain": "作者指出算法非恶，但质疑平台应如何平衡利益，态度批评而克制。"
    }
  ]
},
  {
  "id": "rd_exam_onlineedu",
  "level": 4,
  "stars": 4,
  "year": "2024.06",
  "genre": "教育与心理",
  "title": "在线教育的成效与局限",
  "isExam": true,
  "source": "近年四级真题方向（自建，仅供练习）",
  "paras": [
    [
      {
        "en": "Online learning has grown from a backup plan into a daily habit for many students.",
        "zh": "在线学习已从备选方案，成长为许多学生日常的习惯。"
      },
      {
        "en": "A single course can now reach learners who once had no access to good teachers.",
        "zh": "如今一门课能触达那些曾无缘好老师的求知者。"
      }
    ],
    [
      {
        "en": "Its strength is flexibility: people study at their own pace, anytime and anywhere.",
        "zh": "它的优势在于灵活：人们随时随地按自己的节奏学习。"
      },
      {
        "en": "Recorded lessons also let students review difficult points again and again.",
        "zh": "录播课也让学生能反复回顾难点。"
      }
    ],
    [
      {
        "en": "However, learning alone at a screen is not always effective.",
        "zh": "然而，独自对着屏幕学习并非总是有效。"
      },
      {
        "en": "Without a teacher's watch and peers' pressure, some lose focus and quit early.",
        "zh": "缺少老师的督促与同伴的压力，有人会走神并早早放弃。"
      },
      {
        "en": "Hands-on practice, which matters in many fields, is hard to deliver online.",
        "zh": "在许多领域至关重要的动手实践，很难在线上完成。"
      }
    ],
    [
      {
        "en": "The sensible choice is to blend online and offline learning.",
        "zh": "明智之举是把线上与线下学习结合起来。"
      },
      {
        "en": "Used well, technology widens the door; used poorly, it widens the gap.",
        "zh": "用得好，技术拓宽大门；用得不好，它反倒拉大差距。"
      }
    ]
  ],
  "questions": [
    {
      "q": "The passage mainly discusses ______.",
      "options": [
        "why schools should close",
        "the benefits and limits of online learning",
        "how to code an app",
        "the history of textbooks"
      ],
      "answer": 1,
      "explain": "全文讲在线学习的优势与局限。"
    },
    {
      "q": "One strength of online learning is ______.",
      "options": [
        "fixed class time",
        "flexibility and self-paced study",
        "no need to review",
        "higher cost"
      ],
      "answer": 1,
      "explain": "第二段说其优势是灵活、按自己节奏。"
    },
    {
      "q": "\"Hands-on\" in Paragraph 3 most probably means ______.",
      "options": [
        "theoretical",
        "involving actual practice",
        "online only",
        "written"
      ],
      "answer": 1,
      "explain": "hands-on practice 指动手实践。"
    },
    {
      "q": "Why might some students quit online courses early?",
      "options": [
        "The lessons are too short.",
        "Lack of supervision and peer pressure weakens their focus.",
        "Teachers call them daily.",
        "The courses are free."
      ],
      "answer": 1,
      "explain": "第三段说缺少督促与同伴压力使人走神放弃。"
    },
    {
      "q": "The author suggests we should ______.",
      "options": [
        "ban all online learning",
        "blend online and offline learning",
        "study only offline",
        "ignore technology"
      ],
      "answer": 1,
      "explain": "第四段主张线上线下结合。"
    }
  ]
},
  {
  "id": "rd_exam_greenbuy",
  "level": 3,
  "stars": 4,
  "year": "2025.06",
  "genre": "环境与自然",
  "title": "绿色消费与可持续生活",
  "isExam": true,
  "source": "近年四级真题方向（自建，仅供练习）",
  "paras": [
    [
      {
        "en": "More shoppers now check where a product comes from and how it is made.",
        "zh": "如今更多购物者会查看商品来自哪里、如何制造。"
      },
      {
        "en": "Buying less but better has become a quiet trend among the young.",
        "zh": "少买但买好，已成为年轻人中一股低调的潮流。"
      }
    ],
    [
      {
        "en": "Green consumption means choosing items that cost the earth less.",
        "zh": "绿色消费意味着选择对地球代价更小的物品。"
      },
      {
        "en": "It favors durability over fashion, and reuse over throwaway habits.",
        "zh": "它偏爱耐用而非时髦，偏爱重复使用而非随手丢弃。"
      }
    ],
    [
      {
        "en": "Critics warn that some brands fake greenness to sell more, a trick called greenwashing.",
        "zh": "批评者提醒，有些品牌假装环保以促进销售，这被称为漂绿。"
      },
      {
        "en": "Smart buyers read labels and ask whether a claim is truly verified.",
        "zh": "聪明的买家会读标签，并追问说法是否真的经过验证。"
      }
    ],
    [
      {
        "en": "In the end, sustainable living is less about price than about habit.",
        "zh": "归根结底，可持续生活关乎习惯甚于价格。"
      },
      {
        "en": "Small daily choices, added together, shape the planet we leave behind.",
        "zh": "日复一日的小选择，汇聚起来塑造了我们留下的星球。"
      }
    ]
  ],
  "questions": [
    {
      "q": "The passage is mainly about ______.",
      "options": [
        "how to get rich",
        "green consumption and sustainable living",
        "why products are cheap",
        "the history of shopping"
      ],
      "answer": 1,
      "explain": "全文讲绿色消费与可持续生活。"
    },
    {
      "q": "Green consumption favors ______.",
      "options": [
        "throwaway habits",
        "durability and reuse",
        "cheap fashion",
        "more packaging"
      ],
      "answer": 1,
      "explain": "第二段说它偏爱耐用与重复使用。"
    },
    {
      "q": "\"greenwashing\" in Paragraph 3 refers to ______.",
      "options": [
        "a washing machine",
        "false green claims to boost sales",
        "a real eco label",
        "a recycling bin"
      ],
      "answer": 1,
      "explain": "漂绿指假装环保以促进销售。"
    },
    {
      "q": "Smart buyers are advised to ______.",
      "options": [
        "trust every green claim",
        "verify claims by reading labels",
        "ignore labels",
        "buy the cheapest"
      ],
      "answer": 1,
      "explain": "第三段建议读标签验证说法。"
    },
    {
      "q": "The author's tone toward sustainable living is ______.",
      "options": [
        "dismissive",
        "encouraging",
        "angry",
        "strictly neutral"
      ],
      "answer": 1,
      "explain": "末段积极倡导可持续生活，语气鼓励。"
    }
  ]
},
  {
  "id": "rd_exam_digitalgap",
  "level": 4,
  "stars": 4,
  "year": "2025.12",
  "genre": "文化与社会",
  "title": "代际数字鸿沟：教长辈走进智能时代",
  "isExam": true,
  "source": "近年四级真题方向（自建，仅供练习）",
  "paras": [
    [
      {
        "en": "Many young people grew up with smartphones, while their grandparents still fear the screen.",
        "zh": "许多年轻人在智能手机中长大，而他们的祖辈仍对屏幕心存畏惧。"
      },
      {
        "en": "This gap between generations in using technology is called the digital divide.",
        "zh": "这种代际间的技术使用差距被称为数字鸿沟。"
      }
    ],
    [
      {
        "en": "It shows up at hospitals, where self-service machines leave the elderly confused.",
        "zh": "它出现在医院——自助机让老人无所适从。"
      },
      {
        "en": "It shows up in daily life, when a QR code blocks them from entering a building.",
        "zh": "也出现在日常——一个二维码就把他们挡在楼宇之外。"
      }
    ],
    [
      {
        "en": "Teaching the old is not just kindness; it is a duty across generations.",
        "zh": "教老人用科技不只是善意，更是代际之间的责任。"
      },
      {
        "en": "Patience matters more than speed, because shame makes them give up.",
        "zh": "耐心比速度更重要，因为羞耻感会让他们放弃。"
      }
    ],
    [
      {
        "en": "When a grandchild helps a grandparent send their first message, both gain.",
        "zh": "当孙辈帮祖辈发出第一条信息，双方都有所得。"
      },
      {
        "en": "Bridging the divide keeps families close in a fast-changing world.",
        "zh": "弥合这道鸿沟，让我们在快速变化的世界里依旧亲密。"
      }
    ]
  ],
  "questions": [
    {
      "q": "The passage is mainly about ______.",
      "options": [
        "how to build a smartphone",
        "the generational digital divide and helping the elderly",
        "why youth hate technology",
        "the price of machines"
      ],
      "answer": 1,
      "explain": "全文讲代际数字鸿沟及帮助老人。"
    },
    {
      "q": "The digital divide is shown by ______.",
      "options": [
        "young people fearing screens",
        "elderly struggling with self-service machines and QR codes",
        "hospitals closing",
        "free wifi"
      ],
      "answer": 1,
      "explain": "第二段举自助机与二维码为例。"
    },
    {
      "q": "The word \"divide\" in Paragraph 1 means ______.",
      "options": [
        "a math sign",
        "a gap or separation",
        "a type of phone",
        "a bridge"
      ],
      "answer": 1,
      "explain": "divide 此处指差距、分隔。"
    },
    {
      "q": "Why is patience important when teaching the old?",
      "options": [
        "They learn faster when shamed.",
        "Shame may make them quit, so patience keeps them going.",
        "Speed is all that matters.",
        "They refuse help."
      ],
      "answer": 1,
      "explain": "第三段说羞耻感会让他们放弃，故需耐心。"
    },
    {
      "q": "The author believes helping the elderly with technology is ______.",
      "options": [
        "a waste of time",
        "both kind and a duty",
        "only for schools",
        "harmful"
      ],
      "answer": 1,
      "explain": "第三段明确说既是善意也是责任。"
    }
  ]
}
];
