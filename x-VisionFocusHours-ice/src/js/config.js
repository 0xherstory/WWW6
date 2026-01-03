/**
 * VisionFocus Hours - 全局配置文件
 * 统一管理应用配置、常量和环境变量
 */

// ============ 应用基础配置 ============
export const APP_CONFIG = {
    name: 'VisionFocus Hours',
    version: '1.0.0',
    description: '专注时光愿景板',
    author: 'VisionFocus Team'
};

// ============ 网络配置 ============
export const NETWORK_CONFIG = {
    // Sepolia 测试网
    sepolia: {
        chainId: '0xaa36a7', // 11155111
        chainName: 'Sepolia Test Network',
        nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
    },
    // 默认网络
    default: 'sepolia'
};

// ============ 合约配置 ============
export const CONTRACT_CONFIG = {
    // NFT合约地址 (部署后填写)
    nftAddress: '',
    // 成就合约地址 (部署后填写)
    achievementsAddress: '',
    // OpenSea测试网链接
    openseaTestnet: 'https://testnets.opensea.io/assets/sepolia/'
};

// ============ 存储配置 ============
export const STORAGE_CONFIG = {
    // LocalStorage键名前缀
    prefix: 'vfh_',
    // 主要数据键
    keys: {
        user: 'user',
        planets: 'planets',
        currentPlanet: 'current_planet',
        settings: 'settings'
    },
    // 数据版本 (用于迁移)
    version: '1.0'
};

// ============ 愿望配置 ============
export const WISH_CONFIG = {
    // 愿望数量限制
    minCount: 1,
    maxCount: 12,
    // 愿望类型及对应图标
    types: {
        '事业': 'fa-briefcase',
        '财富': 'fa-coins',
        '健康': 'fa-heart-pulse',
        '家庭': 'fa-home',
        '爱情': 'fa-heart',
        '学习': 'fa-graduation-cap',
        '旅行': 'fa-plane',
        '创作': 'fa-palette',
        '社交': 'fa-users',
        '成长': 'fa-seedling',
        '自由': 'fa-dove',
        '其他': 'fa-star'
    },
    // 默认图标
    defaultIcon: 'fa-star'
};

// ============ 显化效果配置 ============
export const MANIFESTATION_CONFIG = {
    levels: [
        {
            level: 0,
            name: '未显化',
            minHours: 0,
            maxHours: 9,
            effect: 'none',
            color: '#8B9DC3',
            description: '愿望还在沉睡中...'
        },
        {
            level: 1,
            name: '星光初现',
            minHours: 10,
            maxHours: 29,
            effect: 'sparkle',
            color: '#FFE4B5',
            description: '愿望开始闪烁微光 ✨'
        },
        {
            level: 2,
            name: '微光荧荧',
            minHours: 30,
            maxHours: 59,
            effect: 'glow',
            color: '#87CEEB',
            description: '愿望散发柔和光芒 🌟'
        },
        {
            level: 3,
            name: '金色流光',
            minHours: 60,
            maxHours: 99,
            effect: 'golden-flow',
            color: '#FFD700',
            description: '愿望绽放金色光芒 ⭐'
        },
        {
            level: 4,
            name: '钻石七彩',
            minHours: 100,
            maxHours: Infinity,
            effect: 'rainbow-diamond',
            color: '#FF1493',
            description: '愿望闪耀七彩光辉 💎'
        }
    ]
};

// ============ 音频配置 ============
export const AUDIO_CONFIG = {
    // 音频文件路径
    paths: {
        meditation: '../assets/audio/guide.wav',
        coinDrop: '../assets/audio/coin.mp3',
        success: '../assets/audio/success.mp3',
        milestone: '../assets/audio/milestone.mp3',
        background: '../assets/audio/background.mp3'
    },
    // 默认音量
    volumes: {
        meditation: 0.8,
        effects: 0.6,
        background: 0.3
    }
};

// ============ 动画配置 ============
export const ANIMATION_CONFIG = {
    // Lottie动画路径
    lottie: {
        coinDrop: '../assets/animations/coin-drop.json',
        planetBirth: '../assets/animations/planet-birth.json',
        starSparkle: '../assets/animations/star-sparkle.json'
    },
    // 动画持续时间 (毫秒)
    durations: {
        coinDrop: 1500,
        pageTransition: 500,
        manifestation: 2000
    }
};

