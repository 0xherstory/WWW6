/**
 * VisionFocus Hours - 冥想引导页面脚本
 * 基于专业心理引导流程的冥想系统
 */

import storageManager from '../utils/storage.js';
import audioManager from '../utils/audio.js';
import { showCustomNotification, showSuccessNotification } from '../utils/helpers.js';

// 冥想引导内容 - 基于专业心理引导流程
const meditationGuide = {
    sections: [
        {
            id: 1,
            title: "冥想准备与开场",
            bgLayer: "layer-universe",
            lines: [
                { text: "请找到一个舒适的姿势坐下。", pause: 4000 },
                { text: "可以是盘坐,或坐在椅子上。", pause: 2000 },
                { text: "确保脊柱自然挺直,", pause: 2000 },
                { text: "双肩下沉,", pause: 2000 },
                { text: "双手轻放于膝盖或大腿上。", pause: 6000, isPause: true },
                { text: "轻轻闭上眼睛,", pause: 3000 },
                { text: "让身体的重量,", pause: 2000 },
                { text: "完全由地面支撑。", pause: 5000, isPause: true },
                { text: "现在,", pause: 2000 },
                { text: "将注意力转向呼吸。", pause: 2000 },
                { text: "无需刻意调整,", pause: 2000 },
                { text: "只需观察气息的自然流动。", pause: 4000, isPause: true },
                { text: "吸气时,", pause: 2000 },
                { text: "感受空气通过鼻腔的清凉感。", pause: 3000, isPause: true },
                { text: "呼气时,", pause: 2000 },
                { text: "体会气息离开身体的温热感。", pause: 5000, isPause: true },
                { text: "允许自己在这一刻,", pause: 2000 },
                { text: "放下所有杂念,", pause: 2000 },
                { text: "如同将沉重的行李,", pause: 2000 },
                { text: "暂时搁置在一旁。", pause: 6000, isPause: true },
                { text: "这里没有评判,", pause: 2000 },
                { text: "没有匆忙,", pause: 2000 },
                { text: "只有你,", pause: 2000 },
                { text: "与自己的相处。", pause: 8000, isPause: true, isHighlight: true }
            ],
            estimatedDuration: 90000 // 90秒
        },
        {
            id: 2,
            title: "呼吸锚定与身体放松",
            bgLayer: "layer-forest",
            lines: [
                { text: "接下来,", pause: 2000 },
                { text: "我们将通过呼吸,", pause: 2000 },
                { text: "让身心逐渐平静。", pause: 4000, isPause: true },
                { text: "吸气时,", pause: 2000 },
                { text: "想象将清新的能量吸入体内,", pause: 2000 },
                { text: "滋养每一个细胞。", pause: 4000, isPause: true },
                { text: "呼气时,", pause: 2000 },
                { text: "将压力与杂念,", pause: 2000 },
                { text: "缓缓排出,", pause: 2000 },
                { text: "如同海浪带走沙粒。", pause: 6000, isPause: true },
                { text: "现在,", pause: 2000 },
                { text: "将意识从头顶开始,", pause: 2000 },
                { text: "向下扫描。", pause: 4000, isPause: true },
                { text: "放松头皮……", pause: 5000, isPause: true },
                { text: "舒展眉心……", pause: 5000, isPause: true },
                { text: "释放脸颊的紧绷感……", pause: 6000, isPause: true },
                { text: "让肩膀自然下垂,", pause: 3000 },
                { text: "手臂逐渐柔软,", pause: 3000 },
                { text: "手指,", pause: 2000 },
                { text: "微微发暖。", pause: 7000, isPause: true },
                { text: "感受胸腔的开阔,", pause: 3000 },
                { text: "腹部的起伏。", pause: 6000, isPause: true },
                { text: "双腿,", pause: 2000 },
                { text: "双脚,", pause: 2000 },
                { text: "完全沉向地面。", pause: 8000, isPause: true },
                { text: "如果思绪飘走,", pause: 2000 },
                { text: "只需温柔地,", pause: 2000 },
                { text: "将注意力带回呼吸。", pause: 4000, isPause: true },
                { text: "如同一片云,", pause: 2000 },
                { text: "轻轻飘过。", pause: 2000 },
                { text: "不抗拒,", pause: 2000 },
                { text: "也不追逐。", pause: 8000, isPause: true, isHighlight: true }
            ],
            estimatedDuration: 100000 // 100秒
        },
        {
            id: 3,
            title: "自然意象与内心平静",
            bgLayer: "layer-sunlight",
            lines: [
                { text: "想象自己,", pause: 2000 },
                { text: "漫步在一片宁静的森林中。", pause: 5000, isPause: true },
                { text: "阳光,", pause: 2000 },
                { text: "透过树叶,", pause: 2000 },
                { text: "洒下斑驳的光点。", pause: 6000, isPause: true },
                { text: "微风,", pause: 2000 },
                { text: "轻拂脸颊,", pause: 2000 },
                { text: "带来青草与泥土的芬芳。", pause: 7000, isPause: true },
                { text: "远处,", pause: 2000 },
                { text: "溪流潺潺,", pause: 2000 },
                { text: "鸟鸣清脆。", pause: 6000, isPause: true },
                { text: "自然的声音,", pause: 2000 },
                { text: "将你包裹在", pause: 2000 },
                { text: "安全而放松的氛围中。", pause: 8000, isPause: true },
                { text: "感受双脚,", pause: 2000 },
                { text: "与大地紧密连接。", pause: 5000, isPause: true },
                { text: "如同一棵大树,", pause: 2000 },
                { text: "根系深入土壤,", pause: 2000 },
                { text: "稳固,", pause: 2000 },
                { text: "而安宁。", pause: 8000, isPause: true, isHighlight: true },
                { text: "每一次吸气,", pause: 2000 },
                { text: "吸收森林的生机。", pause: 4000, isPause: true },
                { text: "每一次呼气,", pause: 2000 },
                { text: "释放内心的纷扰。", pause: 6000, isPause: true },
                { text: "在这里,", pause: 2000 },
                { text: "你无需努力。", pause: 2000 },
                { text: "只需存在,", pause: 2000 },
                { text: "与感知。", pause: 10000, isPause: true, isHighlight: true }
            ],
            estimatedDuration: 90000 // 90秒
        },
        {
            id: 4,
            title: "愿景设想的心理准备",
            bgLayer: "layer-stars",
            lines: [
                { text: "在这份平静与专注中,", pause: 3000 },
                { text: "请将注意力,", pause: 2000 },
                { text: "轻轻转向内心。", pause: 5000, isPause: true },
                { text: "问问自己:", pause: 2000 },
                { text: "如果没有限制,", pause: 2000 },
                { text: "我最想创造的未来,", pause: 2000 },
                { text: "是什么?", pause: 8000, isPause: true, isHighlight: true },
                { text: "哪些画面,", pause: 2000 },
                { text: "让我感到喜悦?", pause: 3000 },
                { text: "哪些念头,", pause: 2000 },
                { text: "带来动力?", pause: 8000, isPause: true, isHighlight: true },
                { text: "无需寻找答案。", pause: 2000 },
                { text: "无需用力思考。", pause: 5000, isPause: true },
                { text: "只是允许这些愿景,", pause: 2000 },
                { text: "如种子一般,", pause: 2000 },
                { text: "在心底,", pause: 2000 },
                { text: "慢慢萌芽。", pause: 8000, isPause: true, isHighlight: true },
                { text: "想象它们,", pause: 2000 },
                { text: "如同星光,", pause: 2000 },
                { text: "在内在的夜空中,", pause: 2000 },
                { text: "逐渐明亮。", pause: 10000, isPause: true, isHighlight: true },
                { text: "在心中轻轻告诉自己:", pause: 3000 },
                { text: "我允许这些可能性存在。", pause: 4000 },
                { text: "我愿意,", pause: 2000 },
                { text: "以开放的心,", pause: 2000 },
                { text: "迎接它们。", pause: 10000, isPause: true, isHighlight: true }
            ],
            estimatedDuration: 80000 // 80秒
        },
        {
            id: 5,
            title: "结束与回归",
            bgLayer: "layer-universe",
            lines: [
                { text: "现在,", pause: 2000 },
                { text: "慢慢将注意力,", pause: 2000 },
                { text: "带回呼吸。", pause: 4000, isPause: true },
                { text: "感受身体,", pause: 2000 },
                { text: "与座位的接触。", pause: 4000, isPause: true },
                { text: "轻轻活动手指,", pause: 2000 },
                { text: "活动脚趾。", pause: 4000, isPause: true },
                { text: "搓热掌心,", pause: 2000 },
                { text: "将温暖,", pause: 2000 },
                { text: "敷在双眼上。", pause: 5000, isPause: true },
                { text: "当你准备好时,", pause: 2000 },
                { text: "缓缓睁开眼睛。", pause: 4000, isPause: true },
                { text: "适应周围的光线。", pause: 4000, isPause: true },
                { text: "带着这份宁静与清晰,", pause: 3000 },
                { text: "进入接下来的愿景板创作。", pause: 6000, isPause: true },
                { text: "请记住:", pause: 2000 },
                { text: "这份平静的力量,", pause: 2000 },
                { text: "始终在你之内,", pause: 2000 },
                { text: "随时,", pause: 2000 },
                { text: "可以被你调用。", pause: 10000, isPause: true, isHighlight: true }
            ],
            estimatedDuration: 60000 // 60秒
        }
    ],
    currentSection: 0,
    currentLine: 0,
    isAutoPlay: true,
    isMeditationActive: false,
    lineTimeout: null,
    sectionTimeout: null
};

