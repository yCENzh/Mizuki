/**
 * 测试字体压缩功能
 * 
 * 此脚本模拟构建流程，验证字体压缩是否正常工作
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing font compression\n');

// 创建临时 dist 目录
const distDir = path.join(__dirname, '../dist');
const distFontDir = path.join(distDir, 'assets/font');

if (!fs.existsSync(distDir)) {
  console.log('Creating temporary dist directory...');
  fs.mkdirSync(distFontDir, { recursive: true });
}

console.log('✓ dist directory is ready\n');

// 运行压缩脚本
console.log('Running font compression...\n');
const { execSync } = await import('child_process');

try {
  execSync('node scripts/compress-fonts.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✓ Font compression test completed!');
  
  // 检查生成的文件
  const compressedFont = path.join(distFontDir, 'ZenMaruGothic-Medium.woff2');
  if (fs.existsSync(compressedFont)) {
    const size = fs.statSync(compressedFont).size;
    console.log(`\nGenerated file: ZenMaruGothic-Medium.woff2 (${(size / 1024).toFixed(2)} KB)`);
  }
  
  // 清理测试文件（可选）
  console.log('\nNote: Test files are saved in the dist/ directory and can be deleted manually');
  
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
}
