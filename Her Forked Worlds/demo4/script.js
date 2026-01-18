// 章节数据
const chapterData = {
    'origin': {
        title: '第一章：午后玫瑰',
        author: '星河诗人',
        type: 'Canon',
        content: `玫瑰在下午开放
没有询问任何意义
乌鸦死在路边
黑色保持完整
世界继续向前

这首诗写于一个普通的午后，阳光斜射进咖啡厅的玻璃窗。我看着窗外的玫瑰花园，突然想到生命的意义或许不需要被询问，它只是存在着，如同那朵在午后静静开放的玫瑰。

而死亡，也如那只路边的乌鸦，黑色而完整，不需要解释，不需要同情。世界依然向前，时间依然流淌，我们在其中寻找着属于自己的诗意。

这就是我想要表达的——在这个快速变化的世界里，保持内心的宁静与完整，如玫瑰般绽放，如乌鸦般坦然。`,
        likes: 2100,
        votes: 2100,
        forks: 3
    },
    '2a': {
        title: '2A: 黑色乌鸦',
        author: '暗夜诗者',
        type: '投票中',
        content: `乌鸦死在路边
黑色保持完整

我想象着那只乌鸦
在生命的最后一刻
是否还记得飞翔的感觉
是否还眷恋着天空的蓝

黑色是最诚实的颜色
它不掩饰，不伪装
如同死亡本身
干净而彻底

路边的行人匆匆走过
没有人为它停留
但我知道
它的黑色将永远完整
在这个不完整的世界里

这是对原诗中"乌鸦死在路边，黑色保持完整"的深度展开，探讨死亡的尊严与完整性。`,
        likes: 856,
        votes: 856,
        forks: 0
    },
    '2b': {
        title: '2B: 世界向前',
        author: '时光织者',
        type: 'Canon',
        content: `世界继续向前
带着玫瑰的芬芳
带着乌鸦的沉默
带着我们所有的
爱与失去

时间是最好的诗人
它写下每一个瞬间
然后轻轻翻页
留下淡淡的墨香

我们在这首诗里
有时是玫瑰
有时是乌鸦
有时只是
路过的风

但无论如何
世界都会向前
我们的故事
也会继续

这个分支延续了原诗的时间主题，将"世界继续向前"作为核心意象，探讨在时间流逝中的存在意义。`,
        likes: 2100,
        votes: 2100,
        forks: 2
    },
    '2c': {
        title: '2C: 无声询问',
        author: '静默观者',
        type: 'Alt',
        content: `没有询问任何意义
这句话本身
就是最深的询问

玫瑰为什么要开放？
乌鸦为什么要死去？
我们为什么要存在？

但也许
问题的答案
就在问题本身

不询问
就是最好的答案
如同玫瑰的开放
如同乌鸦的沉默
如同世界的向前

在这个充满疑问的世界里
保持沉默
也是一种勇气

这个分支聚焦于原诗中"没有询问任何意义"这一句，通过哲学思辨探讨询问与沉默的关系。`,
        likes: 234,
        votes: 234,
        forks: 1
    }
};

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    drawTreeConnections();
    
    // 模拟实时数据更新
    setInterval(updateVotingProgress, 5000);
});

// 初始化事件监听器
function initializeEventListeners() {
    // 章节阅读弹窗
    const modal = document.getElementById('chapterModal');
    const closeBtn = document.querySelector('.close-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 树状图控制按钮
    document.querySelectorAll('.tree-control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tree-control-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.dataset.view;
            switchTreeView(view);
        });
    });
    
    // 关注按钮
    document.addEventListener('click', function(e) {
        if (e.target.matches('.follow-btn, .author-follow-btn')) {
            e.stopPropagation();
            toggleFollow(e.target);
        }
    });
    
    // 点赞按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            e.stopPropagation();
            toggleLike(e.target.closest('.like-btn'));
        }
    });
    
    // 投票按钮
    document.addEventListener('click', function(e) {
        if (e.target.matches('.vote-btn')) {
            e.stopPropagation();
            showVotingInterface();
        }
    });
    
    // 窗口大小改变时重新绘制连接线
    window.addEventListener('resize', function() {
        setTimeout(drawTreeConnections, 100);
    });
}

