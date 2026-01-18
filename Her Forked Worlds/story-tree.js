// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 故事数据库
const storiesDatabase = {
    1: {
        id: 1,
        title: "赛博朋克 2177",
        emoji: "🌃",
        author: "未来作家",
        progress: 51,
        chapters: [
            {
                id: 'start',
                title: '第一章：霓虹之城',
                author: '未来作家',
                type: 'start',
                views: 12300,
                likes: 2100,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `2177年，新东京。\n\n霓虹灯在雨中闪烁，李凯站在摩天大楼的顶端，俯瞰着这座永不沉睡的城市。他的义眼捕捉到了每一个细节，每一丝不寻常的波动。\n\n作为一名赛博侦探，他接到了一个奇怪的案子：有人在暗网上出售"真实记忆"。在这个虚拟与现实交织的世界里，记忆是最后的真实堡垒。\n\n"这次任务，可能会改变一切。"他低声说道，转身走向电梯。城市的命运，或许就在今夜改变...`,
                nextChapters: ['2a', '2b', '2c']
            },
            {
                id: '2a',
                title: '2A: 深入暗网',
                author: '赛博追踪者',
                type: 'branch',
                views: 8500,
                likes: 1560,
                subscribed: false,
                position: { x: 550, y: 150 },
                content: `李凯决定直接潜入暗网，追踪记忆贩卖者的踪迹...\n\n他的手指在全息键盘上飞舞，代码如瀑布般流淌。防火墙一层层被攻破，数据的海洋中，一个加密地址若隐若现。\n\n"找到你了。"李凯嘴角上扬。\n\n但就在此刻，一个陌生的信号入侵了他的系统："你不该来这里，李凯。有些真相，知道了会死的。"\n\n屏幕突然黑屏，只留下一串倒计时...\n\n这是陷阱，还是警告？`,
                nextChapters: ['3a', '3b']
            },
            {
                id: '2b',
                title: '2B: 寻找线人',
                author: '都市游侠',
                type: 'canon',
                views: 15200,
                likes: 2890,
                subscribed: false,
                position: { x: 550, y: 300 },
                content: `李凯选择了更稳妥的方式——找到他在贫民区的线人小薇...\n\n贫民区的街道狭窄而混乱，机械改造店、廉价旅馆和黑市诊所挤在一起。小薇在一家面馆里等他。\n\n"你要找的东西很危险，"小薇压低声音，"那不只是记忆交易，背后有公司的影子。"\n\n"哪家公司？"\n\n"新世界集团。他们在做记忆实验，用活人。"小薇递给他一个数据芯片，"这是我冒死偷出来的，小心点。"\n\n李凯接过芯片，感觉手心沉重。这案子，比他想象的要深得多...`,
                nextChapters: ['3c', '3d', '3e']
            },
            {
                id: '2c',
                title: '2C: 访问公司',
                author: '商业观察者',
                type: 'branch',
                views: 6700,
                likes: 1120,
                subscribed: false,
                position: { x: 550, y: 450 },
                content: `李凯决定正面接触——以咨询顾问的身份访问新世界集团...\n\n穿过豪华的大厅，他被引导到了第88层。接待他的是一位名叫艾琳娜的高管。\n\n"李先生，听说你对我们的记忆技术感兴趣？"艾琳娜微笑着，但眼神冰冷。\n\n"只是好奇，"李凯保持冷静，"听说你们能编辑记忆？"\n\n"不只是编辑，"艾琳娜走到窗边，"我们能创造全新的人生。想象一下，完美的过去，无悔的未来。"\n\n"代价呢？"\n\n"真实。"艾琳娜转身看着他，"但谁在乎呢？真实从来都不重要。"`,
                nextChapters: ['3f']
            }
        ]
    },
    2: {
        id: 2,
        title: "魔法学院编年史",
        emoji: "🏰",
        author: "魔法编年史作者",
        progress: 38,
        chapters: [
            {
                id: 'start',
                title: '第一章：入学之日',
                author: '魔法编年史作者',
                type: 'start',
                views: 9800,
                likes: 1670,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `艾莉丝站在魔法学院的大门前，手心冒汗...\n\n这座传说中的学院矗立在云端之上，浮空岛屿在晨光中闪耀。她紧握着录取通知书，那是她梦寐以求的未来。\n\n"新生？"一个声音在身后响起。\n\n艾莉丝转身，看到一个戴着眼镜的男孩。"我叫卢卡斯，也是新生。一起进去吧？"\n\n他们踏入学院大门的那一刻，魔法的气息扑面而来。大厅的穹顶上，星空在流转；地面的符文在发光。\n\n"欢迎来到阿卡迪亚魔法学院，"院长的声音在空中回荡，"你们的旅程，从今天开始..."`,
                nextChapters: ['2a', '2b']
            },
            {
                id: '2a',
                title: '2A: 分院仪式',
                author: '魔法学徒',
                type: 'canon',
                views: 8200,
                likes: 1580,
                subscribed: false,
                position: { x: 600, y: 200 },
                content: `分院仪式即将开始。艾莉丝紧张地看着那本古老的魔法书...\n\n"当书页翻开，你的本质将被看穿，"院长说道，"火、水、风、土，或是罕见的光与暗。"\n\n轮到艾莉丝时，她的手碰触到书页。瞬间，整个大厅被银白色的光芒包围。\n\n"不可能..."院长低声说道，"星辰之力？这已经一千年没有出现过了！"\n\n所有人都看向艾莉丝，眼神中有敬畏，也有恐惧。\n\n她不知道，这份力量将把她带向何方...`,
                nextChapters: ['3a', '3b']
            },
            {
                id: '2b',
                title: '2B: 图书馆探秘',
                author: '知识追寻者',
                type: 'branch',
                views: 5600,
                likes: 980,
                subscribed: false,
                position: { x: 600, y: 400 },
                content: `艾莉丝跟随卢卡斯来到了禁忌图书馆的入口...\n\n"据说这里藏着学院最危险的魔法书，"卢卡斯低声说，"但也是最强大的知识宝库。"\n\n他们溜进了图书馆。无数的书架延伸到视线的尽头，古老的魔法在空气中流动。\n\n艾莉丝被一本泛着微光的书吸引了。她打开它——\n\n突然，黑暗降临。一个声音在她脑海中响起："你终于来了，命运之子..."`,
                nextChapters: ['3c']
            }
        ]
    },
    3: {
        id: 3,
        title: "星际殖民纪元",
        emoji: "🚀",
        author: "星际航海家",
        progress: 25,
        chapters: [
            {
                id: 'start',
                title: '第一章：起航',
                author: '星际航海家',
                type: 'start',
                views: 15600,
                likes: 2340,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `公元2389年，人类第一艘殖民飞船"新希望号"准备起航...\n\n林舰长站在舰桥上，看着窗外的地球。这将是他最后一次看到母星了。\n\n"10万名殖民者已经全部进入冷冻舱，"副手报告道，"目标星系距离127光年，预计航程200年。"\n\n林舰长深吸一口气："启动曲速引擎。"\n\n引擎轰鸣，飞船开始加速。当速度超过光速时，整个宇宙仿佛在扭曲。\n\n人类的第二个家园，在遥远的星辰之间等待着他们...`,
                nextChapters: ['2a', '2b', '2c']
            }
        ]
    },
    4: {
        id: 4,
        title: "午后玫瑰",
        emoji: "🌹",
        author: "海大人",
        progress: 51,
        chapters: [
            {
                id: 'start',
                title: '午后玫瑰',
                author: '海大人',
                type: 'start',
                views: 12300,
                likes: 2100,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `玫瑰在下午开放\n没有询问任何意义\n乌鸦死在路边\n黑色保持完整\n世界继续向前\n\n这首诗写于一个普通的午后，阳光斜射进咖啡厅的玻璃窗。我看着窗外的玫瑰花园，突然想到生命的意义或许不需要被询问，它只是存在着，如同那朵在午后静静开放的玫瑰。\n\n而死亡，也如那只路边的乌鸦，黑色而完整，不需要解释，不需要同情。世界依然向前，时间依然流淌，我们在其中寻找着属于自己的诗意。\n\n这就是我想要表达的——在这个快速变化的世界里，保持内心的宁静与完整，如玫瑰般绽放，如乌鸦般坦然。`,
                nextChapters: ['branch1', 'branch2']
            },
            {
                id: 'branch1',
                title: '黑色乌鸦',
                author: '暗夜诗者',
                type: 'branch',
                views: 8500,
                likes: 856,
                subscribed: false,
                position: { x: 600, y: 150 },
                content: `乌鸦死在路边\n黑色保持完整\n\n我想象着那只乌鸦\n在生命的最后一刻\n是否还记得飞翔的感觉\n是否还眷恋着天空的蓝\n\n黑色是最诚实的颜色\n它不掩饰，不伪装\n如同死亡本身\n干净而彻底\n\n路边的行人匆匆走过\n没有人为它停留\n但我知道\n它的黑色将永远完整\n在这个不完整的世界里\n\n这是对原诗中"乌鸦死在路边，黑色保持完整"的深度展开，探讨死亡的尊严与完整性。`,
                nextChapters: ['branch3', 'branch4']
            },
            {
                id: 'branch2',
                title: '世界向前',
                author: '时光织者',
                type: 'canon',
                views: 15200,
                likes: 2100,
                subscribed: false,
                position: { x: 600, y: 350 },
                content: `世界继续向前\n带着玫瑰的芬芳\n带着乌鸦的沉默\n带着我们所有的\n爱与失去\n\n时间是最好的诗人\n它写下每一个瞬间\n然后轻轻翻页\n留下淡淡的墨香\n\n我们在这首诗里\n有时是玫瑰\n有时是乌鸦\n有时只是\n路过的风\n\n但无论如何\n世界都会向前\n我们的故事\n也会继续\n\n这个分支延续了原诗的时间主题，将"世界继续向前"作为核心意象，探讨在时间流逝中的存在意义。`,
                nextChapters: ['branch5', 'branch6']
            },
            {
                id: 'branch3',
                title: '时间停滞',
                author: '时间诗人',
                type: 'branch',
                views: 6700,
                likes: 1234,
                subscribed: false,
                position: { x: 1000, y: 80 },
                content: `如果时间停止流动\n玫瑰会永远绽放\n乌鸦不会死去\n世界也不必向前\n\n但那还是玫瑰吗？\n还是乌鸦吗？\n还是我们熟悉的世界吗？\n\n也许，正是因为会凋零\n玫瑰才如此美丽\n正是因为会死亡\n生命才如此珍贵`,
                nextChapters: []
            },
            {
                id: 'branch4',
                title: '无声询问',
                author: '静默观者',
                type: 'branch',
                views: 5200,
                likes: 987,
                subscribed: false,
                position: { x: 1000, y: 220 },
                content: `没有询问任何意义\n这句话本身\n就是最深的询问\n\n玫瑰为什么要开放？\n乌鸦为什么要死去？\n我们为什么要存在？\n\n但也许\n问题的答案\n就在问题本身\n\n不询问\n就是最好的答案`,
                nextChapters: []
            },
            {
                id: 'branch5',
                title: '玫瑰凋零',
                author: '花语诗人',
                type: 'branch',
                views: 7800,
                likes: 1456,
                subscribed: false,
                position: { x: 1000, y: 280 },
                content: `玫瑰终会凋零\n就像午后终会结束\n阳光会黯淡\n诗意会消散\n\n但在凋零之前\n它绽放过\n它美丽过\n它存在过\n\n这就足够了`,
                nextChapters: ['branch7']
            },
            {
                id: 'branch6',
                title: '新的开始',
                author: '希望之光',
                type: 'branch',
                views: 4100,
                likes: 892,
                subscribed: false,
                position: { x: 1000, y: 420 },
                content: `世界向前\n意味着新的可能\n\n每一个结束\n都是新的开始\n玫瑰凋零后\n会有新的花朵\n\n这是希望的意义`,
                nextChapters: []
            },
            {
                id: 'branch7',
                title: '循环往复',
                author: '轮回诗者',
                type: 'branch',
                views: 3900,
                likes: 756,
                subscribed: false,
                position: { x: 1350, y: 280 },
                content: `玫瑰开了又谢\n谢了又开\n乌鸦死了\n新的乌鸦飞来\n\n世界就这样\n周而复始\n循环往复\n\n永恒存在于\n这无尽的轮回中`,
                nextChapters: []
            }
        ]
    },
    5: {
        id: 5,
        title: "都市修仙录",
        emoji: "⚡",
        author: "修仙者",
        progress: 45,
        chapters: [
            {
                id: 'start',
                title: '第一章：灵气复苏',
                author: '修仙者',
                type: 'start',
                views: 15600,
                likes: 2340,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `2025年，地球灵气突然复苏。\n\n作为一名普通上班族的林枫，在下班路上突然感受到了天地间游离的灵气。凭借从网络小说中学来的知识，他开始尝试修炼...\n\n这是一个现代都市与修仙世界碰撞的故事。高楼大厦之间，隐藏着古老的修仙门派；地铁站里，可能遇见千年前的修士。\n\n新的时代，即将开启。`,
                nextChapters: []
            }
        ]
    },
    6: {
        id: 6,
        title: "武侠新世界",
        emoji: "🗡️",
        author: "江湖游侠",
        progress: 38,
        chapters: [
            {
                id: 'start',
                title: '第一章：初入江湖',
                author: '江湖游侠',
                type: 'start',
                views: 12800,
                likes: 1950,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `大明永乐年间，江湖风起云涌。\n\n少年萧云从小在山村长大，直到十六岁那年，一位白衣剑客路过村庄，改变了他的命运。\n\n"孩子，你可愿随我学剑？"剑客问道。\n\n萧云看着剑客背后的长剑，眼中闪烁着向往的光芒。他不知道，这个决定将把他带入一个充满恩怨情仇的江湖世界。\n\n刀光剑影，快意恩仇，这就是江湖。`,
                nextChapters: []
            }
        ]
    },
    7: {
        id: 7,
        title: "时空旅行者",
        emoji: "⏰",
        author: "时间行者",
        progress: 42,
        chapters: [
            {
                id: 'start',
                title: '第一章：第一次跳跃',
                author: '时间行者',
                type: 'start',
                views: 18900,
                likes: 2670,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: `2156年，人类终于发明了时间旅行技术。\n\n作为第一批时空旅行者之一，艾米莉的任务是观察历史，绝不干涉。但当她目睹一场即将发生的灾难时，她面临着选择：\n\n遵守规则，让历史按原定轨迹发展？还是冒着改变时间线的风险，拯救无辜的生命？\n\n"每一个选择，都会创造一个新的时间线，"她的导师曾这样告诫她。\n\n但此刻，艾米莉的手已经伸向了时空控制器...`,
                nextChapters: []
            }
        ]
    }
};