// 当前星球信息
let currentPlanet = null;

// DOM元素
let universeFocusContainer, newPlanet, startCreationBtn, meditationSpace;
let breathingCircle, autoPlayBtn, manualPlayBtn, prevSectionBtn, nextSectionBtn;
let musicToggleBtn, voiceToggleBtn, completionSection, enterPlanetBtn;
let sectionDots, sectionIndicators;

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    initDOMElements();
    await initPage();
    setupEventListeners();
    populateGuideSections();
});

function initDOMElements() {
    universeFocusContainer = document.getElementById('universeFocusContainer');
    newPlanet = document.getElementById('newPlanet');
    startCreationBtn = document.getElementById('startCreationBtn');
    meditationSpace = document.getElementById('meditationSpace');
    breathingCircle = document.getElementById('breathingCircle');
    autoPlayBtn = document.getElementById('autoPlayBtn');
    manualPlayBtn = document.getElementById('manualPlayBtn');
    prevSectionBtn = document.getElementById('prevSectionBtn');
    nextSectionBtn = document.getElementById('nextSectionBtn');
    musicToggleBtn = document.getElementById('musicToggleBtn');
    voiceToggleBtn = document.getElementById('voiceToggleBtn');
    completionSection = document.getElementById('completionSection');
    enterPlanetBtn = document.getElementById('enterPlanetBtn');
    sectionDots = document.querySelectorAll('.section-dot');
    sectionIndicators = document.querySelectorAll('.section-indicator');
}

