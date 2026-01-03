/**
 * VisionFocus Hours - LocalStorage 数据管理器
 * 统一管理所有本地数据的读写、更新和删除
 */

import { STORAGE_CONFIG, getStorageKey, log } from '../config.js';

/**
 * 数据结构定义:
 * {
 *   user: {
 *     wallet: '0x...',
 *     nickname: '',
 *     createdAt: timestamp
 *   },
 *   planets: [
 *     {
 *       year: 2025,
 *       createdAt: timestamp,
 *       meditationCompleted: boolean,
 *       wishes: [
 *         {
 *           id: 'wish_xxx',
 *           text: '愿望内容',
 *           type: '事业',
 *           icon: 'fa-briefcase',
 *           focusHours: 0,
 *           createdAt: timestamp
 *         }
 *       ],
 *       visionBoard: {
 *         layout: 'grid' | 'free',
 *         items: [
 *           {
 *             id: 'item_xxx',
 *             type: 'wish' | 'image' | 'text' | 'sticker',
 *             wishId: '',
 *             content: '',
 *             position: { x, y, width, height, rotation },
 *             style: {}
 *           }
 *         ],
 *         background: '',
 *         savedAt: timestamp
 *       },
 *       focusRecords: [
 *         {
 *           id: 'record_xxx',
 *           wishId: '',
 *           hours: 1,
 *           note: '',
 *           timestamp: timestamp
 *         }
 *       ],
 *       totalHours: 0,
 *       nft: {
 *         generated: boolean,
 *         tokenId: '',
 *         imageUrl: '',
 *         mintedAt: timestamp
 *       }
 *     }
 *   ],
 *   currentPlanet: 2025,
 *   settings: {
 *     volume: 0.6,
 *     autoSave: true,
 *     skipMeditation: false,
 *     debugMode: false
 *   }
 * }
 */

class StorageManager {
    constructor() {
        this.init();
    }

    /**
     * 初始化存储
     */
    init() {
        log('info', 'Initializing StorageManager...');
        
        // 检查是否首次使用
        if (!this.get('user')) {
            this.initializeDefaultData();
        }
        
        // 检查数据版本
        this.checkDataVersion();
        
        log('info', 'StorageManager initialized');
    }

    /**
     * 初始化默认数据
     */
    initializeDefaultData() {
        log('info', 'Initializing default data...');
        
        this.set('user', {
            wallet: '',
            nickname: '',
            createdAt: Date.now()
        });
        
        this.set('planets', []);
        this.set('currentPlanet', new Date().getFullYear());
        this.set('settings', {
            volume: 0.6,
            autoSave: true,
            skipMeditation: false,
            debugMode: false
        });
        
        this.set('dataVersion', STORAGE_CONFIG.version);
    }

    /**
     * 检查数据版本并迁移
     */
    checkDataVersion() {
        const currentVersion = this.get('dataVersion');
        
        if (currentVersion !== STORAGE_CONFIG.version) {
            log('warn', `Data version mismatch: ${currentVersion} -> ${STORAGE_CONFIG.version}`);
            // 这里可以添加数据迁移逻辑
            this.set('dataVersion', STORAGE_CONFIG.version);
        }
    }