// 当前故事数据
let currentStory = null;
let currentChapter = null;
let userInteractions = {
    subscribed: {},
    liked: {}
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    const storyId = parseInt(getUrlParameter('id')) || 1;
    loadStoriesFromLocalStorage();
    loadStory(storyId);
    initializeEventListeners();
});

// 从localStorage加载新创建的故事
function loadStoriesFromLocalStorage() {
    try {
        const savedStories = localStorage.getItem('storiesDatabase');
        if (savedStories) {
            const parsedStories = JSON.parse(savedStories);
            // 合并localStorage中的故事到storiesDatabase
            Object.keys(parsedStories).forEach(key => {
                storiesDatabase[key] = parsedStories[key];
            });
            console.log('已从localStorage加载新故事');
        }
    } catch (error) {
        console.error('从localStorage加载故事失败:', error);
    }
}

// 更新故事统计信息
function updateStoryStats() {
    if (!currentStory) return;

    // 计算参与者数量（去重的作者）
    const authors = new Set();
    currentStory.chapters.forEach(chapter => {
        authors.add(chapter.author);
    });
    const participantsCount = authors.size;

    // 章节总数
    const chaptersCount = currentStory.chapters.length;

    // 总阅读量
    const totalViews = currentStory.chapters.reduce((sum, chapter) => sum + chapter.views, 0);

    // 总收益（基于阅读量和点赞数的简单计算）
    const totalRevenue = (totalViews * 0.00001 + currentStory.chapters.reduce((sum, ch) => sum + ch.likes, 0) * 0.0001).toFixed(4);

    // 更新页面显示
    document.getElementById('participantsCount').textContent = participantsCount;
    document.getElementById('chaptersCount').textContent = chaptersCount;
    document.getElementById('totalViews').textContent = formatNumber(totalViews);
    document.getElementById('totalRevenue').textContent = totalRevenue + ' ETH';
}

