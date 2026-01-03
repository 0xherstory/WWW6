/**
 * VisionFocus Hours - 投币动画效果
 * 处理专注时光投入的视觉反馈
 */

import { log } from '../config.js';
import audioManager from '../utils/audio.js';
import { random } from '../utils/helpers.js';

/**
 * 投币动画类
 */
export class CoinDropAnimation {
    constructor(container) {
        this.container = container;
        this.isPlaying = false;
    }

    /**
     * 播放投币动画
     */
    async play(hours = 1, targetElement = null) {
        if (this.isPlaying) {
            log('warn', 'Coin animation already playing');
            return;
        }
        
        this.isPlaying = true;
        log('info', `Playing coin drop animation for ${hours} hour(s)`);
        
        // 播放音效
        audioManager.playCoinDrop();
        
        // 创建金币元素
        for (let i = 0; i < hours; i++) {
            setTimeout(() => {
                this.createCoin(targetElement);
            }, i * 200); // 每个金币间隔200ms
        }
        
        // 等待动画完成
        await new Promise(resolve => setTimeout(resolve, 1500 + hours * 200));
        
        this.isPlaying = false;
        log('info', 'Coin drop animation completed');
    }

    /**
     * 创建单个金币
     */
    createCoin(targetElement) {
        const coin = document.createElement('div');
        coin.className = 'coin-element';
        coin.innerHTML = '🪙';
        
        // 随机起始位置
        const startX = random(20, 80);
        coin.style.left = `${startX}%`;
        coin.style.top = '-50px';
        coin.style.position = 'absolute';
        coin.style.fontSize = '48px';
        coin.style.zIndex = '1000';
        
        this.container.appendChild(coin);
        
        // 应用动画
        setTimeout(() => {
            coin.classList.add('coin-drop');
            
            if (targetElement) {
                const targetRect = targetElement.getBoundingClientRect();
                const containerRect = this.container.getBoundingClientRect();
                const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
                const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
                
                coin.style.left = `${targetX}px`;
                coin.style.top = `${targetY}px`;
            }
        }, 10);
        
        // 创建粒子效果
        setTimeout(() => {
            this.createParticles(coin);
        }, 1400);
        
        // 移除金币
        setTimeout(() => {
            if (coin.parentNode) {
                coin.parentNode.removeChild(coin);
            }
        }, 1600);
    }

    /**
     * 创建粒子爆炸效果
     */
    createParticles(coin) {
        const rect = coin.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        const centerX = rect.left - containerRect.left + rect.width / 2;
        const centerY = rect.top - containerRect.top + rect.height / 2;
        
        // 创建8个粒子
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (Math.PI * 2 * i) / 8;
            const distance = random(30, 60);
            const x = Math.cos(angle) * distance;
            
            particle.style.cssText = `
                position: absolute;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: #FFD700;
                border-radius: 50%;
                --x: ${x}px;
            `;
            
            this.container.appendChild(particle);
            
            // 移除粒子
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }

    /**
     * 停止动画
     */
    stop() {
        this.isPlaying = false;
        
        // 移除所有金币和粒子
        const coins = this.container.querySelectorAll('.coin-element');
        const particles = this.container.querySelectorAll('.particle');
        
        coins.forEach(coin => coin.remove());
        particles.forEach(particle => particle.remove());
    }
}

/**
 * 创建投币动画实例
 */
export function createCoinAnimation(container) {
    return new CoinDropAnimation(container);
}

/**
 * 快速播放投币动画 (简化版)
 */
export async function playCoinDrop(hours = 1, options = {}) {
    const container = options.container || document.body;
    const animation = new CoinDropAnimation(container);
    await animation.play(hours, options.target);
}

export default {
    CoinDropAnimation,
    createCoinAnimation,
    playCoinDrop
};

