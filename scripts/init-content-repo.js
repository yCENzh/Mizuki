#!/usr/bin/env node

/**
 * Mizuki 内容仓库初始化脚本
 * 帮助用户快速设置代码内容分离
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 加载 .env 文件的辅助函数
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      value = value.replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

// 加载现有的 .env 文件
loadEnvFile(path.join(rootDir, '.env'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`❌ 命令执行失败: ${command}`);
    throw error;
  }
}

async function main() {
  console.log('🌸 欢迎使用 Mizuki 内容仓库初始化向导!\n');
  
  // 询问用户模式
  console.log('请选择内容管理模式:');
  console.log('1. Git Submodule 模式 (推荐)');
  console.log('2. 独立仓库模式');
  const mode = await question('请输入选项 (1 或 2): ');
  
  const useSubmodule = mode.trim() === '1';
  
  // 询问内容仓库 URL
  const repoUrl = await question('\n请输入内容仓库 URL (例如: https://github.com/username/Mizuki-Content.git): ');
  
  if (!repoUrl.trim()) {
    console.error('❌ 内容仓库 URL 不能为空!');
    rl.close();
    return;
  }
  
  // 确认信息
  console.log('\n📋 配置信息:');
  console.log(`   模式: ${useSubmodule ? 'Git Submodule' : '独立仓库'}`);
  console.log(`   仓库: ${repoUrl.trim()}`);
  
  const confirm = await question('\n确认开始初始化? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 初始化已取消');
    rl.close();
    return;
  }
  
  console.log('\n🚀 开始初始化...\n');
  
  // 创建 .env 文件
  const envPath = path.join(rootDir, '.env');
  const envContent = `# Mizuki 内容仓库配置
# 由初始化脚本自动生成

CONTENT_REPO_URL=${repoUrl.trim()}
USE_SUBMODULE=${useSubmodule}
CONTENT_DIR=./content

# Umami 配置 (可选)
# UMAMI_API_KEY=your_api_key_here

# bcrypt 配置
BCRYPT_SALT_ROUNDS=12
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 已创建 .env 文件');
  
  // 添加到 .gitignore
  const gitignorePath = path.join(rootDir, '.gitignore');
  let gitignoreContent = '';
  
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
  }
  
  if (!gitignoreContent.includes('.env')) {
    gitignoreContent += '\n# Environment variables\n.env\n.env.production\n';
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log('✅ 已更新 .gitignore');
  }
  
  // 同步内容
  console.log('\n📥 同步内容仓库...');
  try {
    exec('pnpm run sync-content', { 
      cwd: rootDir,
      env: {
        ...process.env,
        CONTENT_REPO_URL: repoUrl.trim(),
        USE_SUBMODULE: useSubmodule.toString()
      }
    });
    console.log('✅ 内容同步成功!');
  } catch (error) {
    console.error('❌ 内容同步失败，请检查配置后手动运行: pnpm run sync-content');
  }
  
  // 提示后续步骤
  console.log('\n🎉 初始化完成!\n');
  console.log('📝 后续步骤:');
  console.log('1. 检查 content/ 目录确认内容已同步');
  console.log('2. 运行 pnpm dev 启动开发服务器');
  console.log('3. 访问 http://localhost:4321 查看博客');
  console.log('\n📚 更多信息:');
  console.log('- 内容仓库结构: docs/CONTENT_REPOSITORY.md');
  console.log('- 迁移指南: docs/MIGRATION_GUIDE.md');
  
  rl.close();
}

main().catch(error => {
  console.error('❌ 初始化失败:', error);
  rl.close();
  process.exit(1);
});