// 阅读章节
function readChapter(chapterId) {
    const chapter = chapterData[chapterId];
    if (!chapter) return;
    
    const modal = document.getElementById('chapterModal');
    document.getElementById('modalTitle').textContent = chapter.title;
    document.getElementById('modalAuthor').textContent = chapter.author;
    document.getElementById('modalType').textContent = chapter.type;
    
    // 设置类型样式
    const typeElement = document.getElementById('modalType');
    typeElement.className = 'chapter-type';
    if (chapter.type === 'Canon') {
        typeElement.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else if (chapter.type === '投票中') {
        typeElement.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
    } else {
        typeElement.style.background = 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
    }
    
    // 更新点赞数
    const likeBtn = document.querySelector('.modal .like-btn .like-count');
    if (likeBtn) {
        likeBtn.textContent = formatNumber(chapter.likes);
    }
    
    modal.style.display = 'block';
    
    // 打字机效果显示内容
    typeWriter(document.getElementById('modalContent'), chapter.content, 15);
}

// 创建分叉
function createFork(parentChapterId) {
    showNotification('正在打开Fork Studio创作界面...', 'info');
    
    // 模拟跳转到Fork Studio页面
    setTimeout(() => {
        const forkModal = createForkStudioModal(parentChapterId);
        document.body.appendChild(forkModal);
        forkModal.style.display = 'block';
    }, 1000);
}

// 投票章节
function voteChapter(chapterId) {
    showNotification('正在打开投票界面...', 'info');
    
    // 模拟跳转到投票页面
    setTimeout(() => {
        showVotingInterface();
    }, 500);
}

// 创建Fork Studio弹窗
function createForkStudioModal(parentChapterId) {
    const parentChapter = chapterData[parentChapterId];
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <div class="chapter-info">
                    <h3>🖋️ Fork Studio - 创作新分支</h3>
                    <div class="chapter-meta">
                        <span class="chapter-author">从 "${parentChapter.title}" 继续创作</span>
                    </div>
                </div>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="fork-studio">
                    <div class="studio-section">
                        <h4>📖 父章节摘要</h4>
                        <div class="parent-summary">
                            <p>${parentChapter.content.substring(0, 200)}...</p>
                        </div>
                    </div>
                    
                    <div class="studio-section">
                        <h4>🎯 分支设定</h4>
                        <div class="form-group">
                            <label>章节标题</label>
                            <input type="text" class="form-input" placeholder="为你的分支起个标题">
                        </div>
                        <div class="form-group">
                            <label>创作意图</label>
                            <textarea class="form-textarea" placeholder="简要说明你的创作方向和意图"></textarea>
                        </div>
                    </div>
                    
                    <div class="studio-section">
                        <h4>🤖 AI 辅助创作</h4>
                        <div class="ai-tools">
                            <button class="ai-tool-btn">💡 情节建议</button>
                            <button class="ai-tool-btn">🎭 角色发展</button>
                            <button class="ai-tool-btn">📝 语言优化</button>
                            <button class="ai-tool-btn">🌟 风格调整</button>
                        </div>
                        <textarea class="content-editor" placeholder="在这里开始你的创作...&#10;&#10;AI助手将帮助你完善情节发展，确保故事的连贯性和吸引力。"></textarea>
                    </div>
                    
                    <div class="studio-section">
                        <h4>⛓️ 上链设置</h4>
                        <div class="mint-info">
                            <div class="mint-cost">
                                <span class="label">铸造成本:</span>
                                <span class="value">50 FORK</span>
                            </div>
                            <div class="mint-royalty">
                                <span class="label">版税设置:</span>
                                <span class="value">5% 后代分润</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="action-btn" onclick="this.closest('.modal').remove()">取消</button>
                <button class="action-btn fork-btn" onclick="submitFork()">🚀 提交分支候选</button>
            </div>
        </div>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .fork-studio {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        
        .studio-section h4 {
            color: #3498db;
            margin-bottom: 12px;
            font-size: 1.1em;
        }
        
        .parent-summary {
            background: rgba(255, 255, 255, 0.05);
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-group label {
            display: block;
            color: #bdc3c7;
            margin-bottom: 6px;
            font-size: 0.9em;
        }
        
        .form-input, .form-textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: #ecf0f1;
            font-size: 1em;
            font-family: inherit;
        }
        
        .form-textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        .ai-tools {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }
        
        .ai-tool-btn {
            background: rgba(155, 89, 182, 0.2);
            color: #9b59b6;
            border: 1px solid #9b59b6;
            padding: 6px 12px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 0.85em;
            transition: all 0.3s ease;
        }
        
        .ai-tool-btn:hover {
            background: #9b59b6;
            color: white;
        }
        
        .content-editor {
            width: 100%;
            min-height: 200px;
            padding: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: #ecf0f1;
            font-size: 1em;
            font-family: inherit;
            line-height: 1.6;
            resize: vertical;
        }
        
        .mint-info {
            display: flex;
            gap: 24px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
        }
        
        .mint-cost, .mint-royalty {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .mint-info .label {
            color: #bdc3c7;
            font-size: 0.9em;
        }
        
        .mint-info .value {
            color: #f39c12;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
    
    return modal;
}

// 提交分叉
function submitFork() {
    showNotification('分支已提交！正在铸造NFT...', 'success');
    
    setTimeout(() => {
        showNotification('NFT铸造成功！分支已进入候选投票池', 'success');
        document.querySelector('.modal').remove();
        
        // 模拟更新界面数据
        updateStoryStats();
    }, 2000);
}

// 显示投票界面
function showVotingInterface() {
    const votingModal = document.createElement('div');
    votingModal.className = 'modal';
    votingModal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <div class="chapter-info">
                    <h3>🗳️ 投票竞技场</h3>
                    <div class="chapter-meta">
                        <span class="chapter-author">第2章分支投票</span>
                        <span class="voting-countdown">⏰ 剩余 1天 14小时</span>
                    </div>
                </div>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="voting-arena">
                    <div class="voting-stats">
                        <div class="stat">
                            <span class="label">候选分支</span>
                            <span class="value">4个</span>
                        </div>
                        <div class="stat">
                            <span class="label">总投票数</span>
                            <span class="value">2.4k</span>
                        </div>
                        <div class="stat">
                            <span class="label">你的投票权重</span>
                            <span class="value">125 FORK</span>
                        </div>
                    </div>
                    
                    <div class="candidates-list">
                        <div class="candidate-card leading">
                            <div class="candidate-header">
                                <h4>2D: 时间停滞</h4>
                                <span class="leading-badge">领先</span>
                            </div>
                            <p class="candidate-pitch">探讨时间静止时刻的诗意，玫瑰永远定格在开放的瞬间</p>
                            <div class="candidate-author">by 时间诗人</div>
                            <div class="vote-progress-bar">
                                <div class="progress" style="width: 65%"></div>
                            </div>
                            <div class="vote-info">
                                <span class="vote-count">1.6k票 (65%)</span>
                                <button class="vote-candidate-btn" data-candidate="2d">投票</button>
                            </div>
                        </div>
                        
                        <div class="candidate-card">
                            <div class="candidate-header">
                                <h4>2A: 黑色乌鸦</h4>
                            </div>
                            <p class="candidate-pitch">深入探讨死亡的尊严与完整性，黑色的诗意表达</p>
                            <div class="candidate-author">by 暗夜诗者</div>
                            <div class="vote-progress-bar">
                                <div class="progress" style="width: 35%"></div>
                            </div>
                            <div class="vote-info">
                                <span class="vote-count">856票 (35%)</span>
                                <button class="vote-candidate-btn" data-candidate="2a">投票</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="voting-tips">
                    <p>💡 你的投票权重基于持有的FORK代币数量</p>
                    <p>🏆 获胜分支将成为Canon主线，其他分支保持为Alt可继续分叉</p>
                </div>
            </div>
        </div>
    `;
    
    // 添加投票样式
    const style = document.createElement('style');
    style.textContent = `
        .voting-arena {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
        
        .voting-stats {
            display: flex;
            gap: 24px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
        }
        
        .voting-stats .stat {
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: center;
        }
        
        .voting-stats .label {
            color: #bdc3c7;
            font-size: 0.9em;
        }
        
        .voting-stats .value {
            color: #3498db;
            font-size: 1.3em;
            font-weight: 600;
        }
        
        .candidates-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .candidate-card {
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .candidate-card.leading {
            border-color: #f39c12;
            box-shadow: 0 0 20px rgba(243, 156, 18, 0.3);
        }
        
        .candidate-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .candidate-header h4 {
            color: #ecf0f1;
            font-size: 1.2em;
        }
        
        .leading-badge {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 600;
        }
        
        .candidate-pitch {
            color: #bdc3c7;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        
        .candidate-author {
            color: #95a5a6;
            font-size: 0.9em;
            margin-bottom: 16px;
        }
        
        .vote-progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        
        .vote-progress-bar .progress {
            height: 100%;
            background: linear-gradient(135deg, #3498db, #2980b9);
            transition: width 0.3s ease;
        }
        
        .vote-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .vote-count {
            color: #bdc3c7;
            font-size: 0.9em;
        }
        
        .vote-candidate-btn {
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .vote-candidate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(243, 156, 18, 0.4);
        }
        
        .voting-tips {
            color: #95a5a6;
            font-size: 0.9em;
            line-height: 1.6;
        }
        
        .voting-countdown {
            color: #f39c12;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
    
    // 添加投票事件监听
    votingModal.addEventListener('click', function(e) {
        if (e.target.matches('.vote-candidate-btn')) {
            const candidate = e.target.dataset.candidate;
            castVote(candidate);
            votingModal.remove();
        }
    });
    
    document.body.appendChild(votingModal);
    votingModal.style.display = 'block';
}

// 投票
function castVote(candidateId) {
    showNotification('投票成功！你的125 FORK已投给该分支', 'success');
    
    // 模拟更新投票进度
    setTimeout(() => {
        updateVotingProgress();
    }, 1000);
}

// 绘制树状连接线
function drawTreeConnections() {
    const svg = document.querySelector('.tree-svg');
    const nodes = document.querySelectorAll('.chapter-node');
    
    if (!svg || nodes.length === 0) return;
    
    // 清除现有连接线
    svg.innerHTML = '';
    
    const svgRect = svg.getBoundingClientRect();
    const originNode = document.querySelector('[data-chapter="origin"]');
    
    if (!originNode) return;
    
    const originRect = originNode.getBoundingClientRect();
    const originX = originRect.left + originRect.width / 2 - svgRect.left;
    const originY = originRect.top + originRect.height / 2 - svgRect.top;
    
    // 连接到各个分支
    const branchNodes = document.querySelectorAll('[data-chapter^="2"]');
    branchNodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const nodeX = nodeRect.left + nodeRect.width / 2 - svgRect.left;
        const nodeY = nodeRect.top + nodeRect.height / 2 - svgRect.top;
        
        // 创建连接线
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', originX);
        line.setAttribute('y1', originY);
        line.setAttribute('x2', nodeX);
        line.setAttribute('y2', nodeY);
        
        // 根据节点类型设置样式
        if (node.classList.contains('canon-node')) {
            line.setAttribute('stroke', '#e74c3c');
            line.setAttribute('stroke-width', '3');
        } else if (node.classList.contains('voting-node')) {
            line.setAttribute('stroke', '#f39c12');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('stroke-dasharray', '5,5');
        } else {
            line.setAttribute('stroke', '#95a5a6');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('opacity', '0.6');
        }
        
        line.style.filter = 'drop-shadow(0 0 3px rgba(52, 152, 219, 0.5))';
        svg.appendChild(line);
    });
}

// 切换树状图视图
function switchTreeView(view) {
    const viewport = document.querySelector('.tree-viewport');
    
    switch(view) {
        case 'tree':
            showNotification('切换到树状图视图', 'info');
            break;
        case 'timeline':
            showNotification('切换到时间线视图', 'info');
            break;
        case 'voting':
            showNotification('切换到投票视图', 'info');
            break;
    }
}

// 更新投票进度
function updateVotingProgress() {
    // 模拟实时投票数据更新
    const progressBars = document.querySelectorAll('.vote-progress');
    progressBars.forEach(bar => {
        const currentWidth = parseInt(bar.style.width);
        const change = Math.random() * 4 - 2; // -2% to +2%
        const newWidth = Math.max(10, Math.min(90, currentWidth + change));
        bar.style.width = newWidth + '%';
    });
}

// 更新故事统计数据
function updateStoryStats() {
    // 模拟更新分支总数
    const branchCountElement = document.querySelector('.stat-item:nth-child(2) .stat-value');
    if (branchCountElement) {
        const currentCount = parseInt(branchCountElement.textContent);
        branchCountElement.textContent = currentCount + 1;
    }
}

// 切换关注状态
function toggleFollow(btn) {
    if (btn.textContent.includes('关注')) {
        btn.textContent = '已关注';
        btn.style.background = 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
        showNotification('已关注该作者', 'success');
    } else {
        btn.textContent = '关注';
        btn.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        showNotification('已取消关注', 'info');
    }
}

// 切换点赞状态
function toggleLike(btn) {
    const likeCount = btn.querySelector('.like-count');
    let count = parseInt(likeCount.textContent.replace(/[^\d]/g, ''));
    
    if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        btn.style.background = 'linear-gradient(135deg, #27ae60, #229954)';
        count--;
        showNotification('已取消点赞', 'info');
    } else {
        btn.classList.add('liked');
        btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        count++;
        showNotification('点赞成功！🍃', 'success');
    }
    
    likeCount.textContent = formatNumber(count);
}

// 打字机效果
function typeWriter(element, text, speed = 20) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 格式化数字显示
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
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