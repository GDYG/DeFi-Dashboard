#!/bin/bash

echo "🚀 启动 DeFi Dashboard 项目..."
echo ""

# 检查 Node.js 版本
echo "📋 检查环境..."
node_version=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js 版本: $node_version"
else
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo ""

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "🎉 准备工作完成！"
echo ""
echo "🌐 启动开发服务器..."
echo "📱 应用将在 http://localhost:3000 启动"
echo ""
echo "💡 使用说明:"
echo "   1. 打开浏览器访问 http://localhost:3000"
echo "   2. 点击右上角的 '连接钱包' 按钮"
echo "   3. 选择您的钱包（如 MetaMask）进行连接"
echo "   4. 连接后即可查看资产和交易记录"
echo ""
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

# 启动开发服务器
npm run dev 