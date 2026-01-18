class WalletConnector {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.init();
    }

    init() {
        // 绑定按钮事件
        document.getElementById('metamask-btn').addEventListener('click', () => this.connectMetaMask());
        document.getElementById('walletconnect-btn').addEventListener('click', () => this.connectWalletConnect());
        document.getElementById('coinbase-btn').addEventListener('click', () => this.connectCoinbase());
    }

    showSuccessModal(walletAddress, walletType) {
        // 显示钱包地址
        const modalAddress = document.getElementById('modal-wallet-address');
        modalAddress.textContent = `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`;
        
        // 显示弹窗
        const modal = document.getElementById('success-modal');
        modal.classList.add('show');
        
        // 倒计时跳转
        let countdown = 3;
        const countdownEl = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownEl.textContent = `${countdown}秒后自动跳转...`;
            } else {
                countdownEl.textContent = '正在跳转...';
                clearInterval(timer);
                
                // 跳转到宇宙故事主页
                setTimeout(() => {
                    window.location.href = '../universe-hub/universe-hub.html';
                }, 500);
            }
        }, 1000);
    }

    showStatus(message, type = 'loading') {
        const statusEl = document.getElementById('status');
        statusEl.className = `status ${type}`;
        
        if (type === 'loading') {
            statusEl.innerHTML = `<span class="loading"></span>${message}`;
        } else {
            statusEl.textContent = message;
        }
    }

    disableButtons(disabled = true) {
        const buttons = document.querySelectorAll('.wallet-btn');
        buttons.forEach(btn => btn.disabled = disabled);
    }

    async connectMetaMask() {
        try {
            this.showStatus('正在连接 MetaMask...', 'loading');
            this.disableButtons(true);

            // 检查是否安装了 MetaMask
            if (typeof window.ethereum === 'undefined') {
                throw new Error('请先安装 MetaMask 钱包');
            }

            // 请求连接账户
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('未找到账户，请在 MetaMask 中创建账户');
            }

            this.account = accounts[0];
            this.web3 = new Web3(window.ethereum);

            // 保存登录状态
            localStorage.setItem('walletAddress', this.account);
            localStorage.setItem('walletType', 'metamask');
            
            // 显示成功弹窗
            this.showSuccessModal(this.account, 'MetaMask');

        } catch (error) {
            console.error('MetaMask 连接失败:', error);
            this.showStatus(`连接失败: ${error.message}`, 'error');
            this.disableButtons(false);
            
            // 3秒后清除错误信息
            setTimeout(() => {
                this.showStatus('', '');
            }, 3000);
        }
    }

    async connectWalletConnect() {
        try {
            this.showStatus('正在连接 WalletConnect...', 'loading');
            this.disableButtons(true);

            // 这里应该集成 WalletConnect SDK
            // 为了演示，我们模拟连接过程
            await this.simulateConnection('WalletConnect');

        } catch (error) {
            console.error('WalletConnect 连接失败:', error);
            this.showStatus(`连接失败: ${error.message}`, 'error');
            this.disableButtons(false);
            
            setTimeout(() => {
                this.showStatus('', '');
            }, 3000);
        }
    }

    async connectCoinbase() {
        try {
            this.showStatus('正在连接 Coinbase Wallet...', 'loading');
            this.disableButtons(true);

            // 检查是否安装了 Coinbase Wallet
            if (typeof window.coinbaseWalletExtension === 'undefined') {
                // 尝试通过 window.ethereum 连接（Coinbase Wallet 也会注入这个对象）
                if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    
                    if (accounts.length === 0) {
                        throw new Error('未找到账户');
                    }
                    
                    this.account = accounts[0];
                    
                    localStorage.setItem('walletAddress', this.account);
                    localStorage.setItem('walletType', 'coinbase');
                    
                    // 显示成功弹窗
                    this.showSuccessModal(this.account, 'Coinbase Wallet');
                } else {
                    throw new Error('请先安装 Coinbase Wallet');
                }
            }

        } catch (error) {
            console.error('Coinbase Wallet 连接失败:', error);
            this.showStatus(`连接失败: ${error.message}`, 'error');
            this.disableButtons(false);
            
            setTimeout(() => {
                this.showStatus('', '');
            }, 3000);
        }
    }

    // 模拟连接过程（用于 WalletConnect 等需要额外 SDK 的钱包）
    async simulateConnection(walletType) {
        return new Promise((resolve, reject) => {
            // 模拟连接延迟
            setTimeout(() => {
                // 模拟 50% 成功率
                if (Math.random() > 0.3) {
                    this.account = '0x' + Math.random().toString(16).substr(2, 40);
                    
                    localStorage.setItem('walletAddress', this.account);
                    localStorage.setItem('walletType', walletType.toLowerCase());
                    
                    // 显示成功弹窗
                    this.showSuccessModal(this.account, walletType);
                    
                    resolve();
                } else {
                    reject(new Error('用户取消连接或网络错误'));
                }
            }, 2000);
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new WalletConnector();
    
    // 检查是否已经登录
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
        document.getElementById('status').innerHTML =
            `<p style="color: #28a745;">已连接: ${savedAddress.substring(0, 6)}...${savedAddress.substring(38)}</p>
             <p><a href="../universe-hub/universe-hub.html" style="color: #667eea;">进入宇宙故事主页</a></p>`;
    }
});