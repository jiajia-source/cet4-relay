/* ===== 四级听力专项素材（离线 TTS 可读）=====
 * 字段：id / type / title / scene / year(年份标签,真题类) / stars(难度星级1-5)
 *      / lines[{spk,en,zh}] 按句分段，en 朗读、zh 为点击弹出的中文翻译
 *      / questions[{q, options[4], answer(0基), explain}] 每篇 1-3 题，贴近四级考试形式
 * 说明：离线环境无真实音频，听力"播放"由浏览器语音合成(TTS)朗读原文实现；
 *       questions 用于作答判分与错题收藏（错题按整篇收藏）。
 */
window.LISTENING = [

  /* ---------------- 短对话（每篇 1 题） ---------------- */
  {
    id: "short_1", type: "short", title: "短对话 · 第 1 篇", scene: "问路",
    year: 2023, stars: 2,
    lines: [
      { spk: "M", en: "Excuse me, do you know where I can find the history museum?", zh: "打扰一下，你知道历史博物馆在哪吗？" },
      { spk: "W", en: "It's on Center Street, just across from the big supermarket.", zh: "在中心街，正对着那家大超市。" },
      { spk: "M", en: "Thank you. Is it far from here?", zh: "谢谢。离这儿远吗？" },
      { spk: "W", en: "Not really. About a ten-minute walk.", zh: "不远，走过去大概十分钟。" }
    ],
    questions: [
      { q: "Where is the history museum?", options: ["On Center Street, across from a supermarket.", "Next to the school library.", "Behind the post office.", "Inside the shopping mall."], answer: 0, explain: "女士明确说博物馆在中心街、正对着大超市，对应 A。" }
    ]
  },
  {
    id: "short_2", type: "short", title: "短对话 · 第 2 篇", scene: "日常邀约",
    year: 2024, stars: 2,
    lines: [
      { spk: "W", en: "Would you like to go to the movie with us tonight?", zh: "今晚想和我们一起去看电影吗？" },
      { spk: "M", en: "I'd love to, but I have to finish my report before tomorrow morning.", zh: "我很想去，但我明天早上之前得把报告写完。" },
      { spk: "W", en: "Can't you do it this weekend?", zh: "你周末做不行吗？" },
      { spk: "M", en: "No, the boss needs it first thing tomorrow.", zh: "不行，老板明天一早就要。" }
    ],
    questions: [
      { q: "What will the man do tonight?", options: ["Go to the movie.", "Finish his report.", "Visit his friend.", "Go to bed early."], answer: 1, explain: "男士说必须明天早上前完成报告，所以今晚要写报告，选 B。" }
    ]
  },
  {
    id: "short_3", type: "short", title: "短对话 · 第 3 篇", scene: "购物",
    year: 2022, stars: 2,
    lines: [
      { spk: "M", en: "How much is this red sweater?", zh: "这件红色毛衣多少钱？" },
      { spk: "W", en: "It was eighty dollars, but now it's half price.", zh: "原先八十美元，现在半价。" },
      { spk: "M", en: "Great. I'll take two, one for my sister.", zh: "太好了，我要两件，给我妹妹也带一件。" },
      { spk: "W", en: "Sure, that will be forty dollars each.", zh: "好的，每件四十美元。" }
    ],
    questions: [
      { q: "What is the price of the sweater now?", options: ["Eighty dollars.", "Forty dollars.", "One hundred dollars.", "Twenty dollars."], answer: 1, explain: "原价 80 美元、现半价，即 40 美元，选 B。" }
    ]
  },
  {
    id: "short_4", type: "short", title: "短对话 · 第 4 篇", scene: "图书馆借书",
    year: 2021, stars: 3,
    lines: [
      { spk: "M", en: "Excuse me, how many books can I borrow at a time?", zh: "打扰一下，我一次最多能借几本书？" },
      { spk: "W", en: "You can borrow up to five books, and they are due in two weeks.", zh: "最多借五本，两周内归还。" },
      { spk: "M", en: "What if I need them longer?", zh: "如果我想借更久呢？" },
      { spk: "W", en: "You may renew them once online for another two weeks.", zh: "你可以在线续借一次，再延长两周。" }
    ],
    questions: [
      { q: "How many books can the man borrow at most?", options: ["Three.", "Five.", "Ten.", "Two."], answer: 1, explain: "女士说最多可借五本（up to five books），选 B。" }
    ]
  },
  {
    id: "short_5", type: "short", title: "短对话 · 第 5 篇", scene: "餐厅点餐",
    year: 2023, stars: 2,
    lines: [
      { spk: "W", en: "What would you like to order?", zh: "您想点些什么？" },
      { spk: "M", en: "I'll have a bowl of tomato soup and a chicken sandwich, please.", zh: "我要一碗番茄汤和一份鸡肉三明治。" },
      { spk: "W", en: "Anything to drink?", zh: "喝点什么吗？" },
      { spk: "M", en: "A glass of orange juice, thank you.", zh: "一杯橙汁，谢谢。" }
    ],
    questions: [
      { q: "What does the man order?", options: ["A beef burger.", "Tomato soup, a chicken sandwich and juice.", "A pizza.", "Fried rice."], answer: 1, explain: "男士点了一份番茄汤、鸡肉三明治和一杯橙汁，选 B。" }
    ]
  },
  {
    id: "short_6", type: "short", title: "短对话 · 第 6 篇", scene: "天气出行",
    year: 2024, stars: 3,
    lines: [
      { spk: "M", en: "It's raining heavily. Shall we take a taxi instead of riding bikes?", zh: "雨下得很大，我们打车去而不骑车好吗？" },
      { spk: "W", en: "Good idea. The bus is too crowded at this hour.", zh: "好主意，这个点公交车太挤了。" },
      { spk: "M", en: "There's one coming. Let me wave it down.", zh: "有辆出租车来了，我招手叫它。" },
      { spk: "W", en: "Hurry, before it passes us.", zh: "快，趁它还没过去。" }
    ],
    questions: [
      { q: "How will they probably go?", options: ["By bike.", "By taxi.", "By bus.", "On foot."], answer: 1, explain: "男士提议打车、女士同意，所以大概率打车，选 B。" }
    ]
  },
  {
    id: "short_7", type: "short", title: "短对话 · 第 7 篇", scene: "备考状态",
    year: 2022, stars: 2,
    lines: [
      { spk: "W", en: "The math exam is coming. Are you ready?", zh: "数学考试快到了，你准备好了吗？" },
      { spk: "M", en: "Not really. I only finished half of the practice problems.", zh: "还没呢，练习题我只做了一半。" },
      { spk: "W", en: "Don't worry. We can review together this evening.", zh: "别担心，今晚我们可以一起复习。" },
      { spk: "M", en: "That would be a big help. Thanks!", zh: "那太有帮助了，谢谢！" }
    ],
    questions: [
      { q: "What does the man mean?", options: ["He is well prepared.", "He finished all problems.", "He is not fully ready.", "He will skip the exam."], answer: 2, explain: "男士说只做了一半练习、没准备好，选 C。" }
    ]
  },
  {
    id: "short_8", type: "short", title: "短对话 · 第 8 篇", scene: "电话留言",
    year: 2021, stars: 3,
    lines: [
      { spk: "M", en: "Could you take a message for Lisa? Tell her the meeting is moved to 3 p.m.", zh: "能帮 Lisa 带个话吗？告诉她会议改到下午三点。" },
      { spk: "W", en: "Sure, I'll let her know as soon as she returns.", zh: "没问题，她一回来我就告诉她。" },
      { spk: "M", en: "And please remind her to bring the report.", zh: "也提醒她带上那份报告。" },
      { spk: "W", en: "Got it. Report and the 3 p.m. meeting.", zh: "记下了，报告，还有下午三点的会。" }
    ],
    questions: [
      { q: "What message should the woman give Lisa?", options: ["The meeting is at 3 p.m. and bring the report.", "The meeting is canceled.", "Lisa should call back.", "The meeting is moved to 9 a.m."], answer: 0, explain: "男士要传达会议改到下午三点、并带报告，选 A。" }
    ]
  },
  {
    id: "short_9", type: "short", title: "短对话 · 第 9 篇", scene: "看医生",
    year: 2023, stars: 3,
    lines: [
      { spk: "W", en: "You have a fever and a sore throat. You should drink more water and rest.", zh: "你发烧、喉咙痛，应该多喝水、多休息。" },
      { spk: "M", en: "OK, doctor. Do I need any medicine?", zh: "好的医生，我需要吃药吗？" },
      { spk: "W", en: "I'll give you some. Take it twice a day after meals.", zh: "我给你开一些，每天饭后两次。" },
      { spk: "M", en: "Thank you, doctor. I'll be careful.", zh: "谢谢医生，我会注意的。" }
    ],
    questions: [
      { q: "What does the doctor advise the man to do?", options: ["Exercise more.", "Drink water and rest.", "Eat spicy food.", "Go to work."], answer: 1, explain: "医生建议多喝水、多休息，选 B。" }
    ]
  },
  {
    id: "short_10", type: "short", title: "短对话 · 第 10 篇", scene: "约时间",
    year: 2024, stars: 2,
    lines: [
      { spk: "M", en: "Shall we meet at the school gate at eight?", zh: "我们八点在校门口见好吗？" },
      { spk: "W", en: "Eight is a bit early for me. Can we make it half past?", zh: "八点对我来说有点早，改成八点半行吗？" },
      { spk: "M", en: "No problem. See you then.", zh: "没问题，到时候见。" },
      { spk: "W", en: "See you at eight thirty.", zh: "八点半见。" }
    ],
    questions: [
      { q: "When will they meet?", options: ["At eight.", "At half past eight.", "At nine.", "At seven thirty."], answer: 1, explain: "女士提议八点半、男士同意，所以八点半见，选 B。" }
    ]
  },

  /* ---------------- 长对话（每篇 3 题） ---------------- */
  {
    id: "long_1", type: "long", title: "长对话 · 第 1 篇 · 求职面试", scene: "求职面试",
    year: 2022, stars: 3,
    lines: [
      { spk: "M", en: "Hello, welcome to the interview. Could you tell me a little about yourself?", zh: "你好，欢迎来面试。能简单介绍一下自己吗？" },
      { spk: "W", en: "Sure. I graduated from Sun University last year, and I worked as a part-time teacher for six months.", zh: "可以。我去年毕业于阳光大学，做过半年兼职老师。" },
      { spk: "M", en: "Why do you want this job?", zh: "你为什么想要这份工作？" },
      { spk: "W", en: "Because I enjoy working with children, and your school has a good reputation.", zh: "因为我喜欢和孩子相处，而且你们学校口碑很好。" },
      { spk: "M", en: "Great. What subjects can you teach?", zh: "很好。你能教哪些科目？" },
      { spk: "W", en: "I can teach English and music. I also help with after-school clubs.", zh: "我能教英语和音乐，也帮忙带课后社团。" },
      { spk: "M", en: "When can you start?", zh: "你什么时候能入职？" },
      { spk: "W", en: "I can start next Monday, if that works for you.", zh: "如果方便的话，我下周一就能开始。" },
      { spk: "M", en: "Perfect. We will call you within three days.", zh: "很好。我们三天内会给你打电话。" }
    ],
    questions: [
      { q: "What job does the woman want to get?", options: ["A teacher.", "A doctor.", "A reporter.", "A shop assistant."], answer: 0, explain: "女士提到做过兼职教师、喜欢和孩子工作，应聘的是教师岗位，选 A。" },
      { q: "Which subjects can the woman teach?", options: ["Math and science.", "English and music.", "History and art.", "PE and Chinese."], answer: 1, explain: "女士说自己能教英语和音乐（English and music），选 B。" },
      { q: "When can the woman start working?", options: ["Next Monday.", "Tomorrow.", "Next month.", "This Friday."], answer: 0, explain: "女士说下周一可以开始（start next Monday），选 A。" }
    ]
  },
  {
    id: "long_2", type: "long", title: "长对话 · 第 2 篇 · 旅行", scene: "旅行",
    year: 2023, stars: 3,
    lines: [
      { spk: "W", en: "Hi Tom, how was your trip to Hangzhou?", zh: "嗨 Tom，你杭州之行怎么样？" },
      { spk: "M", en: "It was wonderful! The West Lake was so beautiful, and the food was delicious.", zh: "太棒了！西湖很美，吃的也很棒。" },
      { spk: "W", en: "Did you go there by train?", zh: "你是坐火车去的吗？" },
      { spk: "M", en: "No, I drove there with my cousins. It took about three hours.", zh: "不是，我和表兄弟开车去的，大概花了三小时。" },
      { spk: "W", en: "Where did you stay?", zh: "你住哪儿了？" },
      { spk: "M", en: "A small hotel near the lake. We could walk to the water in five minutes.", zh: "湖边一家小旅馆，走五分钟就到水边。" },
      { spk: "W", en: "Will you go there again?", zh: "你还会再去吗？" },
      { spk: "M", en: "Definitely. I plan to visit again next spring with my parents.", zh: "一定。我计划明年春天带父母再去。" }
    ],
    questions: [
      { q: "How did Tom go to Hangzhou?", options: ["By train.", "By car.", "By bus.", "By plane."], answer: 1, explain: "男士说和表兄弟开车（drove）去的，选 B。" },
      { q: "Where did Tom stay?", options: ["In a hotel near the lake.", "At his cousin's home.", "On the train.", "In a faraway city."], answer: 0, explain: "男士住在湖边一家小旅馆，选 A。" },
      { q: "When does Tom plan to visit again?", options: ["Next winter.", "Next spring.", "Next summer.", "Next autumn."], answer: 1, explain: "男士说计划明年春天再去，选 B。" }
    ]
  },
  {
    id: "long_3", type: "long", title: "长对话 · 第 3 篇 · 校园选课", scene: "校园选课",
    year: 2024, stars: 3,
    lines: [
      { spk: "M", en: "I'm not sure which course to take this term.", zh: "我不确定这学期选哪门课。" },
      { spk: "W", en: "How about the public speaking class? It's very popular.", zh: "演讲课怎么样？很受欢迎的。" },
      { spk: "M", en: "Is it difficult?", zh: "难吗？" },
      { spk: "W", en: "Not really, but you have to give three speeches in front of the class.", zh: "不算难，但要在全班面前做三次演讲。" },
      { spk: "M", en: "That sounds helpful for my future job.", zh: "听起来对我以后工作有帮助。" },
      { spk: "W", en: "Exactly. And the teacher is kind and gives good advice.", zh: "没错，而且老师很和善、给的建议也很好。" },
      { spk: "M", en: "OK, I'll sign up this afternoon.", zh: "好，我下午就去报名。" },
      { spk: "W", en: "Great choice. You won't regret it.", zh: "好选择，你不会后悔的。" }
    ],
    questions: [
      { q: "What course does the woman suggest?", options: ["Public speaking.", "Math.", "History.", "Art."], answer: 0, explain: "女士推荐演讲课（public speaking），选 A。" },
      { q: "What must students do in the class?", options: ["Write a long paper.", "Give three speeches.", "Take a final exam only.", "Watch movies."], answer: 1, explain: "女士说要在全班面前做三次演讲，选 B。" },
      { q: "What will the man do?", options: ["Take math instead.", "Sign up this afternoon.", "Ask his parents.", "Drop out of school."], answer: 1, explain: "男士说下午就去报名演讲课，选 B。" }
    ]
  },
  {
    id: "long_4", type: "long", title: "长对话 · 第 4 篇 · 租房搬家", scene: "租房搬家",
    year: 2021, stars: 3,
    lines: [
      { spk: "W", en: "Have you found a new apartment?", zh: "你找到新公寓了吗？" },
      { spk: "M", en: "Yes, a small one near the school. The rent is 800 yuan a month.", zh: "找到了，学校附近的小公寓，月租八百元。" },
      { spk: "W", en: "That's cheap! Is it furnished?", zh: "好便宜！带家具吗？" },
      { spk: "M", en: "Yes, with a bed, a desk and a fridge. I can move in next week.", zh: "带，有床、书桌和冰箱，下周就能搬进去。" },
      { spk: "W", en: "Do you need any help with the move?", zh: "搬家需要帮忙吗？" },
      { spk: "M", en: "That would be great. I have two big boxes of books.", zh: "那太好了，我有两大箱书。" },
      { spk: "W", en: "No problem. I'll bring my brother's car.", zh: "没事，我开我哥的车来。" },
      { spk: "M", en: "You are a lifesaver. Thank you!", zh: "你真是救星，谢谢！" }
    ],
    questions: [
      { q: "What is the rent of the man's new apartment?", options: ["500 yuan.", "800 yuan.", "1200 yuan.", "2000 yuan."], answer: 1, explain: "男士说月租 800 元，选 B。" },
      { q: "What furniture is in the apartment?", options: ["Only a bed.", "A bed, a desk and a fridge.", "A sofa and TV.", "Nothing at all."], answer: 1, explain: "男士说带床、书桌和冰箱，选 B。" },
      { q: "How will the woman help?", options: ["Lend him money.", "Bring a car for the move.", "Pack his clothes.", "Pay the rent."], answer: 1, explain: "女士说开哥哥的车来帮忙搬家，选 B。" }
    ]
  },
  {
    id: "long_5", type: "long", title: "长对话 · 第 5 篇 · 健康饮食", scene: "健康饮食",
    year: 2023, stars: 3,
    lines: [
      { spk: "M", en: "You look energetic lately. Any secret?", zh: "你最近看起来很有活力，有什么秘诀？" },
      { spk: "W", en: "I started cooking at home and eating more vegetables.", zh: "我开始在家做饭、多吃蔬菜了。" },
      { spk: "M", en: "Do you still eat fast food?", zh: "你还吃快餐吗？" },
      { spk: "W", en: "Only once a week now, much less than before.", zh: "现在一周只吃一次，比以前少多了。" },
      { spk: "M", en: "I should learn from you. I eat out almost every day.", zh: "我该向你学学，我几乎天天在外面吃。" },
      { spk: "W", en: "It's easy. Just cook one meal a day to begin with.", zh: "很简单，先从每天做一顿饭开始。" },
      { spk: "M", en: "Maybe I'll try this weekend. Any easy recipe?", zh: "也许我这周末试试，有简单食谱吗？" },
      { spk: "W", en: "Sure, I'll send you my tomato egg recipe. It's super fast.", zh: "有，我把番茄炒蛋的方子发你，特别快。" }
    ],
    questions: [
      { q: "What change did the woman make?", options: ["She eats more fast food.", "She cooks at home and eats more vegetables.", "She stopped eating.", "She eats out every day."], answer: 1, explain: "女士开始在家做饭、多吃蔬菜，选 B。" },
      { q: "How often does the woman eat fast food now?", options: ["Every day.", "Once a week.", "Never.", "Three times a day."], answer: 1, explain: "女士说现在一周只吃一次快餐，选 B。" },
      { q: "What will the woman send the man?", options: ["A book.", "A tomato egg recipe.", "A video game.", "A gift card."], answer: 1, explain: "女士说会把番茄炒蛋的方子发给他，选 B。" }
    ]
  },
  {
    id: "long_6", type: "long", title: "长对话 · 第 6 篇 · 兼职工作", scene: "兼职工作",
    year: 2022, stars: 3,
    lines: [
      { spk: "W", en: "How is your part-time job at the cafe?", zh: "你在咖啡馆的兼职怎么样？" },
      { spk: "M", en: "Tiring but fun. I work on weekends from 10 to 6.", zh: "累但有趣，周末十点到六点上班。" },
      { spk: "W", en: "That's a long day. Do you get paid well?", zh: "那天挺长的，工资高吗？" },
      { spk: "M", en: "Not bad, fifteen yuan an hour, plus free coffee and cake.", zh: "还行，一小时十五块，还管免费咖啡和蛋糕。" },
      { spk: "W", en: "Does it affect your study?", zh: "影响学习吗？" },
      { spk: "M", en: "A little, but I finish homework on weekday evenings.", zh: "有一点，但我工作日晚上把作业写完。" },
      { spk: "W", en: "Smart. Balance is the key.", zh: "聪明，平衡才是关键。" },
      { spk: "M", en: "Exactly. I also save some money for a bike.", zh: "正是，我还在攒钱买辆自行车。" }
    ],
    questions: [
      { q: "When does the man work at the cafe?", options: ["On weekdays.", "On weekends.", "Every evening.", "Only on holidays."], answer: 1, explain: "男士说周末（weekends）上班，选 B。" },
      { q: "How much is the man paid per hour?", options: ["Ten yuan.", "Fifteen yuan.", "Twenty yuan.", "Fifty yuan."], answer: 1, explain: "男士说一小时十五块，选 B。" },
      { q: "What does the man do with his free time for study?", options: ["He skips homework.", "He finishes homework on weekday evenings.", "He studies at the cafe.", "He never studies."], answer: 1, explain: "男士说工作日晚上把作业写完，选 B。" }
    ]
  },
  {
    id: "long_7", type: "long", title: "长对话 · 第 7 篇 · 预约看牙", scene: "就医预约",
    year: 2024, stars: 4,
    lines: [
      { spk: "W", en: "Good morning, City Dental Clinic. How can I help you?", zh: "早上好，城市牙科诊所，有什么可以帮您？" },
      { spk: "M", en: "Hi, I'd like to make an appointment with the dentist.", zh: "你好，我想预约看牙医。" },
      { spk: "W", en: "Sure. Is it for a check-up or something urgent?", zh: "好的，是例行检查还是急事？" },
      { spk: "M", en: "It's urgent. I have a terrible toothache since last night.", zh: "是急事，我从昨晚起牙就疼得厉害。" },
      { spk: "W", en: "I'm sorry to hear that. We have an opening at 3 this afternoon.", zh: "听您这么说很抱歉，今天下午三点有个空档。" },
      { spk: "M", en: "That works. Can I come a bit earlier, say 2?", zh: "可以，我能早一点吗，比如两点？" },
      { spk: "W", en: "Let me check... yes, 2 p.m. is fine. May I have your name?", zh: "我看看……两点可以。请问您的名字？" },
      { spk: "M", en: "John Smith. Thank you so much.", zh: "约翰·史密斯，太感谢了。" }
    ],
    questions: [
      { q: "Why does the man call the clinic?", options: ["For a regular check-up.", "Because of a bad toothache.", "To ask about prices.", "To cancel a visit."], answer: 1, explain: "男士说牙疼得厉害、是急事，选 B。" },
      { q: "When is the man's appointment?", options: ["At 3 p.m.", "At 2 p.m.", "At 9 a.m.", "Tomorrow."], answer: 1, explain: "诊所确认两点有空、男士接受，预约两点，选 B。" },
      { q: "What is the man's name?", options: ["John Smith.", "Tom Brown.", "Mike Lee.", "David Wang."], answer: 0, explain: "男士自报姓名 John Smith，选 A。" }
    ]
  },
  {
    id: "long_8", type: "long", title: "长对话 · 第 8 篇 · 图书馆写论文", scene: "学术写作",
    year: 2021, stars: 4,
    lines: [
      { spk: "M", en: "I'm stuck on my term paper. I can't find enough sources.", zh: "我的学期论文卡住了，找不到足够的资料。" },
      { spk: "W", en: "Have you tried the online database? It has many journals.", zh: "你试过在线数据库吗？里面有很多期刊。" },
      { spk: "M", en: "I didn't know we had access. How do I log in?", zh: "我不知道我们能访问，怎么登录？" },
      { spk: "W", en: "Use your student ID and the library password.", zh: "用你的学号和图书馆密码登录。" },
      { spk: "M", en: "Great. And how should I organize the paper?", zh: "太好了。论文我该怎么组织？" },
      { spk: "W", en: "Start with an outline: introduction, three points, and a conclusion.", zh: "先列提纲：引言、三个论点、结论。" },
      { spk: "M", en: "That makes sense. My topic is about green energy.", zh: "有道理，我的题目是关于绿色能源的。" },
      { spk: "W", en: "Perfect. Focus on solar and wind, and give real examples.", zh: "很好，聚焦太阳能和风能，举些真实例子。" }
    ],
    questions: [
      { q: "What problem does the man have?", options: ["He can't find sources.", "He hates writing.", "His computer broke.", "He missed the class."], answer: 0, explain: "男士说找不到足够资料，选 A。" },
      { q: "How does the man log into the database?", options: ["With a friend's account.", "With student ID and library password.", "By email.", "He cannot log in."], answer: 1, explain: "女士说用学号和图书馆密码登录，选 B。" },
      { q: "What is the man's paper about?", options: ["Green energy.", "Ancient history.", "Cooking.", "Sports."], answer: 0, explain: "男士说题目是关于绿色能源（green energy），选 A。" }
    ]
  },

  /* ---------------- 新闻听力（每篇 2-3 题） ---------------- */
  {
    id: "news_1", type: "news", title: "新闻听力 · 第 1 篇 · 购物中心大火", scene: "社会新闻",
    year: 2024, stars: 4,
    lines: [
      { spk: "N", en: "A big fire broke out in a shopping center in the city center last night.", zh: "昨晚市中心一家购物中心突发大火。" },
      { spk: "N", en: "More than two hundred firefighters arrived to put it out.", zh: "两百多名消防员赶到现场灭火。" },
      { spk: "N", en: "Luckily, no one was hurt in the accident.", zh: "所幸事故中无人受伤。" },
      { spk: "N", en: "The cause of the fire is still under investigation.", zh: "起火原因仍在调查中。" },
      { spk: "N", en: "The shopping center will remain closed until further notice.", zh: "该购物中心将一直关闭，直至后续通知。" }
    ],
    questions: [
      { q: "What happened in the city center last night?", options: ["A fire in a shopping center.", "A traffic accident.", "A small earthquake.", "A heavy rainstorm."], answer: 0, explain: "新闻首句点明市中心购物中心昨晚发生大火，选 A。" },
      { q: "Were there any people injured?", options: ["Yes, many were hurt.", "No one was hurt.", "Only one person.", "Unknown."], answer: 1, explain: "新闻说所幸无人受伤（no one was hurt），选 B。" }
    ]
  },
  {
    id: "news_2", type: "news", title: "新闻听力 · 第 2 篇 · 饮水研究", scene: "健康研究",
    year: 2021, stars: 3,
    lines: [
      { spk: "N", en: "Scientists say a new study shows that drinking enough water every day helps improve memory and mood.", zh: "科学家表示，一项新研究表明每天喝足够的水有助于改善记忆和情绪。" },
      { spk: "N", en: "The study followed three thousand adults for two years.", zh: "这项研究跟踪了三千名成年人，历时两年。" },
      { spk: "N", en: "Experts suggest drinking at least eight cups of water each day.", zh: "专家建议每天至少喝八杯水。" },
      { spk: "N", en: "They also warn that tea and coffee cannot replace plain water.", zh: "他们还提醒，茶和咖啡不能替代白水。" }
    ],
    questions: [
      { q: "What did the new study find?", options: ["Water helps improve memory and mood.", "Coffee is better than water.", "Sleep matters more than water.", "Exercise can replace water."], answer: 0, explain: "研究指出每天足量饮水可改善记忆与情绪，选 A。" },
      { q: "How many cups of water do experts suggest a day?", options: ["Three cups.", "Eight cups.", "Twelve cups.", "One cup."], answer: 1, explain: "专家建议每天至少八杯水，选 B。" }
    ]
  },
  {
    id: "news_3", type: "news", title: "新闻听力 · 第 3 篇 · 太空望远镜", scene: "科技 · 太空",
    year: 2023, stars: 4,
    lines: [
      { spk: "N", en: "Scientists launched a new space telescope yesterday.", zh: "科学家昨天发射了一台新的太空望远镜。" },
      { spk: "N", en: "It will help them see the farthest parts of the universe.", zh: "它将帮助人类观测宇宙最遥远的角落。" },
      { spk: "N", en: "The telescope cost about ten billion dollars and took ten years to build.", zh: "这台望远镜耗资约百亿美元，建造历时十年。" },
      { spk: "N", en: "The first pictures are expected to reach Earth next month.", zh: "首批照片预计下月传回地球。" }
    ],
    questions: [
      { q: "What did scientists launch?", options: ["A new satellite for TV.", "A new space telescope.", "A robot on Mars.", "A weather balloon."], answer: 1, explain: "新闻首句说发射了一台新太空望远镜，选 B。" },
      { q: "How long did it take to build the telescope?", options: ["Two years.", "Ten years.", "One month.", "Twenty years."], answer: 1, explain: "新闻说建造历时十年（took ten years），选 B。" },
      { q: "When will the first pictures arrive?", options: ["Next month.", "Next year.", "Tomorrow.", "In ten years."], answer: 0, explain: "新闻说首批照片预计下月传回，选 A。" }
    ]
  },
  {
    id: "news_4", type: "news", title: "新闻听力 · 第 4 篇 · 森林消失", scene: "环境 · 气候",
    year: 2022, stars: 3,
    lines: [
      { spk: "N", en: "A new report says the world's forests are disappearing faster than before.", zh: "一份新报告称全球森林正以前所未有的速度消失。" },
      { spk: "N", en: "Experts warn that this will make climate change worse.", zh: "专家警告，这将使气候变化更加严重。" },
      { spk: "N", en: "They call on every country to plant more trees.", zh: "他们呼吁各国多种树。" },
      { spk: "N", en: "Some nations have promised to stop cutting old forests by 2030.", zh: "一些国家已承诺在 2030 年前停止砍伐原始森林。" }
    ],
    questions: [
      { q: "What does the new report warn about?", options: ["Forests are disappearing faster.", "Oceans are rising slowly.", "Cities are growing smaller.", "Air is getting cleaner."], answer: 0, explain: "报告警告森林消失加快，选 A。" },
      { q: "What do experts ask countries to do?", options: ["Cut more trees.", "Plant more trees.", "Build more factories.", "Stop using water."], answer: 1, explain: "专家呼吁各国多种树（plant more trees），选 B。" }
    ]
  },
  {
    id: "news_5", type: "news", title: "新闻听力 · 第 5 篇 · 乡村图书馆", scene: "教育 · 公益",
    year: 2024, stars: 3,
    lines: [
      { spk: "N", en: "A university in the city opened a free library for children in the village.", zh: "城里一所大学为乡村儿童开办了免费图书馆。" },
      { spk: "N", en: "Over three hundred kids can now read books after school.", zh: "如今三百多名孩子放学后能在那里读书。" },
      { spk: "N", en: "The project is run by student volunteers.", zh: "该项目由学生志愿者运营。" },
      { spk: "N", en: "The university plans to open five more such libraries next year.", zh: "该校计划明年再开五所这样的图书馆。" }
    ],
    questions: [
      { q: "Who runs the free village library?", options: ["The government.", "Student volunteers.", "A company.", "Foreign teachers."], answer: 1, explain: "新闻说项目由学生志愿者运营，选 B。" },
      { q: "What will the university do next year?", options: ["Close the library.", "Open five more libraries.", "Charge money.", "Move to the city."], answer: 1, explain: "新闻说计划明年再开五所图书馆，选 B。" }
    ]
  },
  {
    id: "news_6", type: "news", title: "新闻听力 · 第 6 篇 · 河流清理", scene: "社会 · 志愿者",
    year: 2021, stars: 4,
    lines: [
      { spk: "N", en: "Last weekend, five thousand people joined a river clean-up in the park.", zh: "上周末，五千人参加了公园的河流清理活动。" },
      { spk: "N", en: "They collected more than two tons of trash.", zh: "他们清理了超过两吨的垃圾。" },
      { spk: "N", en: "Organizers say they will hold the activity every month.", zh: "组织者表示活动将每月举办一次。" },
      { spk: "N", en: "Many schools also plan to send students to help.", zh: "许多学校也计划派学生来帮忙。" }
    ],
    questions: [
      { q: "How much trash did the volunteers collect?", options: ["Two tons.", "Two kilograms.", "Five tons.", "Twenty bags."], answer: 0, explain: "新闻说收集了超过两吨垃圾，选 A。" },
      { q: "How often will the activity be held?", options: ["Every month.", "Once a year.", "Every day.", "Never again."], answer: 0, explain: "组织者说每月举办一次，选 A。" }
    ]
  },
  {
    id: "news_7", type: "news", title: "新闻听力 · 第 7 篇 · 新地铁线", scene: "城市交通",
    year: 2023, stars: 3,
    lines: [
      { spk: "N", en: "The city opened its new subway line this morning.", zh: "该市今早开通了新的地铁线路。" },
      { spk: "N", en: "The line connects the airport with the central train station.", zh: "这条线把机场和中央火车站连了起来。" },
      { spk: "N", en: "Officials say the trip now takes only twenty-five minutes.", zh: "官员表示如今这段路程只需二十五分钟。" },
      { spk: "N", en: "More than fifty thousand people rode it on the first day.", zh: "开通首日有超过五万人乘坐。" }
    ],
    questions: [
      { q: "What does the new subway line connect?", options: ["The airport and the train station.", "Two shopping malls.", "The school and the park.", "The hospital and the bank."], answer: 0, explain: "新闻说该线连接机场与中央火车站，选 A。" },
      { q: "How long does the trip take now?", options: ["One hour.", "Twenty-five minutes.", "Two days.", "Five minutes."], answer: 1, explain: "官员说如今只需二十五分钟，选 B。" },
      { q: "How many people used it on the first day?", options: ["Five thousand.", "Over fifty thousand.", "One hundred.", "None."], answer: 1, explain: "新闻说首日超五万人乘坐，选 B。" }
    ]
  },
  {
    id: "news_8", type: "news", title: "新闻听力 · 第 8 篇 · 运动会破纪录", scene: "体育新闻",
    year: 2022, stars: 3,
    lines: [
      { spk: "N", en: "A local high school student broke the city's long jump record yesterday.", zh: "一名本地高中生昨天打破了本市的跳远纪录。" },
      { spk: "N", en: "He jumped seven point two meters, the best in ten years.", zh: "他跳出了七点二米，是十年来最好成绩。" },
      { spk: "N", en: "The boy said he trains for two hours every morning.", zh: "男孩说自己每天早晨训练两小时。" },
      { spk: "N", en: "He hopes to join the national team in the future.", zh: "他希望将来能入选国家队。" }
    ],
    questions: [
      { q: "What record did the student break?", options: ["The running record.", "The long jump record.", "The swimming record.", "The high jump record."], answer: 1, explain: "新闻说打破了跳远纪录，选 B。" },
      { q: "How far did he jump?", options: ["Seven point two meters.", "Five meters.", "Ten meters.", "Two meters."], answer: 0, explain: "新闻说跳出七点二米，选 A。" },
      { q: "What is the boy's hope?", options: ["To join the national team.", "To stop training.", "To become a teacher.", "To travel abroad."], answer: 0, explain: "男孩希望将来入选国家队，选 A。" }
    ]
  },

  /* ---------------- 篇章听力（每篇 3 题） ---------------- */
  {
    id: "passage_1", type: "passage", title: "篇章听力 · 第 1 篇 · 金钱与幸福", scene: "生活感悟",
    year: 2022, stars: 3,
    lines: [
      { spk: "N", en: "Many people think that money brings happiness.", zh: "许多人认为金钱能带来幸福。" },
      { spk: "N", en: "But studies show that after basic needs are met, more money does not make people much happier.", zh: "但研究表明，基本需求被满足后，更多的钱并不会让人明显更快乐。" },
      { spk: "N", en: "Instead, good relationships with family and friends are the real key to a happy life.", zh: "相反，与家人朋友的良好关系才是幸福生活的真正关键。" },
      { spk: "N", en: "So spend more time with the people you love.", zh: "所以多花点时间陪你爱的人吧。" },
      { spk: "N", en: "A simple dinner together may mean more than an expensive gift.", zh: "一顿简单的共进晚餐，或许比昂贵的礼物更有意义。" },
      { spk: "N", en: "In the end, love, not wealth, fills our hearts.", zh: "归根结底，填满我们内心的，是爱而非财富。" }
    ],
    questions: [
      { q: "What is the real key to happiness according to the passage?", options: ["Having a lot of money.", "Good relationships.", "Fame and success.", "A high-paying job."], answer: 1, explain: "短文指出与亲友的良好关系才是幸福关键，选 B。" },
      { q: "What does the passage say about more money?", options: ["It always brings joy.", "It does not add much happiness after basic needs.", "It is useless.", "It causes problems."], answer: 1, explain: "短文说基本需求满足后，更多钱不会明显增乐，选 B。" },
      { q: "What may mean more than an expensive gift?", options: ["A simple dinner together.", "A big house.", "A new phone.", "A long trip."], answer: 0, explain: "短文说简单共进晚餐比贵重礼物更有意义，选 A。" }
    ]
  },
  {
    id: "passage_2", type: "passage", title: "篇章听力 · 第 2 篇 · 网络学习", scene: "网络学习",
    year: 2023, stars: 3,
    lines: [
      { spk: "N", en: "The Internet has changed the way we learn.", zh: "互联网改变了我们学习的方式。" },
      { spk: "N", en: "Today, students can take online courses from universities around the world without leaving home.", zh: "如今学生足不出户就能修读全球高校的在线课程。" },
      { spk: "N", en: "However, experts warn that self-control is important.", zh: "然而专家提醒，自控力很重要。" },
      { spk: "N", en: "Because it is easy to get distracted by games and videos online.", zh: "因为网上很容易被游戏和视频分散注意力。" },
      { spk: "N", en: "To learn well, make a plan and turn off notifications.", zh: "要学得好，得列计划并关掉通知。" },
      { spk: "N", en: "Online learning is a tool, not a magic solution.", zh: "在线学习是工具，而非魔法。" }
    ],
    questions: [
      { q: "What do experts warn us about?", options: ["Online courses are too difficult.", "Self-control is important online.", "The Internet is dangerous.", "Universities will soon close."], answer: 1, explain: "专家提醒网络学习中自控力很重要，选 B。" },
      { q: "What may distract students online?", options: ["Books.", "Games and videos.", "Teachers.", "Notebooks."], answer: 1, explain: "短文说容易被游戏和视频分散注意力，选 B。" },
      { q: "What advice does the passage give?", options: ["Study all night.", "Make a plan and turn off notifications.", "Quit school.", "Watch more videos."], answer: 1, explain: "短文建议列计划并关通知，选 B。" }
    ]
  },
  {
    id: "passage_3", type: "passage", title: "篇章听力 · 第 3 篇 · 时间管理", scene: "时间管理",
    year: 2024, stars: 4,
    lines: [
      { spk: "N", en: "Many students feel they never have enough time.", zh: "许多学生觉得自己时间总是不够用。" },
      { spk: "N", en: "The secret is not to work longer, but to plan better.", zh: "秘诀不是工作更久，而是计划更周全。" },
      { spk: "N", en: "Make a to-do list each morning and do the hardest task first.", zh: "每天早晨列好清单，先做最难的题。" },
      { spk: "N", en: "You will be surprised how much you can finish.", zh: "你会惊讶自己竟能完成这么多。" },
      { spk: "N", en: "Also, take short breaks to keep your mind fresh.", zh: "此外，短暂休息能让头脑保持清醒。" },
      { spk: "N", en: "Good time management is a skill anyone can learn.", zh: "好的时间管理是人人都能学会的技能。" }
    ],
    questions: [
      { q: "What is the secret of time management?", options: ["Work longer hours.", "Plan better and do hard tasks first.", "Sleep less.", "Avoid lists."], answer: 1, explain: "短文说关键是更好规划、先做难事，选 B。" },
      { q: "What should you do each morning?", options: ["Check social media.", "Make a to-do list.", "Go back to sleep.", "Call a friend."], answer: 1, explain: "短文建议每天早晨列清单，选 B。" },
      { q: "Why take short breaks?", options: ["To waste time.", "To keep the mind fresh.", "To avoid work.", "To eat more."], answer: 1, explain: "短文说短暂休息保持头脑清醒，选 B。" }
    ]
  },
  {
    id: "passage_4", type: "passage", title: "篇章听力 · 第 4 篇 · 阅读习惯", scene: "阅读习惯",
    year: 2021, stars: 3,
    lines: [
      { spk: "N", en: "Reading for just twenty minutes a day can change your life.", zh: "每天只读二十分钟书，就能改变你的生活。" },
      { spk: "N", en: "It builds vocabulary, improves focus, and reduces stress.", zh: "它能积累词汇、提升专注、缓解压力。" },
      { spk: "N", en: "You don't need a long book — start with short stories.", zh: "你不需要厚书，从短篇故事开始就好。" },
      { spk: "N", en: "The key is to read a little, but read often.", zh: "关键是读得少，但要读得勤。" },
      { spk: "N", en: "Many great readers formed the habit in childhood.", zh: "许多爱读书的人，习惯都是小时候养成的。" },
      { spk: "N", en: "It is never too late to start today.", zh: "从今天开始，永远不晚。" }
    ],
    questions: [
      { q: "How much reading a day does the passage suggest?", options: ["Two hours.", "Twenty minutes.", "One minute.", "A whole weekend."], answer: 1, explain: "短文建议每天读二十分钟，选 B。" },
      { q: "What does reading help build?", options: ["Vocabulary and focus.", "Muscle.", "Money.", "Height."], answer: 0, explain: "短文说阅读积累词汇、提升专注，选 A。" },
      { q: "What is the key to forming the habit?", options: ["Read a lot at once.", "Read a little but often.", "Buy many books.", "Read only at school."], answer: 1, explain: "短文强调读得少但要勤，选 B。" }
    ]
  },
  {
    id: "passage_5", type: "passage", title: "篇章听力 · 第 5 篇 · 环保生活", scene: "环保生活",
    year: 2022, stars: 3,
    lines: [
      { spk: "N", en: "Small daily actions can help protect the earth.", zh: "日常的小行动也能保护地球。" },
      { spk: "N", en: "Bring your own bag, turn off lights, and save water.", zh: "自带购物袋、随手关灯、节约用水。" },
      { spk: "N", en: "These habits seem tiny, but millions of people doing them matters.", zh: "这些习惯看似微小，但千万人一起做就有意义。" },
      { spk: "N", en: "A greener world starts with you.", zh: "更绿色的世界，从你我开始。" },
      { spk: "N", en: "Even choosing to walk short trips helps the air.", zh: "哪怕短途改步行，也有助于空气。" },
      { spk: "N", en: "Change begins at home, then spreads to the world.", zh: "改变始于家庭，再传向世界。" }
    ],
    questions: [
      { q: "What is the main idea of the passage?", options: ["Only big actions help.", "Small daily habits protect the earth.", "Stop using water.", "Throw away plastic."], answer: 1, explain: "短文主旨是日常小习惯能保护地球，选 B。" },
      { q: "Which action does the passage suggest?", options: ["Leave lights on.", "Bring your own bag.", "Waste water.", "Drive everywhere."], answer: 1, explain: "短文建议自带购物袋，选 B。" },
      { q: "Where does change begin according to the passage?", options: ["At home.", "In other countries.", "In the sky.", "Never."], answer: 0, explain: "短文说改变始于家庭，选 A。" }
    ]
  },
  {
    id: "passage_6", type: "passage", title: "篇章听力 · 第 6 篇 · 挫折与成长", scene: "挫折与成长",
    year: 2023, stars: 4,
    lines: [
      { spk: "N", en: "Failure is not the end, but a lesson.", zh: "失败不是终点，而是一堂课。" },
      { spk: "N", en: "Many successful people failed many times before they made it.", zh: "许多成功人士在成功前都失败过很多次。" },
      { spk: "N", en: "When you fall, stand up, learn, and try again.", zh: "跌倒了就站起来，吸取教训，再来一次。" },
      { spk: "N", en: "That is how real growth happens.", zh: "真正的成长就是这样发生的。" },
      { spk: "N", en: "A student who fails a test can study smarter next time.", zh: "考试失利的学生，下次能学得更聪明。" },
      { spk: "N", en: "So do not fear failure; fear standing still.", zh: "所以别怕失败，怕的是原地不动。" }
    ],
    questions: [
      { q: "What does the passage say about failure?", options: ["It is the end.", "It is a lesson for growth.", "It should be feared.", "It means you are lazy."], answer: 1, explain: "短文把失败视为成长的教训，选 B。" },
      { q: "What should you do when you fall?", options: ["Give up.", "Stand up, learn and try again.", "Blame others.", "Do nothing."], answer: 1, explain: "短文说跌倒了就站起来、吸取教训再来，选 B。" },
      { q: "What does the passage fear more than failure?", options: ["Standing still.", "Working hard.", "Learning.", "Trying again."], answer: 0, explain: "短文说别怕失败、怕的是原地不动，选 A。" }
    ]
  },
  {
    id: "passage_7", type: "passage", title: "篇章听力 · 第 7 篇 · 友谊与沟通", scene: "人际关系",
    year: 2024, stars: 3,
    lines: [
      { spk: "N", en: "Good friendship needs honest communication.", zh: "好的友谊需要坦诚的沟通。" },
      { spk: "N", en: "When you feel hurt, tell your friend instead of keeping quiet.", zh: "当你感到受伤，告诉朋友而不是闷在心里。" },
      { spk: "N", en: "Most misunderstandings come from guesswork, not facts.", zh: "多数误会来自猜测，而非事实。" },
      { spk: "N", en: "A short talk can fix what silence breaks.", zh: "一次简短的交谈，能修复沉默造成的裂痕。" },
      { spk: "N", en: "Also, learn to listen, not just to reply.", zh: "此外，学会倾听，而不只是等待回应。" },
      { spk: "N", en: "True friends grow by understanding each other.", zh: "真正的朋友，在互相理解中一同成长。" }
    ],
    questions: [
      { q: "What does good friendship need?", options: ["Honest communication.", "More gifts.", "Less talking.", "Keeping secrets."], answer: 0, explain: "短文说好友谊需要坦诚沟通，选 A。" },
      { q: "Where do most misunderstandings come from?", options: ["Facts.", "Guesswork.", "Travel.", "Books."], answer: 1, explain: "短文说多数误会来自猜测，选 B。" },
      { q: "What should you learn besides replying?", options: ["To listen.", "To argue.", "To leave.", "To shout."], answer: 0, explain: "短文说要学会倾听而不只是回应，选 A。" }
    ]
  },
  {
    id: "passage_8", type: "passage", title: "篇章听力 · 第 8 篇 · 早睡早起", scene: "作息健康",
    year: 2021, stars: 3,
    lines: [
      { spk: "N", en: "Early to bed and early to rise makes a man healthy.", zh: "早睡早起使人健康。" },
      { spk: "N", en: "Students who sleep well remember more in class.", zh: "睡得好的学生，课上记得更多。" },
      { spk: "N", en: "Try to put down the phone an hour before sleep.", zh: "试着在睡前一小时放下手机。" },
      { spk: "N", en: "Read a book or listen to calm music instead.", zh: "改成读书或听舒缓音乐。" },
      { spk: "N", en: "A fixed bedtime trains your body clock.", zh: "固定的睡觉时间能训练你的生物钟。" },
      { spk: "N", en: "Small sleep habits bring big daytime energy.", zh: "小小的睡眠习惯，带来白天充沛的精力。" }
    ],
    questions: [
      { q: "What helps students remember more in class?", options: ["Playing games.", "Sleeping well.", "Skipping breakfast.", "Watching TV."], answer: 1, explain: "短文说睡得好的学生课上记得更多，选 B。" },
      { q: "What should you do an hour before sleep?", options: ["Use the phone.", "Put down the phone.", "Drink coffee.", "Run fast."], answer: 1, explain: "短文建议睡前一小时放下手机，选 B。" },
      { q: "What does a fixed bedtime train?", options: ["Your body clock.", "Your phone.", "Your car.", "Your desk."], answer: 0, explain: "短文说固定睡觉时间训练生物钟，选 A。" }
    ]
  },

  /* ---------------- 泛听素材（每篇 1-2 题，拓展练习） ---------------- */
  {
    id: "feature_1", type: "feature", title: "泛听 · 睡眠与健康（VOA 慢速风）", scene: "健康科普",
    year: '', stars: 2,
    lines: [
      { spk: "N", en: "Good sleep is important for your health.", zh: "优质睡眠对健康很重要。" },
      { spk: "N", en: "Most adults need seven to eight hours of sleep each night.", zh: "多数成年人每晚需要七到八小时睡眠。" },
      { spk: "N", en: "Without enough sleep, you may feel tired and find it hard to focus.", zh: "睡眠不足会让你疲惫、难以集中注意力。" },
      { spk: "N", en: "Try to go to bed at the same time every day.", zh: "试着每天同一时间上床。" },
      { spk: "N", en: "A quiet, dark room also helps you sleep better.", zh: "安静、黑暗的房间也有助于睡得更好。" }
    ],
    questions: [
      { q: "How many hours of sleep do most adults need?", options: ["Three to four hours.", "Seven to eight hours.", "Ten to twelve hours.", "One hour."], answer: 1, explain: "短文说多数成年人需要七到八小时，选 B。" }
    ]
  },
  {
    id: "feature_2", type: "feature", title: "泛听 · 数字游民（6 Minute English 风）", scene: "生活方式",
    year: '', stars: 3,
    lines: [
      { spk: "N", en: "More and more people are becoming digital nomads.", zh: "越来越多的人成为数字游民。" },
      { spk: "N", en: "They work online and travel to different cities.", zh: "他们在线工作，去不同城市旅行。" },
      { spk: "N", en: "All they need is a laptop and good wifi.", zh: "他们只需一台笔记本和稳定 WiFi。" },
      { spk: "N", en: "It sounds free, but it also needs self-discipline.", zh: "听起来自由，但也需要自律。" },
      { spk: "N", en: "Many nomads join coworking spaces to meet others.", zh: "许多游民加入共享办公空间结识同伴。" }
    ],
    questions: [
      { q: "What do digital nomads need to work?", options: ["A big office.", "A laptop and good wifi.", "A car.", "A fixed office."], answer: 1, explain: "数字游民只需要笔记本和 WiFi，选 B。" },
      { q: "What do many nomads join?", options: ["A gym.", "Coworking spaces.", "A school.", "A hospital."], answer: 1, explain: "短文说许多游民加入共享办公空间，选 B。" }
    ]
  },
  {
    id: "feature_3", type: "feature", title: "泛听 · 睡前故事：小狐狸与星星", scene: "睡前故事",
    year: '', stars: 1,
    lines: [
      { spk: "N", en: "Once upon a time, a little fox lived in a dark forest.", zh: "从前，一只小狐狸住在黑暗的森林里。" },
      { spk: "N", en: "He was afraid of the dark, until he met a kind star.", zh: "他怕黑，直到遇见一颗善良的星星。" },
      { spk: "N", en: "The star lit his way every night.", zh: "星星每天夜晚为他照亮前路。" },
      { spk: "N", en: "They became the best of friends.", zh: "他们成了最好的朋友。" },
      { spk: "N", en: "And the fox was never afraid again.", zh: "从此小狐狸再也不害怕了。" }
    ],
    questions: [
      { q: "Who helped the little fox in the dark?", options: ["A big bear.", "A kind star.", "A wise owl.", "A small rabbit."], answer: 1, explain: "是善良的星星帮助了小狐狸，选 B。" }
    ]
  },
  {
    id: "feature_4", type: "feature", title: "泛听 · 名言朗读：关于坚持", scene: "励志名言",
    year: '', stars: 2,
    lines: [
      { spk: "N", en: "A famous saying goes: It does not matter how slowly you go, as long as you do not stop.", zh: "有句名言说：走得慢没关系，只要不停下。" },
      { spk: "N", en: "Another says: Success is the sum of small efforts repeated day in and day out.", zh: "另一句说：成功是日复一日微小努力的累积。" },
      { spk: "N", en: "Keep going, even when progress feels small.", zh: "继续前行，哪怕进步微小。" }
    ],
    questions: [
      { q: "What is the main message of the quotes?", options: ["Stop when tired.", "Keep going and never stop.", "Go as fast as possible.", "Wait for luck."], answer: 1, explain: "名言核心是坚持不放弃，选 B。" }
    ]
  },
  {
    id: "feature_5", type: "feature", title: "泛听 · 生活英语：机场值机", scene: "实用口语",
    year: '', stars: 2,
    lines: [
      { spk: "M", en: "Good morning. I'd like to check in for flight CA123 to Beijing.", zh: "早上好，我想办理去北京 CA123 航班的登机。" },
      { spk: "W", en: "Sure. May I see your passport and ticket?", zh: "好的，请出示护照和机票。" },
      { spk: "M", en: "Here you are. Do I have a window seat?", zh: "给你，我有靠窗的座位吗？" },
      { spk: "W", en: "Yes, seat 12A by the window. Have a nice flight.", zh: "有，12A 靠窗，祝你飞行愉快。" }
    ],
    questions: [
      { q: "Where is the man's seat?", options: ["By the window, 12A.", "In the middle, 5B.", "Near the door.", "In the last row."], answer: 0, explain: "值机员说座位是 12A 靠窗，选 A。" }
    ]
  },
  {
    id: "feature_6", type: "feature", title: "泛听 · TED 风：微小习惯的力量", scene: "自我提升",
    year: '', stars: 3,
    lines: [
      { spk: "N", en: "Big changes don't start big.", zh: "巨大的改变并非始于宏大。" },
      { spk: "N", en: "They start with tiny habits, done every day.", zh: "它们始于每天坚持的微小习惯。" },
      { spk: "N", en: "Read one page, walk ten minutes, write one sentence.", zh: "读一页书、走十分钟、写一句话。" },
      { spk: "N", en: "Over time, these small steps become a new you.", zh: "久而久之，这些小步会成就崭新的你。" }
    ],
    questions: [
      { q: "According to the talk, how do big changes begin?", options: ["With one huge step.", "With tiny daily habits.", "With luck.", "With money."], answer: 1, explain: "演讲说大改变始于微小日常习惯，选 B。" }
    ]
  },
  {
    id: "feature_7", type: "feature", title: "泛听 · 科普：天空为什么是蓝的", scene: "趣味科普",
    year: '', stars: 3,
    lines: [
      { spk: "N", en: "Have you ever wondered why the sky is blue?", zh: "你有没有想过，天空为什么是蓝的？" },
      { spk: "N", en: "Sunlight looks white, but it is made of many colors.", zh: "阳光看起来是白的，其实由多种颜色组成。" },
      { spk: "N", en: "Air scatters blue light more than other colors.", zh: "空气对蓝光的散射多于其他颜色。" },
      { spk: "N", en: "So when we look up, we see mostly blue.", zh: "所以我们抬头时，看到的大多是蓝色。" }
    ],
    questions: [
      { q: "Why does the sky look blue?", options: ["The sun is blue.", "Air scatters blue light more.", "Clouds are blue.", "The ocean is blue."], answer: 1, explain: "因为空气对蓝光散射更多，选 B。" }
    ]
  },
  {
    id: "feature_8", type: "feature", title: "泛听 · 文化：中国茶道", scene: "文化泛听",
    year: '', stars: 2,
    lines: [
      { spk: "N", en: "Tea is an important part of Chinese culture.", zh: "茶是中国文化的重要部分。" },
      { spk: "N", en: "Making tea is not just drinking, but a slow, calm art.", zh: "泡茶不只是喝，而是一门缓慢、宁静的艺术。" },
      { spk: "N", en: "People enjoy the smell, the taste, and the quiet time.", zh: "人们享受香气、滋味与那段安静时光。" },
      { spk: "N", en: "A cup of tea can bring friends closer.", zh: "一杯茶能让朋友更亲近。" }
    ],
    questions: [
      { q: "What is Chinese tea-making like according to the passage?", options: ["A fast drink.", "A slow and calm art.", "A kind of sport.", "A way to make money."], answer: 1, explain: "文中把泡茶描述为缓慢而宁静的艺术，选 B。" }
    ]
  },
  {
    id: "feature_9", type: "feature", title: "泛听 · 美食：一杯好咖啡", scene: "生活英语",
    year: '', stars: 2,
    lines: [
      { spk: "N", en: "Making a good cup of coffee is easier than you think.", zh: "冲一杯好咖啡比你想象的容易。" },
      { spk: "N", en: "Use fresh beans and clean, hot water.", zh: "用新鲜咖啡豆和洁净的热水。" },
      { spk: "N", en: "Let it sit for a few minutes before you drink.", zh: "喝之前让它静置几分钟。" },
      { spk: "N", en: "A slow morning cup can warm both body and mood.", zh: "清晨慢慢一杯，能温暖身体也温暖心情。" }
    ],
    questions: [
      { q: "What do you need for a good cup of coffee?", options: ["Old beans.", "Fresh beans and hot water.", "Cold milk only.", "Sugar first."], answer: 1, explain: "短文说用新鲜豆子和洁净热水，选 B。" }
    ]
  },
  {
    id: "feature_10", type: "feature", title: "泛听 · 节日：春节", scene: "文化泛听",
    year: '', stars: 2,
    lines: [
      { spk: "N", en: "The Spring Festival is the most important holiday in China.", zh: "春节是中国最重要的节日。" },
      { spk: "N", en: "Families get together for a big dinner on New Year's Eve.", zh: "除夕夜家人们聚在一起吃年夜饭。" },
      { spk: "N", en: "Children often receive red envelopes with money.", zh: "孩子们常收到压岁钱。" },
      { spk: "N", en: "People watch fireworks and wish for a good year.", zh: "人们看烟花，祈愿新的一年顺遂。" }
    ],
    questions: [
      { q: "What do children often receive at the Spring Festival?", options: ["Books.", "Red envelopes with money.", "Toys only.", "Nothing."], answer: 1, explain: "短文说孩子们常收压岁钱（red envelopes），选 B。" }
    ]
  }
];
