import Fontmin from 'fontmin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取配置文件获取语言设置和字体配置
async function getConfig() {
  const configPath = path.join(__dirname, '../src/config.ts');
  const configContent = fs.readFileSync(configPath, 'utf-8');
  
  // 提取语言设置
  const langMatch = configContent.match(/const SITE_LANG = ["'](.+?)["']/);
  const lang = langMatch ? langMatch[1] : 'zh_CN';
  
  // 提取字体配置
  const fontConfigMatch = configContent.match(/font:\s*\{([\s\S]*?)\n\t\},/);
  if (!fontConfigMatch) {
    console.log('⚠ Font config not found, using default settings');
    return { lang, fonts: [] };
  }
  
  const fontConfigStr = fontConfigMatch[1];
  const fonts = [];
  
  // 解析每个字体类别（asciiFont, cjkFont）
  const fontTypes = ['asciiFont', 'cjkFont'];
  
  for (const fontType of fontTypes) {
    const regex = new RegExp(`${fontType}:\\s*\\{([\\s\\S]*?)\\}`, 'm');
    const match = fontConfigStr.match(regex);
    
    if (match) {
      const fontConfig = match[1];
      
      // 提取 enableCompress
      const compressMatch = fontConfig.match(/enableCompress:\s*(true|false)/);
      const enableCompress = compressMatch ? compressMatch[1] === 'true' : false;
      
      // 提取 localFonts 数组
      const localFontsMatch = fontConfig.match(/localFonts:\s*\[(.*?)\]/s);
      let localFonts = [];
      
      if (localFontsMatch && localFontsMatch[1].trim()) {
        // 提取数组中的字符串
        const fontsStr = localFontsMatch[1];
        localFonts = fontsStr
          .match(/["']([^"']+)["']/g)
          ?.map(s => s.replace(/["']/g, '')) || [];
      }
      
      if (enableCompress && localFonts.length > 0) {
        fonts.push({
          type: fontType,
          files: localFonts,
          enableCompress
        });
      }
    }
  }
  
  return { lang, fonts };
}

// 递归读取目录下所有文件
function readFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 提取文本内容
function extractText(content, ext) {
  let text = content;
  
  // 移除代码块中的内容（通常不需要特殊字体）
  if (ext === '.md' || ext === '.mdx') {
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`[^`]+`/g, '');
  }
  
  // 移除 frontmatter
  text = text.replace(/^---[\s\S]*?---/m, '');
  
  // 移除 HTML 标签
  text = text.replace(/<[^>]*>/g, ' ');
  
  // 移除 Markdown 语法
  text = text.replace(/[#*_~`\[\]()]/g, ' ');
  
  // 移除 URL
  text = text.replace(/https?:\/\/[^\s]+/g, '');
  
  return text;
}

// 获取 ASCII 字符集（用于 asciiFont）
function getAsciiCharset() {
  const chars = new Set();
  
  // 基本 ASCII 字符：空格到波浪号 (32-126)
  for (let i = 32; i <= 126; i++) {
    chars.add(String.fromCharCode(i));
  }
  
  // 常用符号和标点
  const common = ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  for (const char of common) {
    chars.add(char);
  }
  
  // 数字
  for (let i = 0; i <= 9; i++) {
    chars.add(String(i));
  }
  
  // 英文字母
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (const char of alphabet) {
    chars.add(char);
  }
  
  const text = Array.from(chars).sort().join('');
  console.log(`✓ ASCII charset contains ${chars.size} characters`);
  
  return text;
}

// 收集所有使用的文字（用于 CJK 字体）
async function collectText() {
  const { lang } = await getConfig();
  console.log(`Detected language setting: ${lang}`);
  
  const textSet = new Set();
  
  // 1. 读取 src/data 目录
  console.log('Scanning src/data directory...');
  const dataDir = path.join(__dirname, '../src/data');
  const dataFiles = readFilesRecursively(dataDir);
  
  dataFiles.forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      const content = fs.readFileSync(file, 'utf-8');
      // 提取字符串字面量中的文本
      const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
      if (stringMatches) {
        stringMatches.forEach(match => {
          const text = match.slice(1, -1);
          for (const char of text) {
            textSet.add(char);
          }
        });
      }
    }
  });
  
  // 2. 读取 src/config.ts 文件
  console.log('Scanning src/config.ts file...');
  const configFile = path.join(__dirname, '../src/config.ts');
  if (fs.existsSync(configFile)) {
    const content = fs.readFileSync(configFile, 'utf-8');
    const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
    if (stringMatches) {
      stringMatches.forEach(match => {
        const text = match.slice(1, -1);
        // 过滤掉 URL、路径、技术性字符串等
        if (!text.match(/^(https?:\/\/|\/|assets\/|@|#|material-symbols|fa6-brands|mdi:|simple-icons:|\.|\w+\.\w+)/) && 
            text.length > 0 && 
            !text.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) { // 排除变量名
          for (const char of text) {
            textSet.add(char);
          }
        }
      });
    }
  }

  // 3. 读取对应语言的 i18n 文件
  console.log(`Scanning i18n/${lang} file...`);
  const i18nFile = path.join(__dirname, `../src/i18n/languages/${lang}.ts`);
  if (fs.existsSync(i18nFile)) {
    const content = fs.readFileSync(i18nFile, 'utf-8');
    const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
    if (stringMatches) {
      stringMatches.forEach(match => {
        const text = match.slice(1, -1);
        for (const char of text) {
          textSet.add(char);
        }
      });
    }
  }
  
  // 4. 读取 src/content 目录
  console.log('Scanning src/content directory...');
  const contentDir = path.join(__dirname, '../src/content');
  const contentFiles = readFilesRecursively(contentDir);
  
  contentFiles.forEach(file => {
    const ext = path.extname(file);
    if (['.md', '.mdx', '.ts', '.js'].includes(ext)) {
      const content = fs.readFileSync(file, 'utf-8');
      const text = extractText(content, ext);
      for (const char of text) {
        // 只保留中文、日文、韩文等 CJK 字符和常用标点
        if (char.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/)) {
          textSet.add(char);
        }
      }
    }
  });
  
  // 添加常用标点符号和数字
  const commonChars = '0123456789，。！？；：""\'\'（）【】《》、·—…「」『』';
  for (const char of commonChars) {
    textSet.add(char);
  }
  
  // 添加英文字母（如果字体支持）
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (const char of alphabet) {
    textSet.add(char);
  }
  
  const allText = Array.from(textSet).sort().join('');
  console.log(`✓ Collected ${textSet.size} unique characters`);
  
  return allText;
}

// 压缩字体并输出到 dist 目录
async function compressFonts() {
  try {
    // 读取配置
    const { fonts } = await getConfig();
    
    if (fonts.length === 0) {
      console.log('⚠ No fonts to compress (enableCompress=false or localFonts is empty)');
      return;
    }
    
    console.log(`\nFound ${fonts.length} font configs to compress:`);
    fonts.forEach(f => {
      console.log(`  - ${f.type}: ${f.files.join(', ')}`);
    });
    
    // 检查 dist 目录是否存在
    const distDir = path.join(__dirname, '../dist');
    if (!fs.existsSync(distDir)) {
      console.log('\n⚠ dist directory does not exist, please run astro build first');
      console.log('Font compression will run automatically after build is complete');
      return;
    }
    
    // 创建 dist/assets/font 目录
    const distFontDir = path.join(distDir, 'assets/font');
    if (!fs.existsSync(distFontDir)) {
      fs.mkdirSync(distFontDir, { recursive: true });
    }
    
    // 根据字体类型收集不同的字符集
    const cjkText = await collectText(); // CJK 字体使用完整字符集
    const asciiText = getAsciiCharset(); // ASCII 字体只使用 ASCII 字符集
    
    console.log('\nStarting font compression...');
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    let processedCount = 0;
    
    // 用于收集所有错误
    const errors = [];
    
    // 遍历所有需要压缩的字体
    for (const fontConfig of fonts) {
      // 根据字体类型选择字符集
      const text = fontConfig.type === 'asciiFont' ? asciiText : cjkText;
      const fontTypeLabel = fontConfig.type === 'asciiFont' ? 'ASCII Fonts' : 
                           fontConfig.type === 'cjkFont' ? 'CJK Fonts' : fontConfig.type;
      
      console.log(`\n--- Processing ${fontTypeLabel} ---`);
      
      for (const fontFile of fontConfig.files) {
        const fontSrc = path.join(__dirname, '../public/assets/font', fontFile);
        const ext = path.extname(fontFile).toLowerCase();
        const baseName = path.basename(fontFile, ext);
        
        if (!fs.existsSync(fontSrc)) {
          const errorMsg = `❌ Config error [${fontConfig.type}]: Font file does not exist   In config: "${fontFile}"\n   Expected path: public/assets/font/${fontFile}\n   \n   Please check:\n   1. Is the filename correct (case sensitive)?\n   2. Is the file in public/assets/font/?\n   3. Is ${fontConfig.type}.localFonts in src/config.ts correct?`;
          
          errors.push(errorMsg);
          console.log(`\n${errorMsg}\n`);
          continue;
        }
        
        const originalSize = fs.statSync(fontSrc).size;
        totalOriginalSize += originalSize;
        
        // 根据文件类型决定处理方式
        if (ext === '.woff2' || ext === '.woff') {
          // woff/woff2 已经是 Web 优化格式，不支持进一步子集化压缩
          console.log(`⚠ Skipping ${fontFile}`);
          console.log('  Reason: woff/woff2 is already a web-optimized format, subsetting is not supported');
          console.log('  Tip: If you want to compress, use .ttf or .otf source files in localFonts');
          console.log(`  Current file size: ${(originalSize / 1024).toFixed(2)} KB\n`);
          
          // 直接复制到 dist
          const destFile = path.join(distFontDir, fontFile);
          fs.copyFileSync(fontSrc, destFile);
          totalCompressedSize += originalSize;
          // 不计入处理数量
        } else if (ext === '.ttf' || ext === '.otf') {
          // TTF/OTF 需要压缩为 woff2
          const charsetInfo = fontConfig.type === 'asciiFont' ? 
            `ASCII charset (${asciiText.length} chars)` : 
            `Full charset (${text.length} chars)`;
          console.log(`Compressing ${fontFile} [${charsetInfo}]...`);
          
          const fontmin = new Fontmin()
            .src(fontSrc)
            .use(Fontmin.glyph({
              text: text,
              hinting: false
            }))
            .use(Fontmin.ttf2woff2({
              deflate: true
            }))
            .dest(distFontDir);
          
          await new Promise((resolve, reject) => {
            fontmin.run((err, files) => {
              if (err) {
                reject(err);
              } else {
                resolve(files);
              }
            });
          });
          
          // 检查压缩结果
          const compressedFile = path.join(distFontDir, `${baseName}.woff2`);
          
          if (fs.existsSync(compressedFile)) {
            const compressedSize = fs.statSync(compressedFile).size;
            totalCompressedSize += compressedSize;
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(2);
            
            console.log(`✓ ${fontFile} → ${baseName}.woff2`);
            console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB | Compressed: ${(compressedSize / 1024).toFixed(2)} KB | Reduced: ${reduction}%`);
            console.log(`  Charset: ${charsetInfo}`);
            processedCount++;
          }
        } else {
          console.log(`⚠ Unsupported font format, skipping: ${fontFile}`);
        }
      }
    }
    
    // 输出总结
    if (errors.length > 0) {
      console.log('\n' + '='.repeat(60));
      console.log('❌ Font compression encountered errors!');
      console.log(`\n${errors.length} errors, please fix and retry.\n`);
      console.log('Tip: Available font files:');
      
      // 列出实际存在的字体文件
      const fontDir = path.join(__dirname, '../public/assets/font');
      if (fs.existsSync(fontDir)) {
        const actualFiles = fs.readdirSync(fontDir)
          .filter(f => ['.ttf', '.otf', '.woff', '.woff2'].includes(path.extname(f).toLowerCase()));
        
        if (actualFiles.length > 0) {
          actualFiles.forEach(f => console.log(`  - ${f}`));
        } else {
          console.log('  (directory is empty)');
        }
      }
      
      console.log('='.repeat(60));
      process.exit(1);
    }
    
    if (processedCount > 0) {
      const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(2);
      console.log('\n' + '='.repeat(60));
      console.log('✓ Font optimization complete!');
      console.log(`  Files processed: ${processedCount}`);
      console.log(`  Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Total compressed size: ${(totalCompressedSize / 1024).toFixed(2)} KB`);
      console.log(`  Overall reduction: ${totalReduction}%`);
      console.log('  Output directory: dist/assets/font/');
      console.log('='.repeat(60));
    } else {
      console.log('\n⚠ No font files processed');
    }
    
  } catch (error) {
    console.error('❌ Font compression failed:', error);
    process.exit(1);
  }
}

// 运行压缩
compressFonts();
