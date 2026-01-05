/**
 * VisionFocus Hours NFT 合约交互工具类
 * 用于前端与智能合约交互
 */

// 合约ABI（从编译后的artifacts中获取）
const CONTRACT_ABI = [
    "function mint(uint256 year, uint256 totalFocusHours, uint256 wishesCount, uint256 completedWishes, string memory tokenURI) external payable returns (uint256)",
    "function getUserYearToken(address user, uint256 year) external view returns (uint256)",
    "function getUserTokens(address user) external view returns (uint256[])",
    "function getTokenMetadata(uint256 tokenId) external view returns (tuple(uint256 year, address minter, uint256 totalFocusHours, uint256 wishesCount, uint256 completedWishes, uint256 mintTimestamp, string achievementLevel, bool exists))",
    "function tokenURI(uint256 tokenId) external view returns (string)",
    "function mintPrice() external view returns (uint256)",
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address owner) external view returns (uint256)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function getYearMintCount(uint256 year) external view returns (uint256)",
    "event NFTMinted(uint256 indexed tokenId, address indexed minter, uint256 year, uint256 totalFocusHours, string achievementLevel)"
];

// 合约地址（部署后更新）
const CONTRACT_ADDRESS = {
    sepolia: "", // Sepolia测试网合约地址
    mainnet: "", // 主网合约地址
    localhost: "" // 本地网络合约地址
};

class ContractService {
    constructor() {
        this.contract = null;
        this.provider = null;
        this.signer = null;
        this.contractAddress = null;
    }

    /**
     * 初始化合约实例
     * @param {string} network - 网络名称 (sepolia, mainnet, localhost)
     */
    async init(network = 'sepolia') {
        try {
            if (!window.ethereum) {
                throw new Error('请安装MetaMask钱包');
            }

            // 获取provider和signer
            // 兼容ethers v5和v6
            if (ethers.providers && ethers.providers.Web3Provider) {
                // ethers v5
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                this.signer = this.provider.getSigner();
            } else {
                // ethers v6
                this.provider = new ethers.BrowserProvider(window.ethereum);
                this.signer = await this.provider.getSigner();
            }
            
            // 获取合约地址
            this.contractAddress = CONTRACT_ADDRESS[network] || CONTRACT_ADDRESS.sepolia;
            
            // 如果合约地址未配置，启用模拟模式
            if (!this.contractAddress || this.contractAddress.trim() === '') {
                console.warn('⚠️ 合约地址未配置，启用模拟模式（仅用于前端测试）');
                this.contractAddress = null;
                this.simulateMode = true;
                return true; // 模拟模式初始化成功
            }
            
            this.simulateMode = false;

            // 创建合约实例
            // 兼容ethers v5和v6
            if (ethers.Contract) {
                this.contract = new ethers.Contract(
                    this.contractAddress,
                    CONTRACT_ABI,
                    this.signer
                );
            } else {
                throw new Error('ethers.js未正确加载');
            }

            console.log('合约初始化成功:', this.contractAddress);
            return true;
        } catch (error) {
            console.error('合约初始化失败:', error);
            throw error;
        }
    }

    /**
     * 获取当前网络
     */
    async getNetwork() {
        if (!this.provider) {
            await this.init();
        }
        const network = await this.provider.getNetwork();
        return network.chainId.toString();
    }

