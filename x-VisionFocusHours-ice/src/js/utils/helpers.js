/**
 * VisionFocus Hours - 辅助工具函数
 * 通用的工具函数集合
 */

/**
 * 生成唯一ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化日期
 */
export function formatDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    const date = new Date(timestamp);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 深拷贝
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

/**
 * 随机数生成
 */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 等待指定时间
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 显示自定义通知 (简化版,确保可用)
 */
export function showCustomNotification(title, message = '', duration = 3000) {
    // 检查是否已有通知容器
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: rgba(10, 10, 40, 0.95);
        backdrop-filter: blur(10px);
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        border-left: 4px solid #4ECDC4;
        min-width: 300px;
        max-width: 400px;
        pointer-events: auto;
        animation: slideIn 0.3s ease-out;
        color: white;
        font-family: 'Noto Serif SC', serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <i class="fas fa-info-circle" style="color: #4ECDC4; font-size: 20px; margin-top: 2px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${title}</div>
                ${message ? `<div style="font-size: 14px; color: #CCC;">${message}</div>` : ''}
            </div>
        </div>
    `;
    
    // 添加到容器
    container.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    // 添加CSS动画
    if (!document.getElementById('notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideIn {
                from { 
                    transform: translateX(400px);
                    opacity: 0;
                }
                to { 
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 显示错误通知
 */
export function showErrorNotification(title, message = '', duration = 4000) {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: rgba(40, 10, 10, 0.95);
        backdrop-filter: blur(10px);
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        border-left: 4px solid #FF6B6B;
        min-width: 300px;
        max-width: 400px;
        pointer-events: auto;
        animation: slideIn 0.3s ease-out;
        color: white;
        font-family: 'Noto Serif SC', serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <i class="fas fa-exclamation-circle" style="color: #FF6B6B; font-size: 20px; margin-top: 2px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${title}</div>
                ${message ? `<div style="font-size: 14px; color: #FCC;">${message}</div>` : ''}
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
    `;
    document.body.appendChild(container);
    return container;
}

/**
 * 显示成功通知
 */
export function showSuccessNotification(title, message = '', duration = 3000) {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: rgba(10, 40, 30, 0.95);
        backdrop-filter: blur(10px);
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 10px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        border-left: 4px solid #52C41A;
        min-width: 300px;
        max-width: 400px;
        pointer-events: auto;
        animation: slideIn 0.3s ease-out;
        color: white;
        font-family: 'Noto Serif SC', serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <i class="fas fa-check-circle" style="color: #52C41A; font-size: 20px; margin-top: 2px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${title}</div>
                ${message ? `<div style="font-size: 14px; color: #CFC;">${message}</div>` : ''}
            </div>
        </div>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

/**
 * 导出所有工具函数
 */
export default {
    generateId,
    formatDate,
    deepClone,
    random,
    sleep,
    showCustomNotification,
    showErrorNotification,
    showSuccessNotification
};
