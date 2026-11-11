/**
 * 违规词检测脚本
 * 纯前端实现，词表可自定义，自定义词持久化到 localStorage
 */

// 抖音违禁词大全（按10大分类整理）
const BUILTIN_WORDS = [
  // 一、极限绝对化词（广告法高危）
  "最", "最佳", "最优", "最好", "最强", "最大", "最高", "最低",
  "最便宜", "最火", "最安全", "最先进", "最流行", "最舒适",
  "最全", "最新", "最便宜", "史上最低价", "全网最低价", "全网最低",
  "第一", "第一名", "排名第一", "销量第一", "全国第一", "全网第一",
  "中国第一", "世界第一", "全球第一", "唯一", "独一无二",
  "仅此一家", "一流", "NO.1", "TOP1", "首屈一指",
  "首个", "首选", "首家", "独家", "独家配方", "独家首发",
  "全球首发", "全国首家", "全网首发", "首款", "填补国内空白",
  "国家级", "世界级", "全球级", "宇宙级", "顶级", "顶尖",
  "极致", "极品", "终极", "至高", "至臻", "王牌", "领袖品牌",
  "王者", "巅峰", "天花板", "封神级", "100%", "百分百",
  "100%有效", "绝对", "永久", "万能", "完美", "无敌",
  "绝无仅有", "史无前例", "前无古人", "空前绝后", "遥遥领先",
  "领先地位", "世界领先", "国际领先", "国内领先", "行业第一",
  "首选品牌", "销量冠军", "全网销量第一", "最强", "最好用",

  // 二、医疗/养生功效词
  "治疗", "治愈", "根治", "根除", "药到病除", "消炎",
  "包治", "无效退款", "治愈率", "有效率", "祖传秘方", "秘制",
  "特效", "神效", "纯天然", "无副作用", "医疗级", "医用级",
  "抗癌", "降血压", "降血糖", "降血脂", "减肥", "瘦身",
  "丰胸", "壮阳", "延时", "增大", "增粗", "提高免疫力",
  "治疗失眠", "改善睡眠", "祛斑", "祛痘", "去皱", "抗衰",
  "抗衰老", "排毒", "清肠", "通便", "治疗便秘", "降火",
  "去火", "消炎杀菌", "抗菌", "抗病毒", "处方", "药品",
  "药妆", "药用", "医用", "医学证明", "临床验证", "药监局",
  "保健品", "保健功效", "养生", "食疗", "药膳", "秘方",
  "老中医", "中医世家", "祖传", "秘传", "古方", "偏方",
  "包治百病", "一吃就灵", "一贴见效", "立竿见影", "药到病除",
  "根治糖尿病", "根治高血压", "根治哮喘", "根治鼻炎",
  "治疗妇科", "治疗男科", "治脱发", "治白发", "治近视",

  // 三、诱导消费/虚假宣传类
  "免费送", "免费领", "免费拿", "零风险", "稳赚不赔",
  "包赚", "躺赚", "暴利", "月入过万", "日入千元",
  "中奖", "抽奖", "稳赚", "包过", "包教包会", "包就业",
  "内部渠道", "特供", "专供", "内部货", "海关罚没", "尾单",
  "秒杀", "跳楼价", "最后一天", "仅限今天", "错过再等一年",
  "限时抢购", "限时秒杀", "最后三件", "最后5件", "仅剩",
  "抢购", "疯抢", "爆抢", "手慢无", "先到先得", "抢完即止",
  "亏本甩卖", "清仓处理", "不计成本", "赔本赚吆喝",
  "假一赔十", "正品保障", "专柜正品", "官方授权", "原厂原单",
  "同款", "同款正品", "1:1复刻", "高仿", "精仿", "复刻版",
  "超低价", "超低折扣", "低至一折", "一折", "0.1折", "九块九",
  "包邮", "全国包邮", "免费试用", "免费体验", "先试用后付款",
  "无效退款", "不满意全额退款", "七天无理由退款", "退款无忧",

  // 四、金融投资类
  "投资", "理财", "基金", "股票推荐", "稳赚不赔", "保本保息", "首付",
  "高收益", "高回报", "无风险", "零风险", "日赚", "月赚",
  "年化收益", "年化利率", "复利", "杠杆", "配资", "外汇",
  "虚拟币", "比特币", "以太坊", "数字货币", "加密貨幣",
  "挖矿", "炒币", "空气币", "传销币", "资金盘", "庞氏骗局",
  "拉人头", "层级返利", "多级分销", "三级分销", "裂变",
  "躺赚", "被动收入", "管道收益", "睡后收入", "财富自由",
  "财务自由", "资产翻倍", "翻倍赚", "日入过万", "月入百万",
  "年入千万", "暴富", "一夜暴富", "快速致富", "致富秘籍",
  "内幕消息", "内部消息", "独家消息", "专家推荐", "老师带单",
  "带单", "喊单", "跟单", "代操盘", "托管", "保本保利",

  // 五、传销/分销类
  "加盟", "代理", "合伙人", "分销商", "经销商", "代理商",
  "一级代理", "二级代理", "三级代理", "总代理", "官方代理",
  "城市合伙人", "区域代理", "独家代理", "全国总代", "独家经销",
  "招募代理", "诚招代理", "诚邀加盟", "欢迎加盟", "加盟代理",
  "合伙人招募", "城市合伙人招募", "区域合伙人", "联营",
  "联营合伙人", "联营模式", "裂变模式", "分销模式", "代理模式",
  "拉人头", "发展下线", "层级奖励", "团队提成", "团队佣金",
  "团队长", "团队奖励", "裂变奖励", "推荐奖励", "推荐返利",
  "邀请有奖", "邀请好友", "邀请返利", "邀请奖励", "推广佣金",
  "推广奖励", "推广返利", "推广提成", "推广收益", "推广赚钱",

  // 六、低俗/色情暗示类
  "约炮", "一夜情", "找小姐", "上门服务", "特殊服务",
  "外围", "援交", "上门按摩", "上门理疗", "上门美容",
  "性感", "诱惑", "迷情", "催情", "春药", "壮阳药",
  "延时喷剂", "增大丸", "丰胸产品", "私处护理", "私密护理",
  "处女", "处男", "一夜情", "同城约", "附近的人",
  "美女", "帅哥", "网红美女", "女神", "撩妹", "撩汉",
  "裸聊", "裸照", "裸体", "不雅照", "艳照", "激情视频",
  "黄色", "黄片", "色情", "成人视频", "成人电影", "AV",
  "裸贷", "睡贷", "肉偿", "以身抵债", "伴游", "伴游小姐",
  "高端外围", "商务模特", "兼职模特", "平面模特", "车模",
  "女主播", "大尺度", "尺度大", "暴露", "走光", "透视装",

  // 七、赌博/博彩类
  "赌博", "博彩", "赌场", "赌场老板", "赌球", "赌马", "钱",
  "彩票", "时时彩", "六合彩", "北京赛车", "幸运飞艇",
  "百家乐", "龙虎斗", "牛牛", "炸金花", "德州扑克",
  "斗地主", "麻将", "推对子", "百家乐", "轮盘",
  "投注", "下注", "押注", "押大小", "猜大小", "猜单双",
  "返水", "返水优惠", "充值返现", "首存优惠", "注册送彩金",
  "注册送钱", "注册送红包", "免费彩金", "体验金", "试玩金",
  "提款", "取款", "存款", "充值", "提现", "出款",
  "赔率", "赔率高达", "高赔率", "高返水", "高佣金",
  "在线赌场", "网络赌博", "手机赌博", "网赌", "赌博网站",
  "赌博平台", "赌博APP", "赌博软件", "赌博群", "赌博群主",
  "带玩", "带玩群", "导师带玩", "老师带单", "专家带玩",
  "稳赢", "必中", "包中", "必赢", "稳赚", "包赢",
  "日赚千元", "日赚万元", "月入十万", "轻松赚", "躺着赚钱",

  // 八、诈骗/欺诈类
  "微信", "手机号", "VX", "vx", "加V", "加v", "加Q", "加q",
  "诈骗", "骗钱", "骗人", "骗局", "骗子", "欺诈",
  "假冒", "冒充", "伪造", "假证", "假发票", "假票据",
  "刷单", "刷信誉", "刷销量", "刷排名", "刷评价", "刷单兼职",
  "刷单返利", "刷单赚钱", "刷单平台", "刷单软件", "刷单群",
  "刷流水", "刷单任务", "垫付刷单", "先垫付后返款",
  "兼职刷单", "手机刷单", "电脑刷单", "在家刷单",
  "代刷", "代刷信誉", "代刷销量", "代刷排名", "代刷评价",
  "刷钻", "刷会员", "刷黄钻", "刷红钻", "刷蓝钻", "刷绿钻",
  "刷Q币", "刷游戏币", "刷点券", "刷钻石", "刷金币",
  "代练", "代打", "代练级", "代练账号", "代打排位",
  "解封", "解封QQ", "解封微信", "解封账号", "解封永久",
  "盗号", "盗密码", "盗QQ", "盗微信", "盗号软件", "盗号工具",
  "钓鱼", "钓鱼网站", "钓鱼链接", "钓鱼短信", "钓鱼邮件",
  "中奖信息", "中奖通知", "中奖短信", "中奖邮件", "中奖电话",
  "退税", "退税通知", "退税链接", "退税短信", "退税邮件",
  "退款", "退款链接", "退款短信", "退款电话", "退款通知",
  "解冻", "解冻账户", "解冻资金", "解冻银行卡", "解冻账号",
  "验证", "验证码", "短信验证码", "身份验证码", "银行卡验证码",

  // 九、政治敏感类
  "军", "警", "兵", "枪", "手枪", "机关枪", "步枪", "狙击枪",
  "政府", "反政府", "反华", "反共", "反党", "颠覆", "推翻",
  "分裂", "分裂国家", "台独", "藏独", "疆独", "港独",
  "法轮功", "六四", "天安门", "政治", "政治敏感",
  "领导人", "国家主席", "国务院", "党中央", "省委书记",
  "政治事件", "政治斗争", "政治改革", "政治体制", "政治制度",
  "独裁", "专制", "暴政", "反抗", "起义", "革命", "暴动",
  "游行", "示威", "抗议", "罢工", "罢课", "罢市",
  "反华势力", "境外势力", "外国势力", "西方势力", "霸权主义",
  "帝国主义", "殖民主义", "军国主义", "法西斯", "纳粹",
  "恐怖组织", "恐怖主义", "恐怖分子", "恐怖袭击", "爆炸",
  "枪击", "枪战", "武装", "武装冲突", "战争", "战乱",
  "原子弹", "核武器", "核弹", "导弹", "生化武器", "大规模杀伤",
  "间谍", "特务", "特工", "情报", "情报机构", "情报部门",
  "颠覆政权", "推翻政权", "改变政权", "政权更迭", "颜色革命",

  // 十、其他违规词
  "代开发票", "代开发票", "发票代开", "代开增值税", "代开专用发票",
  "卖发票", "卖假发票", "买发票", "买假发票", "发票买卖",
  "增值税专用发票", "增值税普通发票", "普通发票", "专用发票",
  "代缴社保", "代缴公积金", "代缴保险", "代缴个税", "代缴税",
  "办信用卡", "办卡", "信用卡办理", "信用卡申请", "信用卡代办",
  "贷款", "贷款办理", "贷款申请", "贷款代办", "无抵押贷款",
  "信用贷款", "抵押贷款", "担保贷款", "小额贷款", "民间借贷",
  "贷","高利贷", "套路贷", "校园贷", "裸贷", "佳丽贷", "美容贷",
  "套现", "信用卡套现", "花呗套现", "白条套现", "信用卡代还",
  "代还信用卡", "代还花呗", "代还白条", "养卡", "信用卡养卡",
  "POS机", "pos机", "刷卡器", "刷卡机", "信用卡机",
  "办理证件", "办证", "办毕业证", "办身份证", "办护照",
  "办驾驶证", "办营业执照", "办资格证", "办职业资格证",
  "伪造证件", "伪造公章", "伪造发票", "伪造文书", "伪造签名",
  "刻章", "刻公章", "刻财务章", "刻法人章", "刻发票专用章",
  "代办证件", "代办毕业证", "代办身份证", "代办护照", "代办驾驶证",
  "代写论文", "代写", "代写作业", "代写论文", "代写报告",
  "代写文案", "代写材料", "代写总结", "代写计划", "代写方案",
  "考试包过", "考试包过", "包过", "不过退款", "考试保过",
  "答案", "考试答案", "答案出售", "考前答案", "考后改分",
  "改分", "改成绩", "查成绩", "改分数", "成绩查询",
  "查分", "查成绩", "查分数", "查答案", "查试卷",

  // 补充：高频1-2字词，提高命中率
  "假",  "假药", "假货", "假酒", "假烟", "假表", "假包", "假鞋",
  "骗",  "骗贷", "骗保", "骗税", "骗补", "骗补贴", "骗佣金",
  "洗钱", "跑分", "卡农", "卡商", "两卡", "帮信",
  "杀猪盘", "杀猪", "养猪盘", "喂猪",
  "套贷", "骗款", "吞款",
  "赌", "毒", "枪",
];

