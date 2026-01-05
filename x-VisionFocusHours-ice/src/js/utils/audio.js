/**
 * VisionFocus Hours - 音频管理器
 * 处理冥想引导音频、音效播放等
 */

import { AUDIO_CONFIG, log } from '../config.js';
import storageManager from './storage.js';

class AudioManager {
    constructor() {
        this.audios = {};
        this.currentAudio = null;
        this.volume = 0.6;
        this.isMuted = false;
        
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        log('info', 'Initializing AudioManager...');
        
        // 从设置读取音量
        const settings = storageManager.getSettings();
        if (settings.volume !== undefined) {
            this.volume = settings.volume;
        }
        
        // 预加载音频文件
        this.preloadAudios();
    }

    /**
     * 预加载音频
     */
    preloadAudios() {
        // 这里先不预加载，按需加载以提高性能
        log('debug', 'Audio files will be loaded on demand');
    }

    /**
     * 获取或创建音频实例
     */
    getAudio(name) {
        if (this.audios[name]) {
            return this.audios[name];
        }
        
        const path = AUDIO_CONFIG.paths[name];
        if (!path) {
            log('error', `Audio '${name}' not found in config`);
            return null;
        }
        
        const audio = new Audio(path);
        audio.volume = this.volume;
        this.audios[name] = audio;
        
        // 添加错误处理
        audio.addEventListener('error', (e) => {
            log('error', `Error loading audio '${name}':`, e);
        });
        
        log('debug', `Audio '${name}' loaded`);
        return audio;
    }

    /**
     * 播放音频
     */
    play(name, options = {}) {
        try {
            const audio = this.getAudio(name);
            if (!audio) return false;
            
            // 如果静音，不播放
            if (this.isMuted && !options.force) {
                log('debug', `Audio '${name}' muted`);
                return false;
            }
            
            // 设置音量
            if (options.volume !== undefined) {
                audio.volume = options.volume;
            } else {
                audio.volume = this.volume;
            }
            
            // 设置循环
            audio.loop = options.loop || false;
            
            // 从头播放
            audio.currentTime = 0;
            
            // 播放
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        log('debug', `Audio '${name}' playing`);
                        this.currentAudio = audio;
                        
                        // 播放完成回调
                        if (options.onEnded && !audio.loop) {
                            audio.addEventListener('ended', options.onEnded, { once: true });
                        }
                    })
                    .catch(error => {
                        log('error', `Error playing audio '${name}':`, error);
                    });
            }
            
            return true;
        } catch (error) {
            log('error', `Error in play('${name}'):`, error);
            return false;
        }
    }

    /**
     * 暂停音频
     */
    pause(name) {
        const audio = name ? this.audios[name] : this.currentAudio;
        if (audio) {
            audio.pause();
            log('debug', `Audio '${name || 'current'}' paused`);
        }
    }

    /**
     * 停止音频
     */
    stop(name) {
        const audio = name ? this.audios[name] : this.currentAudio;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            log('debug', `Audio '${name || 'current'}' stopped`);
        }
    }

    /**
     * 停止所有音频
     */
    stopAll() {
        Object.values(this.audios).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.currentAudio = null;
        log('debug', 'All audios stopped');
    }

    /**
     * 设置音量
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // 更新所有音频实例的音量
        Object.values(this.audios).forEach(audio => {
            audio.volume = this.volume;
        });
        
        // 保存到设置
        storageManager.updateSettings({ volume: this.volume });
        
        log('debug', `Volume set to ${this.volume}`);
    }

    /**
     * 获取音量
     */
    getVolume() {
        return this.volume;
    }

    /**
     * 静音/取消静音
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        log('debug', `Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
        return this.isMuted;
    }

    /**
     * 设置静音
     */
    mute() {
        this.isMuted = true;
        log('debug', 'Audio muted');
    }

    /**
     * 取消静音
     */
    unmute() {
        this.isMuted = false;
        log('debug', 'Audio unmuted');
    }

    /**
     * 是否静音
     */
    isMute() {
        return this.isMuted;
    }

    /**
     * ========== 特定音频播放方法 ==========
     */

    /**
     * 播放冥想引导音频
     */
    playMeditation(options = {}) {
        return this.play('meditation', {
            volume: AUDIO_CONFIG.volumes.meditation,
            ...options
        });
    }

    /**
     * 暂停冥想引导
     */
    pauseMeditation() {
        this.pause('meditation');
    }

    /**
     * 播放投币音效
     */
    playCoinDrop() {
        return this.play('coinDrop', {
            volume: AUDIO_CONFIG.volumes.effects
        });
    }

    /**
     * 播放成功音效
     */
    playSuccess() {
        return this.play('success', {
            volume: AUDIO_CONFIG.volumes.effects
        });
    }

    /**
     * 播放里程碑音效
     */
    playMilestone() {
        return this.play('milestone', {
            volume: AUDIO_CONFIG.volumes.effects
        });
    }

    /**
     * 播放背景音乐
     */
    playBackground() {
        return this.play('background', {
            volume: AUDIO_CONFIG.volumes.background,
            loop: true
        });
    }

    /**
     * 停止背景音乐
     */
    stopBackground() {
        this.stop('background');
    }

    /**
     * 获取音频播放状态
     */
    isPlaying(name) {
        const audio = this.audios[name];
        return audio && !audio.paused;
    }

    /**
     * 获取音频当前时间
     */
    getCurrentTime(name) {
        const audio = this.audios[name];
        return audio ? audio.currentTime : 0;
    }

    /**
     * 设置音频当前时间
     */
    setCurrentTime(name, time) {
        const audio = this.audios[name];
        if (audio) {
            audio.currentTime = time;
        }
    }

    /**
     * 获取音频总时长
     */
    getDuration(name) {
        const audio = this.audios[name];
        return audio ? audio.duration : 0;
    }

    /**
     * 淡入效果
     */
    fadeIn(name, duration = 1000) {
        const audio = this.getAudio(name);
        if (!audio) return;
        
        audio.volume = 0;
        this.play(name);
        
        const targetVolume = this.volume;
        const steps = 50;
        const stepTime = duration / steps;
        const volumeStep = targetVolume / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                audio.volume = targetVolume;
                return;
            }
            
            audio.volume = Math.min(volumeStep * currentStep, targetVolume);
            currentStep++;
        }, stepTime);
    }

    /**
     * 淡出效果
     */
    fadeOut(name, duration = 1000) {
        const audio = this.audios[name];
        if (!audio || audio.paused) return;
        
        const startVolume = audio.volume;
        const steps = 50;
        const stepTime = duration / steps;
        const volumeStep = startVolume / steps;
        
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                audio.pause();
                audio.volume = startVolume;
                audio.currentTime = 0;
                return;
            }
            
            audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
            currentStep++;
        }, stepTime);
    }

    /**
     * 释放资源
     */
    destroy() {
        this.stopAll();
        Object.values(this.audios).forEach(audio => {
            audio.src = '';
        });
        this.audios = {};
        log('info', 'AudioManager destroyed');
    }
}

// 创建单例
const audioManager = new AudioManager();

// 导出单例
export default audioManager;

// 也导出类
export { AudioManager };