    /**
     * 基础存储操作
     */
    get(key) {
        try {
            const fullKey = getStorageKey(key);
            const value = localStorage.getItem(fullKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            log('error', `Error getting ${key}:`, error);
            return null;
        }
    }

    set(key, value) {
        try {
            const fullKey = getStorageKey(key);
            localStorage.setItem(fullKey, JSON.stringify(value));
            log('debug', `Saved ${key}:`, value);
            return true;
        } catch (error) {
            log('error', `Error setting ${key}:`, error);
            return false;
        }
    }

    remove(key) {
        try {
            const fullKey = getStorageKey(key);
            localStorage.removeItem(fullKey);
            log('debug', `Removed ${key}`);
            return true;
        } catch (error) {
            log('error', `Error removing ${key}:`, error);
            return false;
        }
    }

    clear() {
        try {
            // 只清除本应用的数据
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(STORAGE_CONFIG.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            log('info', 'Storage cleared');
            return true;
        } catch (error) {
            log('error', 'Error clearing storage:', error);
            return false;
        }
    }

    /**
     * ========== 用户相关 ==========
     */

    getUser() {
        return this.get('user');
    }

    setUser(userData) {
        return this.set('user', userData);
    }

    updateUser(updates) {
        const user = this.getUser();
        return this.set('user', { ...user, ...updates });
    }

    /**
     * ========== 星球相关 ==========
     */

    getPlanets() {
        return this.get('planets') || [];
    }

    getPlanet(year) {
        const planets = this.getPlanets();
        return planets.find(p => p.year === year);
    }

    getCurrentPlanet() {
        const currentYear = this.get('currentPlanet');
        return this.getPlanet(currentYear);
    }

    getCurrentYear() {
        return this.get('currentPlanet');
    }

    setCurrentYear(year) {
        return this.set('currentPlanet', year);
    }

    /**
     * 创建新星球
     */
    createPlanet(year) {
        log('info', `Creating planet for year ${year}...`);
        
        const planets = this.getPlanets();
        
        // 检查是否已存在
        if (planets.find(p => p.year === year)) {
            log('warn', `Planet for ${year} already exists`);
            return false;
        }
        
        const newPlanet = {
            year,
            createdAt: Date.now(),
            // 流程完成状态
            meditationCompleted: false,
            meditationCompletedAt: null,
            dreamFragmentsCompleted: false,
            dreamFragmentsCompletedAt: null,
            visionBoardCompleted: false,
            visionBoardCompletedAt: null,
            // 愿望碎片
            wishes: [],
            // 愿景板
            visionBoard: {
                layout: 'grid',
                items: [],
                background: '',
                savedAt: null
            },
            // 专注记录
            focusRecords: [],
            totalHours: 0,
            // NFT
            nft: {
                generated: false,
                tokenId: '',
                imageUrl: '',
                mintedAt: null
            }
        };
        
        planets.push(newPlanet);
        this.set('planets', planets);
        this.setCurrentYear(year);
        
        log('info', `Planet ${year} created successfully`);
        return newPlanet;
    }

    /**
     * 更新星球数据
     */
    updatePlanet(year, updates) {
        const planets = this.getPlanets();
        const index = planets.findIndex(p => p.year === year);
        
        if (index === -1) {
            log('error', `Planet ${year} not found`);
            return false;
        }
        
        planets[index] = { ...planets[index], ...updates };
        return this.set('planets', planets);
    }

    /**
     * 标记冥想完成
     */
    completeMeditation(year) {
        return this.updatePlanet(year, { meditationCompleted: true });
    }

    /**
     * ========== 愿望相关 ==========
     */

    getWishes(year) {
        const planet = this.getPlanet(year);
        return planet ? planet.wishes : [];
    }

    getCurrentWishes() {
        const year = this.getCurrentYear();
        return this.getWishes(year);
    }

    /**
     * 保存愿望列表
     */
    saveWishes(year, wishes) {
        log('info', `Saving ${wishes.length} wishes for ${year}...`);
        
        // 为每个愿望添加ID和创建时间
        const wishesWithMeta = wishes.map((wish, index) => ({
            id: wish.id || `wish_${year}_${index}_${Date.now()}`,
            text: wish.text,
            type: wish.type || '其他',
            icon: wish.icon || 'fa-star',
            focusHours: wish.focusHours || 0,
            createdAt: wish.createdAt || Date.now()
        }));
        
        return this.updatePlanet(year, { wishes: wishesWithMeta });
    }

    /**
     * 更新单个愿望
     */
    updateWish(year, wishId, updates) {
        const planet = this.getPlanet(year);
        if (!planet) return false;
        
        const wishIndex = planet.wishes.findIndex(w => w.id === wishId);
        if (wishIndex === -1) return false;
        
        planet.wishes[wishIndex] = { ...planet.wishes[wishIndex], ...updates };
        return this.updatePlanet(year, { wishes: planet.wishes });
    }

    /**
     * 获取愿望的专注时长
     */
    getWishFocusHours(year, wishId) {
        const planet = this.getPlanet(year);
        if (!planet) return 0;
        
        const wish = planet.wishes.find(w => w.id === wishId);
        return wish ? wish.focusHours : 0;
    }

    /**
     * ========== 愿景板相关 ==========
     */

    getVisionBoard(year) {
        const planet = this.getPlanet(year);
        return planet ? planet.visionBoard : null;
    }

    getCurrentVisionBoard() {
        const year = this.getCurrentYear();
        return this.getVisionBoard(year);
    }

    /**
     * 保存愿景板
     */
    saveVisionBoard(year, visionBoard) {
        log('info', `Saving vision board for ${year}...`);
        
        const boardWithMeta = {
            ...visionBoard,
            savedAt: Date.now()
        };
        
        return this.updatePlanet(year, { visionBoard: boardWithMeta });
    }

    /**
     * ========== 专注时光记录相关 ==========
     */

    getFocusRecords(year) {
        const planet = this.getPlanet(year);
        return planet ? planet.focusRecords : [];
    }

    getCurrentFocusRecords() {
        const year = this.getCurrentYear();
        return this.getFocusRecords(year);
    }

    /**
     * 添加专注时光记录
     */
    addFocusRecord(year, wishId, hours, note = '') {
        log('info', `Adding focus record: ${hours}h for wish ${wishId}...`);
        
        const planet = this.getPlanet(year);
        if (!planet) {
            log('error', `Planet ${year} not found`);
            return false;
        }
        
        // 创建新记录
        const record = {
            id: `record_${Date.now()}`,
            wishId,
            hours,
            note,
            timestamp: Date.now()
        };
        
        // 添加到记录列表
        planet.focusRecords.push(record);
        
        // 更新愿望的总时长
        const wishIndex = planet.wishes.findIndex(w => w.id === wishId);
        if (wishIndex !== -1) {
            planet.wishes[wishIndex].focusHours += hours;
        }
        
        // 更新星球总时长
        planet.totalHours += hours;
        
        // 保存
        const success = this.set('planets', this.getPlanets());
        
        if (success) {
            log('info', `Focus record added. Total hours: ${planet.totalHours}`);
        }
        
        return success ? record : false;
    }

    /**
     * 获取星球总时长
     */
    getTotalHours(year) {
        const planet = this.getPlanet(year);
        return planet ? planet.totalHours : 0;
    }

    getCurrentTotalHours() {
        const year = this.getCurrentYear();
        return this.getTotalHours(year);
    }

    /**
     * ========== NFT相关 ==========
     */

    getNFT(year) {
        const planet = this.getPlanet(year);
        return planet ? planet.nft : null;
    }

    getCurrentNFT() {
        const year = this.getCurrentYear();
        return this.getNFT(year);
    }

    /**
     * 保存NFT信息
     */
    saveNFT(year, nftData) {
        log('info', `Saving NFT for ${year}...`);
        
        const nft = {
            ...nftData,
            generated: true,
            generatedAt: Date.now()
        };
        
        return this.updatePlanet(year, { nft });
    }

    /**
     * 标记NFT已铸造
     */
    markNFTMinted(year, tokenId, transactionHash) {
        const nft = this.getNFT(year);
        if (!nft) return false;
        
        return this.updatePlanet(year, {
            nft: {
                ...nft,
                minted: true,
                tokenId,
                transactionHash,
                mintedAt: Date.now()
            }
        });
    }

    /**
     * ========== 设置相关 ==========
     */

    getSettings() {
        return this.get('settings') || {};
    }

    getSetting(key) {
        const settings = this.getSettings();
        return settings[key];
    }

    updateSettings(updates) {
        const settings = this.getSettings();
        return this.set('settings', { ...settings, ...updates });
    }

    /**
     * ========== 统计数据 ==========
     */

    /**
     * 获取所有年份的统计
     */
    getAllStats() {
        const planets = this.getPlanets();
        
        return {
            totalYears: planets.length,
            totalWishes: planets.reduce((sum, p) => sum + p.wishes.length, 0),
            totalHours: planets.reduce((sum, p) => sum + p.totalHours, 0),
            totalNFTs: planets.filter(p => p.nft.generated).length,
            yearlyStats: planets.map(p => ({
                year: p.year,
                wishes: p.wishes.length,
                hours: p.totalHours,
                nftMinted: p.nft.minted || false
            }))
        };
    }

    /**
     * 导出所有数据
     */
    exportAllData() {
        log('info', 'Exporting all data...');
        
        return {
            user: this.getUser(),
            planets: this.getPlanets(),
            currentPlanet: this.getCurrentYear(),
            settings: this.getSettings(),
            exportedAt: Date.now(),
            version: STORAGE_CONFIG.version
        };
    }

    /**
     * 导入数据
     */
    importData(data) {
        log('info', 'Importing data...');
        
        try {
            if (data.user) this.setUser(data.user);
            if (data.planets) this.set('planets', data.planets);
            if (data.currentPlanet) this.setCurrentYear(data.currentPlanet);
            if (data.settings) this.updateSettings(data.settings);
            
            log('info', 'Data imported successfully');
            return true;
        } catch (error) {
            log('error', 'Error importing data:', error);
            return false;
        }
    }
}

// 创建单例
const storageManager = new StorageManager();

// 导出单例
export default storageManager;

// 也导出类，方便测试
export { StorageManager };