async function initPage() {
    // 从URL获取年份参数
    const urlParams = new URLSearchParams(window.location.search);
    const year = urlParams.get('year') || new Date().getFullYear();
    
    // 获取或创建星球
    currentPlanet = storageManager.getPlanet(year);
    if (!currentPlanet) {
        currentPlanet = storageManager.createPlanet(year);
    }
    
    // 更新页面显示
    updatePlanetDisplay(year);
    
    // 初始化音频
    await audioManager.init();
    
    // 默认自动播放模式
    setAutoPlayMode(true);
}

function updatePlanetDisplay(year) {
    // 更新所有年份显示
    const elements = [
        document.getElementById('planetTitle'),
        document.getElementById('planetYear'),
        document.getElementById('planetNameDisplay'),
        document.getElementById('meditationTitle'),
        document.getElementById('completionYear')
    ];
    
    elements.forEach(el => {
        if (el) {
            if (el.id === 'planetTitle' || el.id === 'meditationTitle') {
                el.textContent = `${year}星球 · 冥想引导`;
            } else {
                el.textContent = year;
            }
        }
    });
}

function populateGuideSections() {
    meditationGuide.sections.forEach(section => {
        const container = document.getElementById(`section${section.id}Text`);
        if (!container) return;
        
        container.innerHTML = '';
        
        section.lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'guide-line';
            
            if (line.isPause) {
                lineElement.classList.add('pause-line');
            }
            
            if (line.isHighlight) {
                lineElement.classList.add('highlight');
            }
            
            lineElement.textContent = line.text;
            lineElement.style.animationDelay = `${index * 0.1}s`;
            
            // 添加暂停指示器
            if (line.isPause && line.pause >= 5000) {
                const pauseIndicator = document.createElement('span');
                pauseIndicator.className = 'pause-indicator';
                lineElement.appendChild(pauseIndicator);
            }
            
            container.appendChild(lineElement);
        });
    });
}