// ============ 冥想引导配置 ============
export const MEDITATION_CONFIG = {
    stages: [
        {
            id: 1,
            name: '放松身体',
            duration: 120, // 秒
            texts: [
                '欢迎来到专注时光的冥想引导',
                '请找一个舒适的姿势，轻轻闭上眼睛',
                '深呼吸，让身体完全放松下来...'
            ]
        },
        {
            id: 2,
            name: '回顾过去',
            duration: 180,
            texts: [
                '回想过去一年，你经历了什么？',
                '哪些时刻让你感到骄傲？',
                '哪些挑战让你成长？'
            ]
        },
        {
            id: 3,
            name: '展望未来',
            duration: 180,
            texts: [
                '现在，想象一年后的自己',
                '你想成为什么样的人？',
                '你的生活是什么样子？'
            ]
        },
        {
            id: 4,
            name: '许下愿望',
            duration: 240,
            texts: [
                '在这个美好的憧憬中',
                '你最想实现的愿望是什么？',
                '让这些愿望在心中慢慢浮现...'
            ]
        },
        {
            id: 5,
            name: '回到当下',
            duration: 120,
            texts: [
                '慢慢睁开眼睛',
                '带着这份清晰和力量',
                '准备好记录你的愿望了吗？'
            ]
        }
    ],
    totalDuration: 840 // 14分钟
};

// ============ 路由配置 ============
export const ROUTE_CONFIG = {
    pages: {
        index: '../index.html',
        home: './home.html',
        meditation: './meditation.html',
        wishes: './wishes.html',
        board: './board.html',
        focus: './focus.html',
        nft: './nft.html',
        summary: './summary.html'
    }
};

// ============ 主题配置 ============
export const THEME_CONFIG = {
    colors: {
        primary: '#FF9F7F',      // 主色调 - 温暖橙
        secondary: '#FFD4B8',    // 辅助色 - 奶油橙
        accent: '#FFF4E6',       // 强调色 - 浅米色
        background: '#0a0e27',   // 背景色 - 深蓝
        text: '#333333',         // 文字色
        textLight: '#FFFFFF'     // 浅色文字
    },
    fonts: {
        title: "'Ma Shan Zheng', cursive",
        display: "'ZCOOL QingKe HuangYou', cursive",
        body: "'Noto Serif SC', serif"
    }
};

// ============ 开发配置 ============
export const DEV_CONFIG = {
    // 调试模式
    debug: true,
    // 演示模式 (预填充数据)
    demoMode: false,
    // 跳过冥想
    skipMeditation: false,
    // 日志级别
    logLevel: 'info' // 'debug' | 'info' | 'warn' | 'error'
};

// ============ 工具函数 ============

/**
 * 获取完整的存储键名
 */
export function getStorageKey(key) {
    return STORAGE_CONFIG.prefix + key;
}

/**
 * 根据小时数获取显化等级
 */
export function getManifestationLevel(hours) {
    for (const level of MANIFESTATION_CONFIG.levels) {
        if (hours >= level.minHours && hours <= level.maxHours) {
            return level;
        }
    }
    return MANIFESTATION_CONFIG.levels[0];
}

/**
 * 根据关键词匹配愿望类型
 */
export function matchWishType(text) {
    for (const [type, icon] of Object.entries(WISH_CONFIG.types)) {
        if (text.includes(type)) {
            return { type, icon };
        }
    }
    return { type: '其他', icon: WISH_CONFIG.defaultIcon };
}

/**
 * 日志输出 (根据配置决定是否输出)
 */
export function log(level, ...args) {
    if (!DEV_CONFIG.debug) return;
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(DEV_CONFIG.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex >= currentLevelIndex) {
        console[level]('[VFH]', ...args);
    }
}

// 导出默认配置对象
export default {
    APP_CONFIG,
    NETWORK_CONFIG,
    CONTRACT_CONFIG,
    STORAGE_CONFIG,
    WISH_CONFIG,
    MANIFESTATION_CONFIG,
    AUDIO_CONFIG,
    ANIMATION_CONFIG,
    MEDITATION_CONFIG,
    ROUTE_CONFIG,
    THEME_CONFIG,
    DEV_CONFIG
};