const STORAGE_KEY = "violation-custom-words";
const ENABLED_KEY = "violation-disabled-words";

/** 获取用户自定义词 */
function loadCustomWords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/** 保存用户自定义词 */
function saveCustomWords(words) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

/** 获取被禁用的词 */
function loadDisabledWords() {
  try {
    return new Set(JSON.parse(localStorage.getItem(ENABLED_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveDisabledWords(set) {
  localStorage.setItem(ENABLED_KEY, JSON.stringify([...set]));
}

/** 当前生效的词表（去重、过滤空词） */
function getActiveWords() {
  const disabled = loadDisabledWords();
  const all = [...BUILTIN_WORDS, ...loadCustomWords()]
    .map((w) => w.trim())
    .filter((w) => w && !disabled.has(w));
  // 按长度倒序，优先匹配长词，避免短词误命中
  return [...new Set(all)].sort((a, b) => b.length - a.length);
}

/** 转义 HTML，防止注入 */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 检测文本中的违规词
 * @returns {{html: string, hits: Map<string, number>}}
 */
function detect(text) {
  const words = getActiveWords();
  const hits = new Map();

  if (!words.length || !text) {
    return { html: escapeHtml(text), hits };
  }

  // 构建正则：所有词联合匹配（已按长度倒序）
  const pattern = new RegExp(words.map(escapeRegExp).join("|"), "g");
  const result = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    // 空匹配保护（理论上不会发生，保险起见）
    if (match.index === pattern.lastIndex) {
      pattern.lastIndex++;
      continue;
    }
    result.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
    hits.set(match[0], (hits.get(match[0]) || 0) + 1);
  }

  // 拼接结果：非违禁词部分原样输出，违禁词部分用 <mark> 包裹
  let html = "";
  let pos = 0;
  for (const r of result) {
    html += escapeHtml(text.slice(pos, r.start));
    html += `<mark>${escapeHtml(r.text)}</mark>`;
    pos = r.end;
  }
  html += escapeHtml(text.slice(pos));

  return { html, hits };
}

/** 正则元字符转义 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============ DOM 交互 ============

const $ = (sel) => document.querySelector(sel);

const inputEl = $("#input");
const resultEl = $("#result");
const statusEl = $("#status");
const clearBtn = $("#clear");
const wordsListEl = $("#words-list");
const addWordInput = $("#add-word");
const addWordBtn = $("#add-word-btn");
const searchInputEl = $("#search-word");

/** 渲染检测结果 */
function render() {
  const text = inputEl.value;
  if (!text.trim()) {
    resultEl.innerHTML = '<span class="empty-hint">粘贴文案后自动检测…</span>';
    statusEl.innerHTML = "等待输入";
    return;
  }

  const { html, hits } = detect(text);
  resultEl.innerHTML = html;

  const total = [...hits.values()].reduce((a, b) => a + b, 0);
  if (total === 0) {
    statusEl.innerHTML = "检测完成 · <b>未发现违规词</b>";
  } else {
    statusEl.innerHTML = `检测完成 · 发现 <b>${total}</b> 处违规`;
  }

  // 统计面板：列出命中最多的词
  const statsEl = $("#stats");
  if (hits.size > 0) {
    const top = [...hits.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    statsEl.innerHTML = top
      .map(
        ([w, n]) =>
          `<span>「${escapeHtml(w)}」 <b>${n}</b> 次</span>`
      )
      .join("");
  } else {
    statsEl.innerHTML = "";
  }
}

/** 渲染词表标签 */
function renderWordList() {
  const disabled = loadDisabledWords();
  const custom = new Set(loadCustomWords());
  const hitWords = new Set();

  // 记录当前命中的词
  if (inputEl.value.trim()) {
    detect(inputEl.value).hits.forEach((_, w) => hitWords.add(w));
  }

  // 只显示自定义词（内置词不展示，避免词表外泄）
  const search = searchInputEl.value.trim().toLowerCase();
  const all = [...new Set(loadCustomWords())]
    .filter((w) => w.trim())
    .filter((w) => !search || w.toLowerCase().includes(search))
    .sort((a, b) => b.length - a.length);

  // 无搜索结果时显示提示
  if (search && all.length === 0) {
    wordsListEl.innerHTML = '<span class="empty-hint">未找到匹配的词</span>';
    return;
  }

  wordsListEl.innerHTML = "";
  for (const word of all) {
    const span = document.createElement("span");
    span.className = "tag";
    if (disabled.has(word)) span.classList.add("off");
    if (hitWords.has(word)) span.classList.add("hit");

    span.textContent = word;

    // 点击切换启用/禁用
    span.addEventListener("click", () => {
      if (disabled.has(word)) {
        disabled.delete(word);
      } else {
        disabled.add(word);
      }
      saveDisabledWords(disabled);
      renderWordList();
      render();
    });

    // 自定义词显示删除标记
    if (custom.has(word)) {
      const x = document.createElement("span");
      x.className = "x";
      x.textContent = "✕";
      // 点击 ✕ 直接删除（阻止冒泡，避免触发 span 的点击切换禁用）
      x.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!confirm(`删除自定义词「${word}」？`)) return;
        const list = loadCustomWords().filter((w) => w !== word);
        saveCustomWords(list);
        renderWordList();
        render();
      });
      span.appendChild(x);
    }

    wordsListEl.appendChild(span);
  }
}

/** 添加自定义词 */
function addCustomWord() {
  const raw = addWordInput.value.trim();
  if (!raw) return;
  // 支持一次输入多个词，逗号 / 顿号 / 空格分隔
  const words = raw
    .split(/[,，、\s]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const list = loadCustomWords();
  for (const w of words) {
    if (!list.includes(w)) list.push(w);
  }
  saveCustomWords(list);
  addWordInput.value = "";
  renderWordList();
  render();
}

// ============ 事件绑定 ============

let debounceTimer = null;

inputEl.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(render, 250);
});

clearBtn.addEventListener("click", () => {
  inputEl.value = "";
  render();
  inputEl.focus();
});

addWordBtn.addEventListener("click", addCustomWord);
addWordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addCustomWord();
});

