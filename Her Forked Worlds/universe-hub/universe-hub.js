// 默认数据
const defaultUniverseData = [
    {
        id: 4,
        title: "午后玫瑰",
        tags: ["诗歌", "哲思", "意象"],
        progress: "正在分叉：第 1 章 · 7 个分支",
        lastUpdate: "刚刚",
        participants: 89,
        branches: 7,
        status: "live",
        emoji: "🌹"
    },
    {
        id: 1,
        title: "赛博朋克 2177",
        tags: ["Cyberpunk", "Sci-fi", "Dystopia"],
        progress: "正在分叉：第 4 章 · 8 个候选分支",
        lastUpdate: "2小时前",
        participants: 156,
        branches: 23,
        status: "live",
        emoji: "🌃"
    },
    {
        id: 2,
        title: "魔法学院编年史",
        tags: ["Fantasy", "Magic", "Academy"],
        progress: "第 7 章已完成 · 等待新的分叉提案",
        lastUpdate: "1天前",
        participants: 89,
        branches: 15,
        status: "active",
        emoji: "🏰"
    },
    {
        id: 3,
        title: "星际殖民纪元",
        tags: ["Space Opera", "Sci-fi", "Exploration"],
        progress: "正在分叉：第 2 章 · 12 个候选分支",
        lastUpdate: "30分钟前",
        participants: 234,
        branches: 31,
        status: "live",
        emoji: "🚀"
    },
    {
        id: 5,
        title: "都市修仙录",
        tags: ["修仙", "现代", "都市"],
        progress: "第 3 章已完成 · 等待新的分叉提案",
        lastUpdate: "3小时前",
        participants: 127,
        branches: 18,
        status: "active",
        emoji: "⚡"
    },
    {
        id: 6,
        title: "武侠新世界",
        tags: ["武侠", "江湖", "传说"],
        progress: "正在分叉：第 5 章 · 6 个候选分支",
        lastUpdate: "5小时前",
        participants: 103,
        branches: 12,
        status: "active",
        emoji: "🗡️"
    },
    {
        id: 7,
        title: "时空旅行者",
        tags: ["穿越", "科幻", "冒险"],
        progress: "第 2 章已完成 · 等待新的分叉提案",
        lastUpdate: "1天前",
        participants: 145,
        branches: 9,
        status: "active",
        emoji: "⏰"
    }
];

// 从localStorage加载宇宙数据，如果不存在则使用默认数据
function loadUniverseData() {
    try {
        const saved = localStorage.getItem('universeData');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('加载宇宙数据失败:', error);
    }
    // 如果没有保存的数据，使用默认数据并保存
    saveUniverseData(defaultUniverseData);
    return defaultUniverseData;
}

// 保存宇宙数据到localStorage
function saveUniverseData(data) {
    try {
        localStorage.setItem('universeData', JSON.stringify(data));
        console.log('宇宙数据已保存');
    } catch (error) {
        console.error('保存宇宙数据失败:', error);
    }
}

// 初始化时加载数据
let universeData = loadUniverseData();

// 用户状态模拟
let userState = {
    isLoggedIn: false,
    hasCreatorPermission: false
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderUniverseCards();
    checkUserPermissions();
    addScrollAnimations();
    initHelpTooltip();
});

// 初始化玩法说明模块
function initHelpTooltip() {
    const helpTooltip = document.getElementById('helpTooltip');
    const helpTrigger = helpTooltip.querySelector('.help-trigger');
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 移动端点击行为
        helpTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            helpTooltip.classList.toggle('active');
        });
        
        // 点击其他地方关闭
        document.addEventListener('click', function(e) {
            if (!helpTooltip.contains(e.target)) {
                helpTooltip.classList.remove('active');
            }
        });
    }
}

// 查看完整玩法文档
function viewFullDocs() {
    console.log('查看完整玩法文档');
    // 这里可以添加跳转到文档页面的逻辑
    alert('正在跳转到完整玩法文档...');
}

// 渲染宇宙卡片
function renderUniverseCards() {
    const grid = document.getElementById('universeGrid');
    
    universeData.forEach(universe => {
        const card = createUniverseCard(universe);
        grid.appendChild(card);
    });
}

