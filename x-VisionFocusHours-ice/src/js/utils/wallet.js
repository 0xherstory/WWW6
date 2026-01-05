/**
 * VisionFocus Hours - 钱包管理器 (简化版,直接使用window.ethereum)
 * 处理MetaMask连接、网络切换等Web3操作
 */

import { NETWORK_CONFIG, log } from '../config.js';
import storageManager from './storage.js';

class WalletManager {
    constructor() {
        this.address = null;
        this.chainId = null;
        this.isConnected = false;
    }

    /**
     * 初始化
     */
    async init() {
        log('info', 'Initializing WalletManager...');
        
        // 检查是否有MetaMask
        if (!this.hasMetaMask()) {
            log('warn', 'MetaMask not detected');
            return;
        }
        
        // 监听账户变化
        this.listenToAccountChanges();
        
        // 监听网络变化
        this.listenToChainChanges();
        
        // 尝试恢复连接
        await this.tryRestoreConnection();
        
        log('info', 'WalletManager initialized');
    }

    /**
     * 检查是否安装了MetaMask
     */
    hasMetaMask() {
        return typeof window.ethereum !== 'undefined';
    }

    /**
     * 连接钱包
     */
    async connect() {
        try {
            log('info', 'Connecting wallet...');
            
            if (!this.hasMetaMask()) {
                throw new Error('Please install MetaMask');
            }
            
            // 请求账户授权
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }
            
            this.address = accounts[0];
            
            // 获取chainId
            this.chainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            this.isConnected = true;
            
            // 保存到存储
            storageManager.updateUser({ 
                wallet: this.address,
                lastConnected: Date.now()
            });
            
            log('info', `Wallet connected: ${this.address}`);
            log('info', `Chain ID: ${this.chainId}`);
            
            return {
                address: this.address,
                chainId: this.chainId
            };
        } catch (error) {
            log('error', 'Error connecting wallet:', error);
            throw error;
        }
    }

    /**
     * 断开连接
     */
    disconnect() {
        this.address = null;
        this.isConnected = false;
        
        storageManager.updateUser({ wallet: '' });
        
        log('info', 'Wallet disconnected');
    }

    /**
     * 获取当前地址
     */
    getAddress() {
        return this.address;
    }

    /**
     * 获取短地址 (0x1234...5678)
     */
    getShortAddress(address = this.address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    /**
     * 获取余额
     */
    async getBalance() {
        try {
            if (!this.address) return '0';
            
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.address, 'latest']
            });
            
            // 简单转换为ETH (1 ETH = 10^18 Wei)
            const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
            return ethBalance.toFixed(4);
        } catch (error) {
            log('error', 'Error getting balance:', error);
            return '0';
        }
    }

    /**
     * 检查网络
     */
    async checkNetwork() {
        try {
            const targetNetwork = NETWORK_CONFIG[NETWORK_CONFIG.default];
            
            if (this.chainId !== targetNetwork.chainId) {
                log('warn', `Wrong network. Current: ${this.chainId}, Expected: ${targetNetwork.chainId}`);
                return false;
            }
            
            log('info', 'On correct network');
            return true;
        } catch (error) {
            log('error', 'Error checking network:', error);
            return false;
        }
    }

    /**
     * 切换网络
     */
    async switchNetwork(networkName = NETWORK_CONFIG.default) {
        try {
            const network = NETWORK_CONFIG[networkName];
            
            log('info', `Switching to ${networkName}...`);
            
            try {
                // 尝试切换到目标网络
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: network.chainId }],
                });
                
                this.chainId = network.chainId;
                log('info', `Switched to ${networkName}`);
                return true;
            } catch (switchError) {
                // 如果网络不存在，尝试添加
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: network.chainId,
                                    chainName: network.chainName,
                                    nativeCurrency: network.nativeCurrency,
                                    rpcUrls: network.rpcUrls,
                                    blockExplorerUrls: network.blockExplorerUrls
                                }
                            ],
                        });
                        
                        this.chainId = network.chainId;
                        log('info', `Added and switched to ${networkName}`);
                        return true;
                    } catch (addError) {
                        log('error', 'Error adding network:', addError);
                        throw addError;
                    }
                }
                
                throw switchError;
            }
        } catch (error) {
            log('error', 'Error switching network:', error);
            return false;
        }
    }

    /**
     * 签名消息
     */
    async signMessage(message) {
        try {
            if (!this.address) {
                throw new Error('Wallet not connected');
            }
            
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, this.address]
            });
            
            log('info', 'Message signed');
            return signature;
        } catch (error) {
            log('error', 'Error signing message:', error);
            throw error;
        }
    }

    /**
     * 监听账户变化
     */
    listenToAccountChanges() {
        if (!this.hasMetaMask()) return;
        
        window.ethereum.on('accountsChanged', (accounts) => {
            log('info', 'Account changed:', accounts);
            
            if (accounts.length === 0) {
                // 用户断开连接
                this.disconnect();
            } else {
                // 账户切换
                this.address = accounts[0];
                storageManager.updateUser({ wallet: this.address });
            }
            
            // 刷新页面
            window.location.reload();
        });
    }

    /**
     * 监听网络变化
     */
    listenToChainChanges() {
        if (!this.hasMetaMask()) return;
        
        window.ethereum.on('chainChanged', (chainId) => {
            log('info', 'Chain changed:', chainId);
            this.chainId = chainId;
            
            // 刷新页面
            window.location.reload();
        });
    }

    /**
     * 尝试恢复连接
     */
    async tryRestoreConnection() {
        try {
            const user = storageManager.getUser();
            
            if (!user || !user.wallet) {
                return false;
            }
            
            // 检查是否仍然连接
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            
            if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === user.wallet.toLowerCase()) {
                // 自动恢复连接
                this.address = accounts[0];
                this.chainId = await window.ethereum.request({ method: 'eth_chainId' });
                this.isConnected = true;
                
                log('info', 'Connection restored');
                return true;
            }
            
            return false;
        } catch (error) {
            log('debug', 'Cannot restore connection:', error);
            return false;
        }
    }

    /**
     * 获取连接状态
     */
    isWalletConnected() {
        return this.isConnected && !!this.address;
    }

    /**
     * 获取Etherscan链接
     */
    getEtherscanLink(type = 'address', value) {
        const network = NETWORK_CONFIG[NETWORK_CONFIG.default];
        const baseUrl = network.blockExplorerUrls[0];
        
        switch (type) {
            case 'address':
                return `${baseUrl}/address/${value}`;
            case 'tx':
                return `${baseUrl}/tx/${value}`;
            case 'token':
                return `${baseUrl}/token/${value}`;
            default:
                return baseUrl;
        }
    }
}

// 创建单例
const walletManager = new WalletManager();

// 导出单例
export default walletManager;

// 也导出类
export { WalletManager };
