# DeFi Dashboard 使用指南

## 🚀 快速开始

### 1. 访问应用
打开浏览器访问：http://localhost:3000

### 2. 连接钱包
- 点击右上角的蓝色"连接钱包"按钮
- 选择您的钱包（推荐使用 MetaMask）
- 在钱包中确认连接请求

### 3. 查看数据
连接成功后，应用会自动：
- 获取您的真实资产余额
- 显示投资组合总价值
- 加载最近的交易记录

## 🎯 主要功能

### 📊 投资组合概览
- **总资产价值**: 实时计算所有代币的美元价值
- **持有代币数量**: 显示您拥有的不同代币种类
- **最近交易**: 显示最新的交易记录数量
- **刷新按钮**: 手动更新最新数据

### 💰 资产管理
- **支持的代币**: ETH、USDC、UNI、LINK 等主要代币
- **实时价格**: 显示当前市场价格和24小时涨跌幅
- **余额显示**: 显示您的实际持有数量
- **价值计算**: 自动计算每种代币的美元价值

### 📝 交易记录
- **ETH转账**: 显示以太坊原生代币的转入转出记录
- **代币转账**: 显示ERC20代币的转账记录
- **交易状态**: 成功、失败、待确认状态显示
- **交易详情**: 点击交易哈希可跳转到Etherscan查看详情

### 🔗 钱包管理
- **网络显示**: 显示当前连接的区块链网络
- **账户信息**: 显示钱包地址和余额
- **快捷操作**: 
  - 复制钱包地址
  - 在Etherscan中查看地址
  - 断开钱包连接

## 🛠 高级功能

### 🌙 主题切换
- 点击右上角的月亮/太阳图标
- 支持明暗两种主题模式
- 自动保存用户偏好设置

### 🔄 数据刷新
- **自动刷新**: 连接钱包时自动获取数据
- **手动刷新**: 点击"刷新"按钮更新数据
- **实时价格**: 价格数据来自CoinGecko API

### 📱 响应式设计
- 完美适配桌面和移动设备
- 自适应布局和字体大小
- 触摸友好的交互设计

## 🔒 安全说明

### ✅ 安全特性
- **只读访问**: 应用只读取区块链数据，不会请求私钥
- **无资金风险**: 不涉及任何资金转移或交易操作
- **公开数据**: 只获取公开的区块链信息

### ⚠️ 注意事项
- 确保使用官方钱包应用
- 不要在不安全的网络环境下使用
- 定期检查钱包连接状态

## 🚨 故障排除

### 连接问题
**问题**: 钱包连接失败
**解决方案**:
1. 确保已安装MetaMask或其他支持的钱包
2. 检查钱包是否已解锁
3. 刷新页面重新尝试连接
4. 检查网络连接是否正常

### 数据加载问题
**问题**: 资产或交易数据不显示
**解决方案**:
1. 点击"刷新"按钮重新加载数据
2. 检查网络连接
3. 确认钱包地址是否有资产
4. 查看浏览器控制台是否有错误信息

### 网络问题
**问题**: 显示"错误网络"
**解决方案**:
1. 点击网络按钮切换到支持的网络
2. 确保钱包连接到以太坊主网

### API限制问题
**问题**: 数据加载缓慢或失败
**解决方案**:
1. 等待一段时间后重试
2. 检查API密钥配置是否正确
3. 考虑升级到付费API服务

## 📞 技术支持

### 常见问题
- **Q**: 支持哪些钱包？
- **A**: 支持MetaMask、WalletConnect等主流钱包

- **Q**: 支持哪些代币？
- **A**: 目前支持ETH、USDC、UNI、LINK等主要代币

- **Q**: 数据多久更新一次？
- **A**: 连接时自动获取，可手动刷新获取最新数据

### 联系方式
如果遇到问题，请：
1. 查看浏览器控制台错误信息
2. 检查网络连接和API配置
3. 提交Issue到项目仓库

## 🔄 更新日志

### v1.0.0 (当前版本)
- ✅ 真实区块链数据集成
- ✅ 钱包连接和管理
- ✅ 资产余额显示
- ✅ 交易记录查看
- ✅ 响应式设计
- ✅ 主题切换功能

### 计划功能
- 🔄 更多代币支持
- 🔄 价格图表显示
- 🔄 交易功能集成
- 🔄 DeFi协议集成

---

**注意**: 这是一个演示项目，请在充分了解风险的情况下使用。 