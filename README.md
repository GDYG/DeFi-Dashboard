# DeFi Dashboard

现代化的去中心化金融（DeFi）资产管理面板，支持连接钱包查看真实的资产余额和交易记录。

## ✨ 功能特性

- 🔗 **钱包连接**: 支持 MetaMask、WalletConnect 等主流钱包
- 💰 **真实资产数据**: 显示用户的 ETH 和 ERC20 代币余额
- 📊 **投资组合概览**: 实时计算总资产价值和持仓分布
- 📝 **交易记录**: 显示最近的 ETH 转账和代币转账记录
- 🌙 **暗色主题**: 现代化的深色界面设计
- 📱 **响应式设计**: 完美适配桌面和移动设备
- ⚡ **实时数据**: 集成 Etherscan 和 CoinGecko API

## 🛠 技术栈

- **前端框架**: Next.js + TypeScript
- **样式**: Tailwind CSS
- **钱包集成**: wagmi + RainbowKit
- **状态管理**: Zustand
- **区块链数据**: Etherscan API
- **价格数据**: CoinGecko API
- **图标**: Lucide React

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd dapp-demo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp env.example中的.env.local部分到 .env.local
```

编辑 `.env.local` 文件，填入必要的 API 密钥：

```env
# WalletConnect Project ID (必需)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Alchemy API Key (必需)
ALCHEMY_API_KEY=your_alchemy_api_key

# Etherscan API Key (必需)
ETHERSCAN_API_KEY=your_etherscan_api_key

# CoinGecko API Key (必需)
COINGECKO_API_KEY=your_coingecko_api_key

# PRIVATE_KEY（必需）
钱包私钥，如果是本地Hardhat网路，启动yarn run hardhat:node后，选择Account #0的Private Key就好，同时需要在metamask上导入钱包账户，其他测试网络或者主网请在metamask上自行获取

# Infura API KEY（可选）
INFURA_API_KEY=your_infura_api_key
```

### 4. 获取 API 密钥

#### WalletConnect Project ID
1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 创建新项目
3. 复制 Project ID

#### Alchemy API Key
1. 访问 [Alchemy](https://www.alchemy.com/)
2. 创建免费账户
3. 创建新的 App (选择 Ethereum Mainnet)
4. 复制 API Key

#### Etherscan API Key
1. 访问 [Etherscan](https://etherscan.io/apis)
2. 创建免费账户
3. 生成 API Key

#### CoinGecko API Key (可选)
1. 访问 [CoinGecko](https://www.coingecko.com/en/api)
2. 免费版本无需 API Key
3. 付费版本可获得更高的请求限制

#### PRIVATE_KEY
1. 浏览器傻姑娘打开MetaMask，选择顶部的当前账户
2. 点击当前账户右边的三个点
3. 选择账户详情
4. 选择Details
5. 选择查看私钥
注意：一定不要把私钥泄漏出去

### 5. 启动开发服务器

```bash
npm run dev
# 或使用启动脚本
./start.sh
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📱 使用说明

### 连接钱包
1. 点击右上角的"连接钱包"按钮
2. 选择您的钱包（推荐 MetaMask）
3. 确认连接请求

### 查看资产
- 连接钱包后，系统会自动获取您的资产数据
- 支持显示 ETH、USDC、UNI、LINK 等主要代币
- 实时显示代币数量、美元价值和24小时涨跌幅

### 查看交易记录
- 显示最近的 ETH 转账记录
- 显示 ERC20 代币转账记录
- 点击交易哈希可跳转到 Etherscan 查看详情

### 刷新数据
- 点击投资组合概览中的"刷新"按钮
- 系统会重新获取最新的资产和交易数据

## 🔧 项目结构

```
src/
├── app/                    # Next.js 应用路由
├── components/             # React 组件
│   ├── AssetCard.tsx      # 资产卡片组件
│   ├── TransactionCard.tsx # 交易记录组件
│   ├── Header.tsx         # 头部导航
│   ├── LoadingSpinner.tsx # 加载动画
│   └── ErrorMessage.tsx   # 错误提示
├── services/              # API 服务
│   └── api.ts            # 区块链数据服务
├── store/                 # 状态管理
│   └── useWalletStore.ts # 钱包状态
├── types/                 # TS类型
│   ├── index.ts            # 资产的TS类型定义
├── hooks/                 # hooks函数
│   ├── useToast.ts      # Toast hooks
├── test/                 # 测试
│   ├── DeFiToken.test.js      # DeFi代币测试
├── utils/                 # 工具函数
│   ├── constants.ts      # 常量配置
│   └── format.ts         # 格式化函数
└── providers/            # 上下文提供者
    └── Providers.tsx     # 应用提供者
```

## 🌐 支持的网络

- **Ethereum Mainnet**: 主要支持网络
- **Sepolia Testnet**: 测试网络支持
- **Hardhat Local**: Hardhat本地网络支持

## 🪙 支持的代币

- **ETH**: 以太坊原生代币
- **USDC**: USD Coin 稳定币
- **UNI**: Uniswap 治理代币
- **LINK**: Chainlink 预言机代币
- ~~**USDT**: Tether 稳定币~~
- ~~**DAI**: MakerDAO 稳定币~~
- ~~**WBTC**: Wrapped Bitcoin~~

## 🔒 安全说明

- 本应用只读取区块链数据，不会请求私钥或助记词
- 所有交易都需要通过您的钱包确认
- API 密钥仅用于获取公开的区块链数据
- 建议在主网使用前先在测试网测试

## 🚨 故障排除

### 钱包连接失败
- 确保已安装 MetaMask 或其他支持的钱包
- 检查钱包是否已解锁
- 尝试刷新页面重新连接

### 数据加载失败
- 检查网络连接
- 确认 API 密钥配置正确
- 查看浏览器控制台的错误信息

### API 请求限制
- Etherscan 免费版有请求频率限制
- CoinGecko 免费版有请求次数限制
- 考虑升级到付费版本获得更高限制

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [Etherscan API 文档](https://docs.etherscan.io/)
- [CoinGecko API 文档](https://www.coingecko.com/en/api/documentation) 