function setupEventListeners() {
    // 开始创建星球按钮
    startCreationBtn.addEventListener('click', startPlanetCreation);
    
    // 自动播放按钮
    autoPlayBtn.addEventListener('click', () => setAutoPlayMode(true));
    
    // 手动播放按钮
    manualPlayBtn.addEventListener('click', () => setAutoPlayMode(false));
    
    // 上一阶段按钮
    prevSectionBtn.addEventListener('click', prevSection);
    
    // 下一阶段按钮
    nextSectionBtn.addEventListener('click', nextSection);
    
    // 音乐控制按钮
    musicToggleBtn.addEventListener('click', toggleMusic);
    
    // 语音控制按钮 (暂时不实现真实语音)
    voiceToggleBtn.addEventListener('click', toggleVoice);
    
    // 进入星球按钮
    enterPlanetBtn.addEventListener('click', enterPlanet);
    
    // 进度指示器点击
    sectionIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index <= meditationGuide.currentSection) {
                goToSection(index);
            }
        });
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (!meditationGuide.isMeditationActive) return;
        
        // 空格键切换自动/手动模式
        if (e.key === ' ') {
            e.preventDefault();
            setAutoPlayMode(!meditationGuide.isAutoPlay);
        }
        
        // 右箭头下一阶段
        if (e.key === 'ArrowRight') {
            nextSection();
        }
        
        // 左箭头上一阶段
        if (e.key === 'ArrowLeft') {
            prevSection();
        }
        
        // M键切换音乐
        if (e.key === 'm' || e.key === 'M') {
            toggleMusic();
        }
        
        // V键切换语音
        if (e.key === 'v' || e.key === 'V') {
            toggleVoice();
        }
    });
}

function startPlanetCreation() {
    // 禁用开始按钮
    startCreationBtn.disabled = true;
    startCreationBtn.innerHTML = '<i class="fas fa-spinner fa-spin btn-icon"></i> 准备中...';
    
    // 开始背景音乐
    audioManager.playBackgroundMusic('meditation');
    
    // 开始宇宙聚焦动画
    universeFocusContainer.style.transform = 'scale(20)';
    universeFocusContainer.style.opacity = '0.8';
    
    // 星球放大动画
    newPlanet.style.transform = 'scale(1.5)';
    newPlanet.style.boxShadow = 'inset 0 0 50px rgba(255, 255, 255, 0.3), 0 0 120px rgba(78, 205, 196, 0.9)';
    
    // 3秒后切换到冥想空间
    setTimeout(() => {
        meditationSpace.style.display = 'flex';
        universeFocusContainer.style.display = 'none';
        meditationGuide.isMeditationActive = true;
        
        // 显示呼吸圆圈
        breathingCircle.style.opacity = '0.5';
        
        // 开始第一个部分的冥想引导
        startMeditationSection(0);
        
        // 显示通知
        showCustomNotification('🧘 开始冥想引导', '请跟随引导放松身心...');
    }, 3000);
}

function startMeditationSection(sectionIndex) {
    // 清除之前的计时器
    clearTimeout(meditationGuide.lineTimeout);
    clearTimeout(meditationGuide.sectionTimeout);
    
    // 更新当前部分
    meditationGuide.currentSection = sectionIndex;
    meditationGuide.currentLine = 0;
    
    // 更新界面
    updateSectionDisplay();
    updateProgressIndicators();
    updateControlButtons();
    updateBackgroundLayer();
    
    // 如果是自动播放模式,开始播放
    if (meditationGuide.isAutoPlay) {
        startAutoPlayLines();
    } else {
        // 手动模式,显示所有行
        showAllLines();
    }
}