// 创建单个宇宙卡片
function createUniverseCard(universe) {
    const card = document.createElement('div');
    card.className = `universe-card glass-card ${universe.status === 'live' ? 'live-forking' : ''}`;
    
    const statusText = {
        live: '🟢 Live Forking',
        active: '🟡 Active',
        archive: '⚪ Archive'
    };
    
    card.innerHTML = `
        <div class="card-header">
            <span>${universe.emoji}</span>
            <div class="status-badge ${universe.status}">
                ${statusText[universe.status]}
            </div>
        </div>
        <div class="card-content">
            <h3 class="universe-title">${universe.title}</h3>
            <div class="universe-tags">
                ${universe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="universe-progress">${universe.progress}</div>
            <div class="universe-meta">
                <span>更新：${universe.lastUpdate}</span>
                <span>${universe.participants} 人参与 · ${universe.branches} 分支</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="enterUniverse(${universe.id})">
                    进入宇宙
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="btn btn-secondary" onclick="viewTimeline(${universe.id})">
                    查看时间线
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2V8L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // 添加悬停效果
    card.addEventListener('mouseenter', function() {
        if (universe.status === 'live') {
            this.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.3)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
    
    return card;
}

// 检查用户权限
function checkUserPermissions() {
    // 模拟登录检查
    setTimeout(() => {
        userState.isLoggedIn = true;
        userState.hasCreatorPermission = true;
        
        if (userState.isLoggedIn && userState.hasCreatorPermission) {
            document.getElementById('createSection').classList.remove('hidden');
        }
    }, 1000);
}

// 进入宇宙
function enterUniverse(universeId) {
    const universe = universeData.find(u => u.id === universeId);
    console.log(`进入宇宙: ${universe.title}`);

    // 跳转到故事流程图页面，传递故事ID
    window.location.href = `../story-tree.html?id=${universeId}`;
}

// 查看时间线
function viewTimeline(universeId) {
    const universe = universeData.find(u => u.id === universeId);
    console.log(`查看时间线: ${universe.title}`);

    // 这里可以添加时间线查看逻辑
    alert(`正在加载 "${universe.title}" 的 Canon 时间线...`);
}

// 跳转到我的页面
function goToProfile() {
    window.location.href = '../wodeproject/index.html';
}

// 创建新宇宙
function createUniverse() {
    if (!userState.isLoggedIn) {
        alert('请先登录');
        return;
    }

    if (!userState.hasCreatorPermission) {
        alert('您暂无创建权限');
        return;
    }

    // 显示创建宇宙弹窗
    document.getElementById('createUniverseModal').style.display = 'block';
}

// 关闭创建宇宙弹窗
function closeCreateModal() {
    document.getElementById('createUniverseModal').style.display = 'none';
}

// 标签切换
let selectedTags = [];
function toggleTag(button, tag) {
    button.classList.toggle('active');

    if (button.classList.contains('active')) {
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
        }
    } else {
        selectedTags = selectedTags.filter(t => t !== tag);
    }
}

// 监听访问类型变化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    renderUniverseCards();
    checkUserPermissions();
    addScrollAnimations();
    initHelpTooltip();

    // 监听访问类型单选按钮
    const accessTypeRadios = document.querySelectorAll('input[name="accessType"]');
    accessTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const tokenGroup = document.getElementById('tokenAmountGroup');
            if (this.value === 'token') {
                tokenGroup.style.display = 'block';
            } else {
                tokenGroup.style.display = 'none';
            }
        });
    });

    // 监听表单提交
    document.getElementById('createUniverseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitCreateUniverse();
    });

    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('createUniverseModal');
        if (e.target === modal) {
            closeCreateModal();
        }
    });
});

// 提交创建宇宙表单
function submitCreateUniverse() {
    const formData = {
        title: document.getElementById('universeTitle').value,
        description: document.getElementById('universeDesc').value,
        tags: selectedTags,
        genesisChapter: document.getElementById('genesisChapter').value,
        accessType: document.querySelector('input[name="accessType"]:checked').value,
        tokenAmount: document.getElementById('tokenAmount').value,
        forkPermission: document.querySelector('input[name="forkPermission"]').checked,
        votingRequired: document.querySelector('input[name="votingRequired"]').checked,
        mintCost: document.getElementById('mintCost').value,
        royalty: document.getElementById('royalty').value,
        descendantShare: document.getElementById('descendantShare').value
    };

    console.log('创建宇宙数据：', formData);

    // 验证必填字段
    if (!formData.title || formData.tags.length === 0 || !formData.genesisChapter) {
        alert('请填写所有必填字段（标题、标签、起始章节）');
        return;
    }

    // 生成新的故事ID
    const newId = Math.max(...universeData.map(u => u.id)) + 1;

    // 随机生成一个emoji（如果未来需要让用户选择，可以在表单中添加）
    const emojiList = ['🌟', '🎭', '🎨', '🎪', '🎬', '🎯', '🎸', '🎺', '🎻', '🎮', '🏆', '🏅', '💎', '💫', '✨'];
    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    // 创建新宇宙对象
    const newUniverse = {
        id: newId,
        title: formData.title,
        tags: formData.tags,
        progress: "刚刚创建 · 第 1 章",
        lastUpdate: "刚刚",
        participants: 1,
        branches: 0,
        status: "live",
        emoji: randomEmoji
    };

    // 添加到数据数组开头（最新的显示在最前面）
    universeData.unshift(newUniverse);

    // 保存到localStorage实现持久化
    saveUniverseData(universeData);

    // 重新渲染卡片
    const grid = document.getElementById('universeGrid');
    grid.innerHTML = '';
    renderUniverseCards();

    // 模拟提交
    alert(`🚀 宇宙 "${formData.title}" 创建成功！正在铸造NFT...`);

    // 关闭弹窗
    closeCreateModal();

    // 清空表单
    document.getElementById('createUniverseForm').reset();
    selectedTags = [];
    document.querySelectorAll('.tag-btn.active').forEach(btn => btn.classList.remove('active'));

    // 将新故事也添加到 story-tree 数据库
    addToStoryTreeDatabase(newId, formData);
}

// 添加滚动动画
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为卡片添加初始动画状态
    document.querySelectorAll('.universe-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // 为创建卡片添加动画
    const createCard = document.querySelector('.create-card');
    if (createCard) {
        createCard.style.opacity = '0';
        createCard.style.transform = 'translateY(30px)';
        createCard.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
        observer.observe(createCard);
    }
}

// 添加一些交互效果
document.addEventListener('mousemove', function(e) {
    const cards = document.querySelectorAll('.universe-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        } else {
            card.style.transform = '';
        }
    });
});

// 模拟实时更新
setInterval(() => {
    const liveCards = document.querySelectorAll('.universe-card.live-forking');
    liveCards.forEach(card => {
        // 添加微妙的脉冲效果
        card.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.2)';
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 1000);
    });
}, 3000);

// 将新创建的故事添加到story-tree数据库（使用localStorage同步）
function addToStoryTreeDatabase(storyId, formData) {
    // 创建新故事的章节数据结构
    const newStoryData = {
        id: storyId,
        title: formData.title,
        emoji: universeData.find(u => u.id === storyId).emoji,
        progress: 0,
        chapters: [
            {
                id: 'start',
                title: '第一章',
                author: '创作者', // 可以从用户登录信息获取
                type: 'start',
                views: 0,
                likes: 0,
                subscribed: false,
                position: { x: 150, y: 300 },
                content: formData.genesisChapter,
                nextChapters: []
            }
        ]
    };

    // 保存到localStorage
    try {
        // 获取现有的故事数据
        const existingStories = JSON.parse(localStorage.getItem('storiesDatabase') || '{}');

        // 添加新故事
        existingStories[storyId] = newStoryData;

        // 保存回localStorage
        localStorage.setItem('storiesDatabase', JSON.stringify(existingStories));

        console.log(`故事 "${formData.title}" 已添加到story-tree数据库`);
    } catch (error) {
        console.error('保存故事到localStorage失败:', error);
    }
}

// 初始化函数：确保事件监听器只注册一次
function initializeEventListeners() {
    // 该函数在DOMContentLoaded中被调用
    // 此处可以添加其他初始化逻辑
}