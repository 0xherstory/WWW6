/**
 * VisionFocus Hours - 显化效果管理
 * 处理愿望显化的视觉效果 (4个等级)
 */

import { MANIFESTATION_CONFIG, getManifestationLevel, log } from '../config.js';
import { showCustomNotification } from '../utils/helpers.js';

/**
 * 显化效果类
 */
export class ManifestationEffect {
    constructor(element) {
        this.element = element;
        this.currentLevel = 0;
        this.hours = 0;
    }

    /**
     * 更新显化效果
     */
    update(hours) {
        const oldLevel = this.currentLevel;
        const newLevel = getManifestationLevel(hours);
        
        this.hours = hours;
        this.currentLevel = newLevel.level;
        
        log('debug', `Manifestation: ${hours}h -> Level ${newLevel.level} (${newLevel.name})`);
        
        // 移除旧效果
        this.removeAllEffects();
        
        // 应用新效果
        this.applyEffect(newLevel);
        
        // 如果等级提升,显示通知
        if (newLevel.level > oldLevel) {
            this.showLevelUpNotification(newLevel);
        }
    }

    /**
     * 移除所有效果
     */
    removeAllEffects() {
        for (let i = 0; i <= 4; i++) {
            this.element.classList.remove(`manifestation-${i}`);
        }
    }

    /**
     * 应用显化效果
     */
    applyEffect(level) {
        // 添加对应等级的CSS类
        this.element.classList.add(`manifestation-${level.level}`);
        
        // 设置颜色
        this.element.style.borderColor = level.color;
        
        // 根据等级添加特殊效果
        switch (level.level) {
            case 0:
                // 未显化 - 灰暗效果
                this.element.style.filter = 'grayscale(50%) brightness(0.8)';
                break;
                
            case 1:
                // 星光初现
                this.element.style.filter = '';
                this.addSparkles();
                break;
                
            case 2:
                // 微光荧荧
                this.element.style.filter = '';
                this.addGlow();
                break;
                
            case 3:
                // 金色流光
                this.element.style.filter = '';
                this.addGoldenFlow();
                break;
                
            case 4:
                // 钻石七彩
                this.element.style.filter = '';
                this.addRainbowDiamond();
                break;
        }
    }

    /**
     * 添加星星效果 (Level 1)
     */
    addSparkles() {
        // 在元素周围添加小星星
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-effect';
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                top: ${-10 + i * 10}px;
                right: ${-10 + i * 10}px;
                font-size: 12px;
                animation: star-twinkle 2s ease-in-out infinite;
                animation-delay: ${i * 0.3}s;
            `;
            
            this.element.style.position = 'relative';
            this.element.appendChild(sparkle);
        }
    }

    /**
     * 添加光晕效果 (Level 2)
     */
    addGlow() {
        this.element.style.boxShadow = '0 0 20px rgba(135, 206, 235, 0.6)';
    }

    /**
     * 添加金色流光 (Level 3)
     */
    addGoldenFlow() {
        const flow = document.createElement('div');
        flow.className = 'golden-flow-effect';
        flow.style.cssText = `
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent);
            border-radius: inherit;
            pointer-events: none;
            animation: flow 2s linear infinite;
        `;
        
        this.element.style.position = 'relative';
        this.element.appendChild(flow);
    }

    /**
     * 添加七彩钻石效果 (Level 4)
     */
    addRainbowDiamond() {
        // 添加钻石图标
        const diamond = document.createElement('div');
        diamond.className = 'diamond-icon';
        diamond.innerHTML = '💎';
        diamond.style.cssText = `
            position: absolute;
            top: -20px;
            right: -20px;
            font-size: 24px;
            animation: float 2s ease-in-out infinite;
            z-index: 10;
        `;
        
        this.element.style.position = 'relative';
        this.element.appendChild(diamond);
        
        // 添加彩虹边框
        this.element.style.boxShadow = '0 0 30px rgba(255, 20, 147, 0.8)';
    }

    /**
     * 显示等级提升通知
     */
    showLevelUpNotification(level) {
        const message = `${level.name} ${level.description}`;
        showCustomNotification('✨ 显化升级!', message, 3000);
        
        log('info', `Level up: ${level.name}`);
    }

    /**
     * 清除效果
     */
    clear() {
        this.removeAllEffects();
        
        // 移除添加的元素
        const added = this.element.querySelectorAll('.sparkle-effect, .golden-flow-effect, .diamond-icon');
        added.forEach(el => el.remove());
        
        // 重置样式
        this.element.style.filter = '';
        this.element.style.boxShadow = '';
        this.element.style.borderColor = '';
    }
}

/**
 * 为元素应用显化效果
 */
export function applyManifestationEffect(element, hours) {
    const effect = new ManifestationEffect(element);
    effect.update(hours);
    return effect;
}

/**
 * 批量更新显化效果
 */
export function updateAllManifestations(wishes) {
    wishes.forEach(wish => {
        const element = document.querySelector(`[data-wish-id="${wish.id}"]`);
        if (element) {
            applyManifestationEffect(element, wish.focusHours);
        }
    });
}

/**
 * 获取显化进度百分比
 */
export function getManifestationProgress(hours) {
    const levels = MANIFESTATION_CONFIG.levels;
    
    // 找到当前等级
    let currentLevel = levels[0];
    for (const level of levels) {
        if (hours >= level.minHours && hours <= level.maxHours) {
            currentLevel = level;
            break;
        }
    }
    
    // 如果是最高等级
    if (currentLevel.level === 4) {
        return 100;
    }
    
    // 计算当前等级的进度
    const nextLevel = levels[currentLevel.level + 1];
    if (!nextLevel) return 100;
    
    const range = nextLevel.minHours - currentLevel.minHours;
    const progress = hours - currentLevel.minHours;
    
    return Math.min(100, (progress / range) * 100);
}

/**
 * 获取下一等级所需时长
 */
export function getHoursToNextLevel(hours) {
    const levels = MANIFESTATION_CONFIG.levels;
    
    for (let i = 0; i < levels.length - 1; i++) {
        if (hours >= levels[i].minHours && hours < levels[i + 1].minHours) {
            return levels[i + 1].minHours - hours;
        }
    }
    
    return 0; // 已达最高等级
}

/**
 * 创建显化进度条
 */
export function createManifestationProgressBar(container, hours) {
    const level = getManifestationLevel(hours);
    const progress = getManifestationProgress(hours);
    const toNext = getHoursToNextLevel(hours);
    
    const html = `
        <div class="manifestation-progress">
            <div class="progress-header">
                <span class="progress-level">${level.name}</span>
                <span class="progress-hours">${hours}小时</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" 
                     style="width: ${progress}%; background: ${level.color};">
                </div>
            </div>
            <div class="progress-footer">
                <span class="progress-description">${level.description}</span>
                ${toNext > 0 ? `<span class="progress-next">还需 ${toNext}h 升级</span>` : '<span class="progress-max">已达最高等级!</span>'}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

export default {
    ManifestationEffect,
    applyManifestationEffect,
    updateAllManifestations,
    getManifestationProgress,
    getHoursToNextLevel,
    createManifestationProgressBar
};