// 加载故事
function loadStory(storyId) {
    currentStory = storiesDatabase[storyId];

    if (!currentStory) {
        alert('故事不存在！');
        window.location.href = './universe-hub/universe-hub.html';
        return;
    }

    // 更新页面标题
    document.getElementById('storyTitle').textContent = `${currentStory.emoji} ${currentStory.title}`;
    document.title = `${currentStory.title} - 故事流程图`;

    // 更新作者信息
    if (currentStory.author) {
        const authorInfoElement = document.getElementById('storyAuthorInfo');
        const authorAvatarElement = document.getElementById('storyAuthorAvatar');
        const authorNameElement = document.getElementById('storyAuthorName');

        authorAvatarElement.textContent = currentStory.author.charAt(0);
        authorNameElement.textContent = currentStory.author;
        authorInfoElement.style.display = 'flex';
    }

    // 更新统计信息
    updateStoryStats();

    // 渲染节点
    renderNodes();

    // 绘制连接线
    setTimeout(drawConnections, 100);
}

// 渲染节点
function renderNodes() {
    const container = document.getElementById('nodesContainer');
    container.innerHTML = '';

    currentStory.chapters.forEach(chapter => {
        const node = createNodeElement(chapter);
        container.appendChild(node);
    });
}

// 创建节点元素
function createNodeElement(chapter) {
    const node = document.createElement('div');
    node.className = 'story-node';
    node.dataset.chapterId = chapter.id;

    // 添加tooltip的data-title属性
    node.dataset.title = chapter.title;

    // 添加类型样式
    if (chapter.type === 'start') {
        node.classList.add('start-node');
    } else if (chapter.type === 'canon') {
        node.classList.add('canon-node');
    }

    // 设置位置
    node.style.left = chapter.position.x + 'px';
    node.style.top = chapter.position.y + 'px';

    // 设置内容（圆点）
    node.innerHTML = `
        <div class="node-content">
            <div class="node-title">${chapter.title}</div>
            <div class="node-author">${chapter.author}</div>
            <div class="node-views">👁️ ${formatNumber(chapter.views)}</div>
            ${chapter.type === 'canon' ? '<div class="canon-badge">正史</div>' : ''}
        </div>
    `;

    // 添加点击事件
    node.addEventListener('click', () => openChapterCard(chapter));

    return node;
}