// ============ 导入 / 导出 ============

const importBtn = $("#import-btn");
const exportBtn = $("#export-btn");
const importFile = $("#import-file");

/** 导出词表为 JSON 文件 */
function exportWords() {
  const data = {
    version: 1,
    builtin: BUILTIN_WORDS,
    custom: loadCustomWords(),
    disabled: [...loadDisabledWords()],
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `violation-words-${formatDate()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 从 JSON 文件导入词表 */
function importWords(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const incoming = data.custom || [];
      if (!Array.isArray(incoming)) throw new Error("格式错误");

      const list = loadCustomWords();
      let added = 0;
      for (const w of incoming) {
        if (typeof w === "string" && w.trim() && !list.includes(w.trim())) {
          list.push(w.trim());
          added++;
        }
      }
      if (added > 0) saveCustomWords(list);

      // 如果导出文件中包含禁用词记录，合并恢复
      if (Array.isArray(data.disabled)) {
        const disabled = loadDisabledWords();
        data.disabled.forEach((w) => disabled.add(w));
        saveDisabledWords(disabled);
      }

      alert(`导入完成，新增 ${added} 个词`);
      renderWordList();
      render();
    } catch {
      alert("导入失败：文件格式不正确");
    }
  };
  reader.readAsText(file);
}

/** 格式化日期 yyyy-MM-dd */
function formatDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

importBtn.addEventListener("click", () => importFile.click());
exportBtn.addEventListener("click", exportWords);
importFile.addEventListener("change", (e) => {
  if (e.target.files[0]) importWords(e.target.files[0]);
  importFile.value = "";
});

// 搜索词表
let searchDebounce = null;
searchInputEl.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(renderWordList, 200);
});

// 初始化
renderWordList();
render();