function startAutoPlayLines() {
    const section = meditationGuide.sections[meditationGuide.currentSection];
    
    // 显示当前行
    showLine(meditationGuide.currentLine);
    
    // 设置下一行的计时器
    const line = section.lines[meditationGuide.currentLine];
    meditationGuide.lineTimeout = setTimeout(() => {
        meditationGuide.currentLine++;
        
        if (meditationGuide.currentLine < section.lines.length) {
            startAutoPlayLines();
        } else {
            // 当前部分完成
            if (meditationGuide.isAutoPlay && meditationGuide.currentSection < meditationGuide.sections.length - 1) {
                meditationGuide.sectionTimeout = setTimeout(() => {
                    nextSection();
                }, 3000); // 部分之间暂停3秒
            } else if (meditationGuide.currentSection === meditationGuide.sections.length - 1) {
                // 如果是最后一部分,显示完成部分
                meditationGuide.sectionTimeout = setTimeout(() => {
                    showCompletionSection();
                }, 3000);
            }
        }
    }, line.pause || 2000);
}

function showLine(lineIndex) {
    const section = meditationGuide.sections[meditationGuide.currentSection];
    const container = document.getElementById(`section${section.id}Text`);
    
    if (!container || lineIndex >= section.lines.length) return;
    
    // 隐藏所有行
    const lines = container.querySelectorAll('.guide-line');
    lines.forEach(line => {
        line.style.opacity = '0.3';
    });
    
    // 显示当前行和前几行
    for (let i = 0; i <= lineIndex; i++) {
        if (lines[i]) {
            lines[i].style.opacity = '1';
            lines[i].style.transform = 'translateY(0)';
        }
    }
    
    // 滚动到当前行
    if (lines[lineIndex]) {
        lines[lineIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function showAllLines() {
    const section = meditationGuide.sections[meditationGuide.currentSection];
    const container = document.getElementById(`section${section.id}Text`);
    if (!container) return;
    
    const lines = container.querySelectorAll('.guide-line');
    lines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
    });
}

function updateSectionDisplay() {
    // 隐藏所有部分
    document.querySelectorAll('.guide-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示当前部分
    const currentSection = meditationGuide.sections[meditationGuide.currentSection];
    const sectionElement = document.getElementById(`section${currentSection.id}`);
    if (sectionElement) {
        sectionElement.classList.add('active');
        
        // 滚动到顶部
        const textContainer = sectionElement.querySelector('.guide-text-container');
        if (textContainer) {
            textContainer.scrollTop = 0;
        }
    }
}

function updateProgressIndicators() {
    sectionDots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        
        if (index === meditationGuide.currentSection) {
            dot.classList.add('active');
        } else if (index < meditationGuide.currentSection) {
            dot.classList.add('completed');
        }
    });
}

function updateControlButtons() {
    // 更新上一阶段按钮状态
    prevSectionBtn.disabled = meditationGuide.currentSection === 0;
    
    // 更新下一阶段按钮状态
    const isLastSection = meditationGuide.currentSection === meditationGuide.sections.length - 1;
    nextSectionBtn.disabled = isLastSection;
    nextSectionBtn.innerHTML = isLastSection ? 
        '<i class="fas fa-check btn-icon"></i> 已完成' : 
        '<i class="fas fa-forward btn-icon"></i> 下一阶段';
}

function updateBackgroundLayer() {
    const section = meditationGuide.sections[meditationGuide.currentSection];
    
    // 隐藏所有背景层
    document.querySelectorAll('.bg-layer').forEach(layer => {
        layer.style.opacity = '0';
    });
    
    // 显示当前部分的背景层
    const targetLayer = document.querySelector(`.${section.bgLayer}`);
    if (targetLayer) {
        targetLayer.style.opacity = '1';
    }
    
    // 根据部分调整呼吸圆圈的可见性
    if (section.id === 2 || section.id === 3) {
        breathingCircle.style.opacity = '0.7';
    } else {
        breathingCircle.style.opacity = '0.3';
    }
}

