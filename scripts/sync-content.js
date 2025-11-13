import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 加载 .env 文件
const envPath = path.join(rootDir, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    // 跳过注释和空行
    if (!line || line.startsWith('#')) return;
    
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // 移除引号
      value = value.replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
  console.log('✅ 已加载 .env 配置文件\n');
}

// 从环境变量读取配置
const ENABLE_CONTENT_SYNC = process.env.ENABLE_CONTENT_SYNC !== 'false'; // 默认启用
const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || '';
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, 'content');
const USE_SUBMODULE = process.env.USE_SUBMODULE === 'true';

console.log('🔄 开始同步内容...\n');

// 检查是否启用内容同步
if (!ENABLE_CONTENT_SYNC) {
  console.log('⏭️  内容同步已禁用 (ENABLE_CONTENT_SYNC=false)');
  console.log('💡 提示: 将使用本地内容,不会从远程仓库同步');
  console.log('    如需启用内容分离功能,请在 .env 中设置:');
  console.log('    ENABLE_CONTENT_SYNC=true');
  console.log('    CONTENT_REPO_URL=<your-repo-url>\n');
  process.exit(0);
}

// 检查内容目录是否存在
if (!fs.existsSync(CONTENT_DIR)) {
  console.log(`📁 内容目录不存在: ${CONTENT_DIR}`);
  
  if (USE_SUBMODULE) {
    console.log('📦 使用 Git Submodule 模式');
    
    if (!CONTENT_REPO_URL) {
      console.error('❌ 错误: 未设置 CONTENT_REPO_URL 环境变量');
      process.exit(1);
    }
    
    try {
      console.log(`📥 初始化 submodule: ${CONTENT_REPO_URL}`);
      execSync(`git submodule add ${CONTENT_REPO_URL} content`, { 
        stdio: 'inherit',
        cwd: rootDir
      });
      execSync('git submodule update --init --recursive', { 
        stdio: 'inherit',
        cwd: rootDir
      });
      console.log('✅ Submodule 初始化成功');
    } catch (error) {
      console.error('❌ Submodule 初始化失败:', error.message);
      process.exit(1);
    }
  } else {
    console.log('📦 使用独立仓库模式');
    
    if (!CONTENT_REPO_URL) {
      console.warn('⚠️  警告: 未设置 CONTENT_REPO_URL,将使用本地内容');
      console.log('💡 提示: 请设置 CONTENT_REPO_URL 环境变量或手动创建 content 目录');
      process.exit(0);
    }
    
    try {
      console.log(`📥 克隆内容仓库: ${CONTENT_REPO_URL}`);
      execSync(`git clone ${CONTENT_REPO_URL} ${CONTENT_DIR}`, { 
        stdio: 'inherit',
        cwd: rootDir
      });
      console.log('✅ 内容仓库克隆成功');
    } catch (error) {
      console.error('❌ 克隆失败:', error.message);
      process.exit(1);
    }
  }
} else {
  console.log(`📁 内容目录已存在: ${CONTENT_DIR}`);
  
  // 如果是 submodule,更新它
  if (USE_SUBMODULE || fs.existsSync(path.join(CONTENT_DIR, '.git'))) {
    try {
      console.log('🔄 更新 submodule...');
      execSync('git submodule update --remote --merge', { 
        stdio: 'inherit',
        cwd: rootDir
      });
      console.log('✅ Submodule 更新成功');
    } catch (error) {
      console.warn('⚠️  Submodule 更新失败:', error.message);
    }
  } else if (fs.existsSync(path.join(CONTENT_DIR, '.git'))) {
    try {
      console.log('🔄 拉取最新内容...');
      execSync('git pull', { 
        stdio: 'inherit',
        cwd: CONTENT_DIR
      });
      console.log('✅ 内容更新成功');
    } catch (error) {
      console.warn('⚠️  内容更新失败:', error.message);
    }
  }
}

// 创建符号链接或复制内容
console.log('\n📂 设置内容链接...');

const contentMappings = [
  { src: 'posts', dest: 'src/content/posts' },
  { src: 'spec', dest: 'src/content/spec' },
  { src: 'data', dest: 'src/data' },
  { src: 'images', dest: 'public/images' },
];

for (const mapping of contentMappings) {
  const srcPath = path.join(CONTENT_DIR, mapping.src);
  const destPath = path.join(rootDir, mapping.dest);
  
  if (!fs.existsSync(srcPath)) {
    console.log(`⏭️  跳过不存在的源: ${mapping.src}`);
    continue;
  }
  
  // 如果目标已存在且不是符号链接,备份它
  if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isSymbolicLink()) {
    const backupPath = `${destPath}.backup`;
    console.log(`💾 备份现有内容: ${mapping.dest} -> ${mapping.dest}.backup`);
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true });
    }
    fs.renameSync(destPath, backupPath);
  }
  
  // 删除现有的符号链接
  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath);
  }
  
  // 创建符号链接 (Windows 需要管理员权限,否则复制文件)
  try {
    const relPath = path.relative(path.dirname(destPath), srcPath);
    fs.symlinkSync(relPath, destPath, 'junction');
    console.log(`🔗 创建符号链接: ${mapping.dest} -> ${mapping.src}`);
  } catch (error) {
    console.log(`📋 复制内容: ${mapping.src} -> ${mapping.dest}`);
    copyRecursive(srcPath, destPath);
  }
}

console.log('\n✅ 内容同步完成!\n');

// 递归复制函数
function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}