    /**
     * 切换到指定网络
     * @param {number} chainId - 链ID
     */
    async switchNetwork(chainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
            return true;
        } catch (switchError) {
            // 如果网络不存在，尝试添加
            if (switchError.code === 4902) {
                throw new Error('请手动添加网络');
            }
            throw switchError;
        }
    }

    /**
     * 铸造NFT
     * @param {number} year - 年份
     * @param {number} totalFocusHours - 总专注时间
     * @param {number} wishesCount - 愿望数量
     * @param {number} completedWishes - 完成的愿望数量
     * @param {string} tokenURI - IPFS URI
     * @returns {Promise<Object>} 交易结果
     */
    async mintNFT(year, totalFocusHours, wishesCount, completedWishes, tokenURI) {
        try {
            if (!this.contract && !this.simulateMode) {
                await this.init();
            }
            
            // 模拟模式：返回模拟的铸造结果
            if (this.simulateMode) {
                console.log('🎭 模拟模式：模拟NFT铸造');
                return this.simulateMint(year, totalFocusHours, wishesCount, completedWishes, tokenURI);
            }

            // 获取铸造价格
            const mintPrice = await this.contract.mintPrice();
            console.log('铸造价格:', ethers.formatEther(mintPrice), 'ETH');

            // 调用铸造函数
            const tx = await this.contract.mint(
                year,
                Math.floor(totalFocusHours * 100), // 转换为整数（保留2位小数）
                wishesCount,
                completedWishes,
                tokenURI,
                { value: mintPrice }
            );

            console.log('交易已发送:', tx.hash);
            
            // 等待交易确认
            const receipt = await tx.wait();
            console.log('交易已确认:', receipt);

            // 从事件中获取Token ID
            let tokenId = null;
            try {
                // 兼容ethers v5和v6的事件解析
                const mintEvent = receipt.logs.find(
                    log => {
                        try {
                            if (this.contract.interface && this.contract.interface.parseLog) {
                                const parsed = this.contract.interface.parseLog(log);
                                return parsed && parsed.name === 'NFTMinted';
                            }
                            // 尝试直接解析
                            return log.topics && log.topics.length > 0;
                        } catch {
                            return false;
                        }
                    }
                );

                if (mintEvent) {
                    try {
                        if (this.contract.interface && this.contract.interface.parseLog) {
                            const parsed = this.contract.interface.parseLog(mintEvent);
                            tokenId = parsed.args.tokenId.toString();
                        } else {
                            // 从receipt中提取（ethers v6可能返回不同格式）
                            tokenId = receipt.logs[0]?.args?.tokenId?.toString() || null;
                        }
                    } catch (e) {
                        console.warn('无法从事件中提取Token ID:', e);
                    }
                }
            } catch (e) {
                console.warn('解析事件失败:', e);
            }

            return {
                success: true,
                txHash: tx.hash,
                tokenId: tokenId,
                receipt: receipt
            };
        } catch (error) {
            console.error('铸造NFT失败:', error);
            
            // 处理常见错误
            if (error.code === 4001) {
                throw new Error('用户拒绝了交易');
            } else if (error.message.includes('Insufficient payment')) {
                throw new Error('支付金额不足');
            } else if (error.message.includes('Already minted')) {
                throw new Error('该年份的NFT已铸造');
            } else if (error.message.includes('user rejected')) {
                throw new Error('用户取消了交易');
            } else {
                throw new Error(error.message || '铸造失败，请重试');
            }
        }
    }

    /**
     * 获取用户某年的Token ID
     * @param {string} userAddress - 用户地址
     * @param {number} year - 年份
     * @returns {Promise<number|null>} Token ID
     */
    async getUserYearToken(userAddress, year) {
        try {
            if (!this.contract) {
                await this.init();
            }

            const tokenId = await this.contract.getUserYearToken(userAddress, year);
            return tokenId.toString() === '0' ? null : tokenId.toString();
        } catch (error) {
            console.error('获取用户Token失败:', error);
            return null;
        }
    }

    /**
     * 获取用户所有Token ID
     * @param {string} userAddress - 用户地址
     * @returns {Promise<Array>} Token ID数组
     */
    async getUserTokens(userAddress) {
        try {
            if (!this.contract) {
                await this.init();
            }

            const tokenIds = await this.contract.getUserTokens(userAddress);
            return tokenIds.map(id => id.toString());
        } catch (error) {
            console.error('获取用户Token列表失败:', error);
            return [];
        }
    }

    /**
     * 获取Token元数据
     * @param {number} tokenId - Token ID
     * @returns {Promise<Object>} 元数据
     */
    async getTokenMetadata(tokenId) {
        try {
            if (!this.contract) {
                await this.init();
            }

            const metadata = await this.contract.getTokenMetadata(tokenId);
            return {
                year: metadata.year.toString(),
                minter: metadata.minter,
                totalFocusHours: Number(metadata.totalFocusHours) / 100, // 转换回小数
                wishesCount: metadata.wishesCount.toString(),
                completedWishes: metadata.completedWishes.toString(),
                mintTimestamp: metadata.mintTimestamp.toString(),
                achievementLevel: metadata.achievementLevel,
                exists: metadata.exists
            };
        } catch (error) {
            console.error('获取Token元数据失败:', error);
            return null;
        }
    }

    /**
     * 获取Token URI
     * @param {number} tokenId - Token ID
     * @returns {Promise<string>} Token URI
     */
    async getTokenURI(tokenId) {
        try {
            if (!this.contract) {
                await this.init();
            }

            return await this.contract.tokenURI(tokenId);
        } catch (error) {
            console.error('获取Token URI失败:', error);
            return null;
        }
    }

    /**
     * 获取铸造价格
     * @returns {Promise<string>} 价格（ETH）
     */
    async getMintPrice() {
        try {
            if (!this.contract) {
                await this.init();
            }

            const price = await this.contract.mintPrice();
            return ethers.formatEther(price);
        } catch (error) {
            console.error('获取铸造价格失败:', error);
            return '0';
        }
    }

    /**
     * 获取总供应量
     * @returns {Promise<number>} 总供应量
     */
    async getTotalSupply() {
        try {
            if (!this.contract) {
                await this.init();
            }

            const supply = await this.contract.totalSupply();
            return Number(supply.toString());
        } catch (error) {
            console.error('获取总供应量失败:', error);
            return 0;
        }
    }

    /**
     * 检查用户是否拥有Token
     * @param {string} userAddress - 用户地址
     * @param {number} tokenId - Token ID
     * @returns {Promise<boolean>} 是否拥有
     */
    async checkOwnership(userAddress, tokenId) {
        try {
            if (!this.contract) {
                await this.init();
            }

            const owner = await this.contract.ownerOf(tokenId);
            return owner.toLowerCase() === userAddress.toLowerCase();
        } catch (error) {
            console.error('检查所有权失败:', error);
            return false;
        }
    }
    
    /**
     * 模拟铸造NFT（用于测试，当合约未部署时）
     * @private
     */
    async simulateMint(year, totalFocusHours, wishesCount, completedWishes, tokenURI) {
        // 模拟交易延迟
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 生成模拟的Token ID
        const tokenId = Math.floor(Math.random() * 1000000) + 1;
        
        // 生成模拟的交易哈希
        const txHash = '0x' + Array.from({length: 64}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('');
        
        console.log('✅ 模拟铸造成功:', {
            tokenId,
            txHash,
            year,
            totalFocusHours
        });
        
        return {
            success: true,
            txHash: txHash,
            tokenId: tokenId.toString(),
            receipt: {
                status: 1,
                transactionHash: txHash,
                blockNumber: Math.floor(Math.random() * 10000000),
                blockHash: '0x' + Array.from({length: 64}, () => 
                    Math.floor(Math.random() * 16).toString(16)).join('')
            },
            simulateMode: true
        };
    }
    
    /**
     * 检查是否为模拟模式
     */
    isSimulateMode() {
        return this.simulateMode === true;
    }
}

// 导出单例
const contractService = new ContractService();

// 如果在浏览器环境中，添加到window对象
if (typeof window !== 'undefined') {
    window.contractService = contractService;
}

export default contractService;