function setAutoPlayMode(isAuto) {
    meditationGuide.isAutoPlay = isAuto;
    
    if (isAuto) {
        autoPlayBtn.classList.add('active');
        manualPlayBtn.classList.remove('active');
        
        // 清除手动模式的计时器
        clearTimeout(meditationGuide.lineTimeout);
        clearTimeout(meditationGuide.sectionTimeout);
        
        // 开始自动播放当前部分
        startAutoPlayLines();
        
        showCustomNotification('📻 自动引导', '已切换为自动引导模式');
    } else {
        autoPlayBtn.classList.remove('active');
        manualPlayBtn.classList.add('active');
        
        // 清除自动播放计时器
        clearTimeout(meditationGuide.lineTimeout);
        clearTimeout(meditationGuide.sectionTimeout);
        
        // 显示当前部分的所有行
        showAllLines();
        
        showCustomNotification('👆 手动引导', '已切换为手动引导模式');
    }
}

function nextSection() {
    if (meditationGuide.currentSection < meditationGuide.sections.length - 1) {
        startMeditationSection(meditationGuide.currentSection + 1);
    }
}

function prevSection() {
    if (meditationGuide.currentSection > 0) {
        startMeditationSection(meditationGuide.currentSection - 1);
    }
}

function goToSection(sectionIndex) {
    if (sectionIndex >= 0 && sectionIndex < meditationGuide.sections.length) {
        startMeditationSection(sectionIndex);
    }
}

function toggleMusic() {
    if (audioManager.isPlaying('background')) {
        audioManager.stopBackgroundMusic();
        musicToggleBtn.classList.remove('active');
        musicToggleBtn.style.color = '#CCCCCC';
        musicToggleBtn.style.borderColor = '#CCCCCC';
        showCustomNotification('🔇 音乐关闭', '背景音乐已关闭');
    } else {
        audioManager.playBackgroundMusic('meditation');
        musicToggleBtn.classList.add('active');
        musicToggleBtn.style.color = 'var(--planet-1)';
        musicToggleBtn.style.borderColor = 'var(--planet-1)';
        showCustomNotification('🔊 音乐开启', '背景音乐已开启');
    }
}

function toggleVoice() {
    // 语音功能暂未实现,只是UI反馈
    const isActive = voiceToggleBtn.classList.contains('active');
    
    if (isActive) {
        voiceToggleBtn.classList.remove('active');
        voiceToggleBtn.style.color = '#CCCCCC';
        voiceToggleBtn.style.borderColor = '#CCCCCC';
        showCustomNotification('🔇 语音关闭', '引导语音已关闭');
    } else {
        voiceToggleBtn.classList.add('active');
        voiceToggleBtn.style.color = 'var(--planet-1)';
        voiceToggleBtn.style.borderColor = 'var(--planet-1)';
        showCustomNotification('🔊 语音开启', '引导语音已开启');
    }
}

function showCompletionSection() {
    completionSection.style.display = 'flex';
    showSuccessNotification('✨ 冥想完成', `现在可以进入你的${currentPlanet.year}星球了`);
}

function enterPlanet() {
    // 显示加载状态
    enterPlanetBtn.disabled = true;
    enterPlanetBtn.innerHTML = '<i class="fas fa-spinner fa-spin btn-icon"></i> 进入中...';
    
    showCustomNotification('🚀 进入星球', `正在进入${currentPlanet.year}星球...`);
    
    // 更新星球状态 - 标记冥想已完成
    if (currentPlanet) {
        currentPlanet.meditationCompleted = true;
        currentPlanet.meditationCompletedAt = Date.now();
        storageManager.savePlanet(currentPlanet);
    }
    
    // 2秒后跳转到愿景碎片页面
    setTimeout(() => {
        // 跳转到愿景碎片页面
        window.location.href = `dreamfragment.html?year=${currentPlanet.year}`;
    }, 2000);
}

// 导出(如果需要)
export { meditationGuide, currentPlanet };