// 绘制连接线 - 树枝效果（贝塞尔曲线）
function drawConnections() {
    const svg = document.getElementById('connectionSvg');
    svg.innerHTML = '';

    currentStory.chapters.forEach(chapter => {
        if (chapter.nextChapters && chapter.nextChapters.length > 0) {
            // 直接使用章节数据中的位置（这才是真正的中心位置）
            const parentX = chapter.position.x;
            const parentY = chapter.position.y;

            chapter.nextChapters.forEach(childId => {
                // 找到子章节数据
                const childChapter = currentStory.chapters.find(ch => ch.id === childId);
                if (!childChapter) return;

                const childX = childChapter.position.x;
                const childY = childChapter.position.y;

                // 计算贝塞尔曲线控制点（创造树枝生长效果）
                const dx = childX - parentX;
                const dy = childY - parentY;

                // 使用两个控制点创造自然的曲线
                const cp1x = parentX + dx * 0.3;
                const cp1y = parentY;
                const cp2x = parentX + dx * 0.7;
                const cp2y = childY;

                // 创建SVG路径（贝塞尔曲线）
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const pathData = `M ${parentX} ${parentY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${childX} ${childY}`;
                path.setAttribute('d', pathData);

                // 根据子章节类型设置颜色并添加class
                const childNode = document.querySelector(`[data-chapter-id="${childId}"]`);
                if (childNode && childNode.classList.contains('canon-node')) {
                    path.classList.add('canon-path'); // 添加canon-path class用于发光动画
                } else if (childChapter.type === 'start') {
                    path.setAttribute('stroke', 'rgba(236, 72, 153, 0.5)'); // 粉色 for Start
                } else {
                    path.setAttribute('stroke', 'rgba(139, 92, 246, 0.4)'); // 默认紫色
                }

                svg.appendChild(path);
            });
        }
    });
}

// 初始化事件监听
function initializeEventListeners() {
    // 窗口大小改变时重绘连接线
    window.addEventListener('resize', () => {
        setTimeout(drawConnections, 100);
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// 打开章节卡片
function openChapterCard(chapter) {
    currentChapter = chapter;

    // 更新章节信息
    document.getElementById('chapterTitle').textContent = chapter.title;

    // 更新作者信息（带头像和可点击）
    const authorElement = document.getElementById('chapterAuthor');
    const authorAvatar = chapter.author.charAt(0); // 取作者名字的第一个字作为头像
    authorElement.innerHTML = `
        <div class="author-section" onclick="showAuthorCard('${chapter.author}')">
            <div class="author-avatar">${authorAvatar}</div>
            <span class="author-name">${chapter.author}</span>
        </div>
    `;

    document.getElementById('chapterStats').textContent = `👁️ ${formatNumber(chapter.views)} 阅读 · 🍃 ${formatNumber(chapter.likes)} 点赞`;

    // 显示简介（内容的前200字）
    const preview = chapter.content.substring(0, 200) + '...';
    document.getElementById('chapterPreview').textContent = preview;

    // 更新点赞数
    document.getElementById('likeCount').textContent = formatNumber(chapter.likes);

    // 更新订阅和点赞状态
    const subscribeBtn = document.getElementById('subscribeBtn');
    const likeBtn = document.getElementById('likeBtn');

    if (userInteractions.subscribed[chapter.id]) {
        subscribeBtn.classList.add('subscribed');
        subscribeBtn.querySelector('.btn-text').textContent = '已订阅';
    } else {
        subscribeBtn.classList.remove('subscribed');
        subscribeBtn.querySelector('.btn-text').textContent = '订阅';
    }

    if (userInteractions.liked[chapter.id]) {
        likeBtn.classList.add('liked');
    } else {
        likeBtn.classList.remove('liked');
    }

    // 显示模态框
    document.getElementById('chapterModal').style.display = 'block';
}

// 关闭章节卡片
function closeChapterModal() {
    document.getElementById('chapterModal').style.display = 'none';
}

// 切换订阅
function toggleSubscribe() {
    if (!currentChapter) return;

    const btn = document.getElementById('subscribeBtn');
    const isSubscribed = userInteractions.subscribed[currentChapter.id];

    if (isSubscribed) {
        delete userInteractions.subscribed[currentChapter.id];
        btn.classList.remove('subscribed');
        btn.querySelector('.btn-text').textContent = '订阅';
        showNotification('已取消订阅', 'info');
    } else {
        userInteractions.subscribed[currentChapter.id] = true;
        btn.classList.add('subscribed');
        btn.querySelector('.btn-text').textContent = '已订阅';
        showNotification('订阅成功！⭐', 'success');
    }
}

// 显示全文
function showFullContent() {
    if (!currentChapter) return;

    document.getElementById('readTitle').textContent = currentChapter.title;
    document.getElementById('fullContent').textContent = currentChapter.content;

    document.getElementById('readModal').style.display = 'block';
}

// 关闭阅读弹窗
function closeReadModal() {
    document.getElementById('readModal').style.display = 'none';
}

// 切换点赞
function toggleLike() {
    if (!currentChapter) return;

    const btn = document.getElementById('likeBtn');
    const likeCountElem = document.getElementById('likeCount');
    const isLiked = userInteractions.liked[currentChapter.id];

    if (isLiked) {
        delete userInteractions.liked[currentChapter.id];
        btn.classList.remove('liked');
        currentChapter.likes--;
        showNotification('已取消点赞', 'info');
    } else {
        userInteractions.liked[currentChapter.id] = true;
        btn.classList.add('liked');
        currentChapter.likes++;
        showNotification('点赞成功！🍃', 'success');
    }

    likeCountElem.textContent = formatNumber(currentChapter.likes);
    document.getElementById('chapterStats').textContent = `👁️ ${formatNumber(currentChapter.views)} 阅读 · 🍃 ${formatNumber(currentChapter.likes)} 点赞`;
}

// 显示续写弹窗
function showWriteModal() {
    document.getElementById('writeModal').style.display = 'block';

    // 清空表单
    document.getElementById('writeTitle').value = '';
    document.getElementById('writeTags').value = '';
    document.getElementById('writeContent').value = '';
}

// 关闭续写弹窗
function closeWriteModal() {
    document.getElementById('writeModal').style.display = 'none';
}

// 提交章节
function submitChapter() {
    const title = document.getElementById('writeTitle').value.trim();
    const tags = document.getElementById('writeTags').value.trim();
    const content = document.getElementById('writeContent').value.trim();

    if (!title || !content) {
        showNotification('请填写标题和内容！', 'error');
        return;
    }

    // 模拟提交
    showNotification('正在提交章节...', 'info');

    setTimeout(() => {
        // 生成新章节ID
        const newChapterId = generateNewChapterId();

        // 计算新节点位置（从父节点延伸）
        const newPosition = calculateNewNodePosition(currentChapter);

        // 创建新章节对象
        const newChapter = {
            id: newChapterId,
            title: title,
            author: '当前用户', // 可以从登录信息获取
            type: 'branch',
            views: 0,
            likes: 0,
            subscribed: false,
            position: newPosition,
            content: content,
            nextChapters: []
        };

        // 添加到当前故事的章节列表
        currentStory.chapters.push(newChapter);

        // 将新章节ID添加到父章节的nextChapters数组
        if (!currentChapter.nextChapters) {
            currentChapter.nextChapters = [];
        }
        currentChapter.nextChapters.push(newChapterId);

        // 更新storiesDatabase
        storiesDatabase[currentStory.id] = currentStory;

        // 保存到localStorage
        saveStoriesToLocalStorage();

        // 重新渲染节点和连接线
        renderNodes();
        setTimeout(drawConnections, 100);

        showNotification('章节提交成功！新分支已添加到故事树中 🎉', 'success');
        closeWriteModal();
        closeChapterModal();

        console.log('新章节已添加：', newChapter);
    }, 1500);
}

// 生成新的章节ID
function generateNewChapterId() {
    const existingIds = currentStory.chapters.map(ch => ch.id);
    let counter = 1;
    let newId = `chapter${counter}`;

    while (existingIds.includes(newId)) {
        counter++;
        newId = `chapter${counter}`;
    }

    return newId;
}

// 计算新节点位置
function calculateNewNodePosition(parentChapter) {
    // 获取父节点的位置
    const parentX = parentChapter.position.x;
    const parentY = parentChapter.position.y;

    // 计算当前父节点已有的子节点数量
    const siblingsCount = parentChapter.nextChapters ? parentChapter.nextChapters.length : 0;

    // 新节点水平方向延伸400-450像素
    const newX = parentX + 450;

    // 垂直方向：根据兄弟节点数量进行分布
    // 第一个子节点在正上方，后续节点依次向下
    const verticalSpacing = 150; // 每个分支之间的垂直间距
    const newY = parentY + (siblingsCount - 1) * verticalSpacing;

    return { x: newX, y: newY };
}

// 保存故事数据到localStorage
function saveStoriesToLocalStorage() {
    try {
        const savedStories = JSON.parse(localStorage.getItem('storiesDatabase') || '{}');
        savedStories[currentStory.id] = currentStory;
        localStorage.setItem('storiesDatabase', JSON.stringify(savedStories));
        console.log('故事数据已保存到localStorage');
    } catch (error) {
        console.error('保存到localStorage失败:', error);
    }
}

// 显示下一章列表
function showNextChapters() {
    if (!currentChapter || !currentChapter.nextChapters || currentChapter.nextChapters.length === 0) {
        showNotification('这是最新章节，暂无后续内容', 'info');
        return;
    }

    const listContainer = document.getElementById('nextChaptersList');
    listContainer.innerHTML = '';

    // 获取下一章节数据并按点赞数排序
    const nextChapters = currentChapter.nextChapters
        .map(id => currentStory.chapters.find(ch => ch.id === id))
        .filter(ch => ch !== undefined)
        .sort((a, b) => b.likes - a.likes);

    // 渲染列表
    nextChapters.forEach(chapter => {
        const item = document.createElement('div');
        item.className = 'next-chapter-item';
        item.innerHTML = `
            <div class="next-chapter-header">
                <div class="next-chapter-title">${chapter.title}</div>
                <div class="next-chapter-likes">🍃 ${formatNumber(chapter.likes)}</div>
            </div>
            <div class="next-chapter-author">作者：${chapter.author}</div>
        `;

        item.addEventListener('click', () => {
            closeNextModal();
            closeChapterModal();
            openChapterCard(chapter);
        });

        listContainer.appendChild(item);
    });

    document.getElementById('nextModal').style.display = 'block';
}

// 关闭下一章列表
function closeNextModal() {
    document.getElementById('nextModal').style.display = 'none';
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;

    let bgColor;
    switch(type) {
        case 'success':
            bgColor = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            break;
        case 'error':
            bgColor = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            break;
        case 'warning':
            bgColor = 'linear-gradient(135deg, #f39c12, #e67e22)';
            break;
        default:
            bgColor = 'linear-gradient(135deg, #3498db, #2980b9)';
    }

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 300px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 作者信息数据库（模拟）
const authorsDatabase = {
    '未来作家': {
        bio: '擅长科幻题材创作，致力于探索未来世界的无限可能。'
    },
    '赛博追踪者': {
        bio: '热爱赛博朋克风格，专注于暗网与黑客文化的描绘。'
    },
    '都市游侠': {
        bio: '善于刻画都市中的边缘人物，文字充满人文关怀。'
    },
    '商业观察者': {
        bio: '关注商业与科技的交汇，擅长商业推理题材。'
    },
    '魔法编年史作者': {
        bio: '奇幻文学爱好者，创造充满魔法的幻想世界。'
    },
    '魔法学徒': {
        bio: '年轻的魔法世界探索者，想象力丰富。'
    },
    '知识追寻者': {
        bio: '相信知识改变命运，喜欢在故事中融入哲学思考。'
    },
    '星际航海家': {
        bio: '太空歌剧的忠实粉丝，梦想着星辰大海。'
    },
    '海大人': {
        bio: '诗歌创作者，用文字捕捉生活中的诗意瞬间。'
    },
    '暗夜诗者': {
        bio: '在黑暗中寻找光明，用诗歌探讨生死哲学。'
    },
    '时光织者': {
        bio: '时间是永恒的主题，用文字编织时光的故事。'
    },
    '当前用户': {
        bio: '正在探索叙事的无限可能，与大家一起创造精彩故事。'
    }
};

// 用户关注状态（使用localStorage持久化）
let followedAuthors = JSON.parse(localStorage.getItem('followedAuthors') || '[]');

// 显示作者卡片
function showAuthorCard(authorName) {
    const modal = document.getElementById('authorModal');
    const avatarElement = document.getElementById('authorCardAvatar');
    const nameElement = document.getElementById('authorCardName');
    const bioElement = document.getElementById('authorCardBio');
    const followBtn = document.getElementById('followBtn');

    // 设置作者信息
    avatarElement.textContent = authorName.charAt(0);
    nameElement.textContent = authorName;

    // 设置作者简介
    const authorInfo = authorsDatabase[authorName];
    bioElement.textContent = authorInfo ? authorInfo.bio : '这位作者很神秘，暂未留下任何简介。';

    // 设置关注按钮状态
    const isFollowing = followedAuthors.includes(authorName);
    if (isFollowing) {
        followBtn.classList.add('following');
        followBtn.querySelector('.btn-text').textContent = '已关注';
        followBtn.querySelector('.btn-icon').textContent = '✓';
    } else {
        followBtn.classList.remove('following');
        followBtn.querySelector('.btn-text').textContent = '关注';
        followBtn.querySelector('.btn-icon').textContent = '➕';
    }

    // 保存当前作者名到按钮数据属性
    followBtn.dataset.authorName = authorName;

    // 显示弹窗
    modal.style.display = 'block';
}

// 关闭作者卡片
function closeAuthorModal() {
    document.getElementById('authorModal').style.display = 'none';
}

// 切换关注状态
function toggleFollow() {
    const followBtn = document.getElementById('followBtn');
    const authorName = followBtn.dataset.authorName;

    const isFollowing = followedAuthors.includes(authorName);

    if (isFollowing) {
        // 取消关注
        followedAuthors = followedAuthors.filter(name => name !== authorName);
        followBtn.classList.remove('following');
        followBtn.querySelector('.btn-text').textContent = '关注';
        followBtn.querySelector('.btn-icon').textContent = '➕';
        showNotification(`已取消关注 ${authorName}`, 'info');
    } else {
        // 关注
        followedAuthors.push(authorName);
        followBtn.classList.add('following');
        followBtn.querySelector('.btn-text').textContent = '已关注';
        followBtn.querySelector('.btn-icon').textContent = '✓';
        showNotification(`已关注 ${authorName} ⭐`, 'success');
    }

    // 保存到localStorage
    localStorage.setItem('followedAuthors', JSON.stringify(followedAuthors));
}

// 显示故事作者卡片
function showStoryAuthorCard() {
    if (!currentStory || !currentStory.author) {
        return;
    }
    showAuthorCard(currentStory.author);
}
