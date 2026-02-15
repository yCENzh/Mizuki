/* ========== Mizuki Editor - JavaScript ========== */
(function() {
'use strict';

// ========== i18n System ==========
const I18N = {
  'zh-CN': {
    pageTitle: 'Mizuki 可视化编辑器',
    themeColor: '主题颜色', themeMode: '主题模式',
    themeDark: '默认深色', themeLight: '亮色主题', themeDeepBlue: '深蓝主题', themeHighContrast: '高对比度',
    colorRed: '红色', colorOrange: '橙色', colorYellow: '黄色', colorGreen: '绿色',
    colorCyan: '青色', colorBlue: '蓝色', colorPurple: '紫色', colorPink: '粉色',
    modulePanel: '模块面板', searchModules: '搜索模块...',
    editorPlaceholder: '在此输入 Markdown 内容...',
    cmdHeading: '标题', cmdBold: '加粗', cmdItalic: '斜体', cmdStrikethrough: '删除线',
    cmdUl: '无序列表', cmdOl: '有序列表', cmdTask: '任务列表', cmdQuote: '引用',
    cmdCode: '行内代码', cmdCodeblock: '代码块', cmdLink: '链接', cmdImage: '图片',
    cmdTable: '表格', cmdHr: '分割线',
    viewEdit: '编辑', viewSplit: '分屏', viewPreview: '预览',
    importFile: '导入', exportFile: '导出',
    fmConfig: 'Front Matter 配置',
    fmTitle: '标题', fmTitlePh: '文章标题',
    fmPublished: '发布日期', fmUpdated: '更新日期',
    fmDesc: '描述', fmDescPh: '文章描述',
    fmImage: '封面图片', fmCategory: '分类', fmCategoryPh: '分类名称',
    fmTags: '标签', fmTagsPh: '标签1, 标签2, 标签3',
    fmDraft: '草稿', fmPinned: '置顶', fmComment: '评论', fmEncrypted: '加密',
    fmPassword: '密码', fmPasswordPh: '访问密码',
    fmPriority: '优先级', fmAlias: '别名', fmLang: '语言', fmLangDefault: '默认',
    fmLicense: '许可证', fmAuthor: '作者', fmAuthorPh: '作者名', fmSourceLink: '来源链接',
    fmApply: '应用到文章', fmCancelBtn: '取消',
    exportTitle: '导出文件', exportTxt: '📄 纯文本 (.txt)',
    dropMain: '📂 拖拽文件到此处导入', dropSub: '支持 .md .txt .html',
    // Module categories & items
    catFrontMatter: 'Front Matter', catBasicMd: '基础 Markdown', catExtended: '扩展功能',
    catMermaid: 'Mermaid 图表', catVideo: '视频嵌入', catTemplates: '文章模板',
    modBasicConfig: '基本配置', modEncryptConfig: '加密配置', modPinConfig: '置顶配置', modDraftConfig: '草稿配置',
    modH1: '一级标题', modH2: '二级标题', modH3: '三级标题',
    modBold: '加粗', modItalic: '斜体', modStrike: '删除线',
    modUl: '无序列表', modOl: '有序列表', modTask: '任务列表',
    modQuote: '引用块', modInlineCode: '行内代码', modCodeBlock: '代码块',
    modLink: '链接', modImage: '图片', modTable: '表格', modHr: '分割线', modHtml: 'HTML块',
    modGithubCard: 'GitHub 卡片',
    modNote: 'Note 提示框', modTip: 'Tip 技巧框', modImportant: 'Important 重要框',
    modWarning: 'Warning 警告框', modCaution: 'Caution 注意框', modCustomAdmonition: '自定义标题提示框',
    modSpoiler: 'Spoiler 隐藏', modExcerpt: '摘要分隔',
    modInlineMath: '行内公式', modBlockMath: '块级公式',
    modFlowchart: '流程图', modSequence: '时序图', modGantt: '甘特图',
    modClassDiag: '类图', modPie: '饼图', modState: '状态图',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '标准文章', modEncArticle: '加密文章', modPinArticle: '置顶公告', modTutorial: '技术教程'
  },
  'zh-TW': {
    pageTitle: 'Mizuki 視覺化編輯器',
    themeColor: '主題顏色', themeMode: '主題模式',
    themeDark: '預設深色', themeLight: '亮色主題', themeDeepBlue: '深藍主題', themeHighContrast: '高對比度',
    colorRed: '紅色', colorOrange: '橙色', colorYellow: '黃色', colorGreen: '綠色',
    colorCyan: '青色', colorBlue: '藍色', colorPurple: '紫色', colorPink: '粉色',
    modulePanel: '模組面板', searchModules: '搜尋模組...',
    editorPlaceholder: '在此輸入 Markdown 內容...',
    cmdHeading: '標題', cmdBold: '粗體', cmdItalic: '斜體', cmdStrikethrough: '刪除線',
    cmdUl: '無序清單', cmdOl: '有序清單', cmdTask: '任務清單', cmdQuote: '引用',
    cmdCode: '行內程式碼', cmdCodeblock: '程式碼區塊', cmdLink: '連結', cmdImage: '圖片',
    cmdTable: '表格', cmdHr: '分隔線',
    viewEdit: '編輯', viewSplit: '分屏', viewPreview: '預覽',
    importFile: '匯入', exportFile: '匯出',
    fmConfig: 'Front Matter 設定',
    fmTitle: '標題', fmTitlePh: '文章標題',
    fmPublished: '發佈日期', fmUpdated: '更新日期',
    fmDesc: '描述', fmDescPh: '文章描述',
    fmImage: '封面圖片', fmCategory: '分類', fmCategoryPh: '分類名稱',
    fmTags: '標籤', fmTagsPh: '標籤1, 標籤2, 標籤3',
    fmDraft: '草稿', fmPinned: '置頂', fmComment: '留言', fmEncrypted: '加密',
    fmPassword: '密碼', fmPasswordPh: '存取密碼',
    fmPriority: '優先順序', fmAlias: '別名', fmLang: '語言', fmLangDefault: '預設',
    fmLicense: '授權條款', fmAuthor: '作者', fmAuthorPh: '作者名', fmSourceLink: '來源連結',
    fmApply: '套用至文章', fmCancelBtn: '取消',
    exportTitle: '匯出檔案', exportTxt: '📄 純文字 (.txt)',
    dropMain: '📂 拖曳檔案至此匯入', dropSub: '支援 .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: '基礎 Markdown', catExtended: '擴充功能',
    catMermaid: 'Mermaid 圖表', catVideo: '影片嵌入', catTemplates: '文章模板',
    modBasicConfig: '基本設定', modEncryptConfig: '加密設定', modPinConfig: '置頂設定', modDraftConfig: '草稿設定',
    modH1: '一級標題', modH2: '二級標題', modH3: '三級標題',
    modBold: '粗體', modItalic: '斜體', modStrike: '刪除線',
    modUl: '無序清單', modOl: '有序清單', modTask: '任務清單',
    modQuote: '引用區塊', modInlineCode: '行內程式碼', modCodeBlock: '程式碼區塊',
    modLink: '連結', modImage: '圖片', modTable: '表格', modHr: '分隔線', modHtml: 'HTML區塊',
    modGithubCard: 'GitHub 卡片',
    modNote: 'Note 提示框', modTip: 'Tip 技巧框', modImportant: 'Important 重要框',
    modWarning: 'Warning 警告框', modCaution: 'Caution 注意框', modCustomAdmonition: '自訂標題提示框',
    modSpoiler: 'Spoiler 隱藏', modExcerpt: '摘要分隔',
    modInlineMath: '行內公式', modBlockMath: '區塊公式',
    modFlowchart: '流程圖', modSequence: '時序圖', modGantt: '甘特圖',
    modClassDiag: '類別圖', modPie: '圓餅圖', modState: '狀態圖',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準文章', modEncArticle: '加密文章', modPinArticle: '置頂公告', modTutorial: '技術教學'
  },
  en: {
    pageTitle: 'Mizuki Visual Editor',
    themeColor: 'Theme Color', themeMode: 'Theme Mode',
    themeDark: 'Default Dark', themeLight: 'Light Theme', themeDeepBlue: 'Deep Blue', themeHighContrast: 'High Contrast',
    colorRed: 'Red', colorOrange: 'Orange', colorYellow: 'Yellow', colorGreen: 'Green',
    colorCyan: 'Cyan', colorBlue: 'Blue', colorPurple: 'Purple', colorPink: 'Pink',
    modulePanel: 'Modules', searchModules: 'Search modules...',
    editorPlaceholder: 'Type your Markdown here...',
    cmdHeading: 'Heading', cmdBold: 'Bold', cmdItalic: 'Italic', cmdStrikethrough: 'Strikethrough',
    cmdUl: 'Bullet List', cmdOl: 'Numbered List', cmdTask: 'Task List', cmdQuote: 'Blockquote',
    cmdCode: 'Inline Code', cmdCodeblock: 'Code Block', cmdLink: 'Link', cmdImage: 'Image',
    cmdTable: 'Table', cmdHr: 'Horizontal Rule',
    viewEdit: 'Edit', viewSplit: 'Split', viewPreview: 'Preview',
    importFile: 'Import', exportFile: 'Export',
    fmConfig: 'Front Matter Settings',
    fmTitle: 'Title', fmTitlePh: 'Article title',
    fmPublished: 'Published', fmUpdated: 'Updated',
    fmDesc: 'Description', fmDescPh: 'Article description',
    fmImage: 'Cover image', fmCategory: 'Category', fmCategoryPh: 'Category name',
    fmTags: 'Tags', fmTagsPh: 'tag1, tag2, tag3',
    fmDraft: 'Draft', fmPinned: 'Pinned', fmComment: 'Comments', fmEncrypted: 'Encrypted',
    fmPassword: 'Password', fmPasswordPh: 'Access password',
    fmPriority: 'Priority', fmAlias: 'Alias', fmLang: 'Language', fmLangDefault: 'Default',
    fmLicense: 'License', fmAuthor: 'Author', fmAuthorPh: 'Author name', fmSourceLink: 'Source link',
    fmApply: 'Apply to Article', fmCancelBtn: 'Cancel',
    exportTitle: 'Export File', exportTxt: '📄 Plain Text (.txt)',
    dropMain: '📂 Drop files here to import', dropSub: 'Supports .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: 'Basic Markdown', catExtended: 'Extended Features',
    catMermaid: 'Mermaid Diagrams', catVideo: 'Video Embed', catTemplates: 'Article Templates',
    modBasicConfig: 'Basic Config', modEncryptConfig: 'Encrypt Config', modPinConfig: 'Pin Config', modDraftConfig: 'Draft Config',
    modH1: 'Heading 1', modH2: 'Heading 2', modH3: 'Heading 3',
    modBold: 'Bold', modItalic: 'Italic', modStrike: 'Strikethrough',
    modUl: 'Bullet List', modOl: 'Numbered List', modTask: 'Task List',
    modQuote: 'Blockquote', modInlineCode: 'Inline Code', modCodeBlock: 'Code Block',
    modLink: 'Link', modImage: 'Image', modTable: 'Table', modHr: 'Horizontal Rule', modHtml: 'HTML Block',
    modGithubCard: 'GitHub Card',
    modNote: 'Note', modTip: 'Tip', modImportant: 'Important',
    modWarning: 'Warning', modCaution: 'Caution', modCustomAdmonition: 'Custom Admonition',
    modSpoiler: 'Spoiler', modExcerpt: 'Excerpt Separator',
    modInlineMath: 'Inline Math', modBlockMath: 'Block Math',
    modFlowchart: 'Flowchart', modSequence: 'Sequence', modGantt: 'Gantt',
    modClassDiag: 'Class Diagram', modPie: 'Pie Chart', modState: 'State Diagram',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: 'Standard Article', modEncArticle: 'Encrypted Article', modPinArticle: 'Pinned Announcement', modTutorial: 'Tech Tutorial'
  },
  ja: {
    pageTitle: 'Mizuki ビジュアルエディタ',
    themeColor: 'テーマカラー', themeMode: 'テーマモード',
    themeDark: 'デフォルトダーク', themeLight: 'ライト', themeDeepBlue: 'ディープブルー', themeHighContrast: 'ハイコントラスト',
    colorRed: '赤', colorOrange: 'オレンジ', colorYellow: '黄', colorGreen: '緑',
    colorCyan: 'シアン', colorBlue: '青', colorPurple: '紫', colorPink: 'ピンク',
    modulePanel: 'モジュール', searchModules: 'モジュール検索...',
    editorPlaceholder: 'ここにMarkdownを入力...',
    cmdHeading: '見出し', cmdBold: '太字', cmdItalic: '斜体', cmdStrikethrough: '取消線',
    cmdUl: '箇条書き', cmdOl: '番号付き', cmdTask: 'タスク', cmdQuote: '引用',
    cmdCode: 'インラインコード', cmdCodeblock: 'コードブロック', cmdLink: 'リンク', cmdImage: '画像',
    cmdTable: '表', cmdHr: '区切り線',
    viewEdit: '編集', viewSplit: '分割', viewPreview: 'プレビュー',
    importFile: 'インポート', exportFile: 'エクスポート',
    fmConfig: 'Front Matter 設定',
    fmTitle: 'タイトル', fmTitlePh: '記事タイトル',
    fmPublished: '公開日', fmUpdated: '更新日',
    fmDesc: '説明', fmDescPh: '記事の説明',
    fmImage: 'カバー画像', fmCategory: 'カテゴリ', fmCategoryPh: 'カテゴリ名',
    fmTags: 'タグ', fmTagsPh: 'タグ1, タグ2, タグ3',
    fmDraft: '下書き', fmPinned: 'ピン留め', fmComment: 'コメント', fmEncrypted: '暗号化',
    fmPassword: 'パスワード', fmPasswordPh: 'アクセスパスワード',
    fmPriority: '優先度', fmAlias: 'エイリアス', fmLang: '言語', fmLangDefault: 'デフォルト',
    fmLicense: 'ライセンス', fmAuthor: '著者', fmAuthorPh: '著者名', fmSourceLink: 'ソースリンク',
    fmApply: '記事に適用', fmCancelBtn: 'キャンセル',
    exportTitle: 'ファイルエクスポート', exportTxt: '📄 プレーンテキスト (.txt)',
    dropMain: '📂 ファイルをここにドラッグ＆ドロップ', dropSub: '.md .txt .html に対応',
    catFrontMatter: 'Front Matter', catBasicMd: '基本 Markdown', catExtended: '拡張機能',
    catMermaid: 'Mermaid 図表', catVideo: '動画埋め込み', catTemplates: '記事テンプレート',
    modBasicConfig: '基本設定', modEncryptConfig: '暗号化設定', modPinConfig: 'ピン留め設定', modDraftConfig: '下書き設定',
    modH1: '見出し1', modH2: '見出し2', modH3: '見出し3',
    modBold: '太字', modItalic: '斜体', modStrike: '取消線',
    modUl: '箇条書き', modOl: '番号付き', modTask: 'タスク',
    modQuote: '引用ブロック', modInlineCode: 'インラインコード', modCodeBlock: 'コードブロック',
    modLink: 'リンク', modImage: '画像', modTable: '表', modHr: '区切り線', modHtml: 'HTMLブロック',
    modGithubCard: 'GitHub カード',
    modNote: 'Note ノート', modTip: 'Tip ヒント', modImportant: 'Important 重要',
    modWarning: 'Warning 警告', modCaution: 'Caution 注意', modCustomAdmonition: 'カスタムタイトル',
    modSpoiler: 'Spoiler 隠す', modExcerpt: '抜粋区切り',
    modInlineMath: 'インライン数式', modBlockMath: 'ブロック数式',
    modFlowchart: 'フローチャート', modSequence: 'シーケンス図', modGantt: 'ガントチャート',
    modClassDiag: 'クラス図', modPie: '円グラフ', modState: '状態図',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準記事', modEncArticle: '暗号化記事', modPinArticle: 'ピン留め公告', modTutorial: '技術チュートリアル'
  }
};

let currentLang = 'zh-CN';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N['zh-CN'][key]) || key;
}

function applyI18n() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'TITLE') document.title = t(key);
    else el.textContent = t(key);
  });
  // Titles (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // Update html lang attribute
  const langMap = { 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en', ja: 'ja' };
  document.documentElement.lang = langMap[currentLang] || 'zh-CN';
  // Re-render modules with new language
  renderModules($('#moduleSearch').value);
}

// ========== Module Data ==========
const MODULES = [
  { catKey: 'catFrontMatter', icon: '⚙️', items: [
    { nameKey: 'modBasicConfig', icon: '📋', code: '---\ntitle: "文章标题"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "文章描述"\nimage: "./cover.webp"\ntags: [标签1, 标签2]\ncategory: 分类名称\ndraft: false\npinned: false\ncomment: true\n---\n\n' },
    { nameKey: 'modEncryptConfig', icon: '🔒', code: '---\ntitle: "加密文章"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "加密文章描述"\nencrypted: true\npassword: "123456"\ntags: [加密]\ncategory: 安全\n---\n\n' },
    { nameKey: 'modPinConfig', icon: '📌', code: '---\ntitle: "置顶文章"\npublished: ' + new Date().toISOString().split('T')[0] + '\npinned: true\npriority: 0\ndescription: "置顶文章描述"\ntags: [公告]\ncategory: 公告\n---\n\n' },
    { nameKey: 'modDraftConfig', icon: '📝', code: '---\ntitle: "草稿文章"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndraft: true\ntags: [草稿]\ncategory: 示例\n---\n\n' }
  ]},
  { catKey: 'catBasicMd', icon: '✏️', items: [
    { nameKey: 'modH1', icon: 'H1', code: '# 标题\n\n' },
    { nameKey: 'modH2', icon: 'H2', code: '## 标题\n\n' },
    { nameKey: 'modH3', icon: 'H3', code: '### 标题\n\n' },
    { nameKey: 'modBold', icon: 'B', code: '**加粗文本**' },
    { nameKey: 'modItalic', icon: 'I', code: '*斜体文本*' },
    { nameKey: 'modStrike', icon: 'S', code: '~~删除文本~~' },
    { nameKey: 'modUl', icon: '⊙', code: '- 列表项一\n- 列表项二\n- 列表项三\n\n' },
    { nameKey: 'modOl', icon: '①', code: '1. 第一项\n2. 第二项\n3. 第三项\n\n' },
    { nameKey: 'modTask', icon: '☑', code: '- [x] 已完成任务\n- [ ] 未完成任务\n- [ ] 待办事项\n\n' },
    { nameKey: 'modQuote', icon: '❝', code: '> 引用内容\n>\n> 引用第二段\n\n' },
    { nameKey: 'modInlineCode', icon: '⌥', code: '`行内代码`' },
    { nameKey: 'modCodeBlock', icon: '{ }', code: '```javascript\n// 代码内容\nconsole.log("Hello");\n```\n\n' },
    { nameKey: 'modLink', icon: '🔗', code: '[链接文本](https://example.com "标题")' },
    { nameKey: 'modImage', icon: '🖼', code: '![替代文本](./images/photo.png "图片标题")\n\n' },
    { nameKey: 'modTable', icon: '▦', code: '| 列1 | 列2 | 列3 |\n|------|------|------|\n| 内容 | 内容 | 内容 |\n| 内容 | 内容 | 内容 |\n\n' },
    { nameKey: 'modHr', icon: '─', code: '\n---\n\n' },
    { nameKey: 'modHtml', icon: '🏷', code: '<div class="custom">\n  HTML内容\n</div>\n\n' }
  ]},
  { catKey: 'catExtended', icon: '🚀', items: [
    { nameKey: 'modGithubCard', icon: '🐙', code: ':::github{repo="用户名/仓库名"}\n\n' },
    { nameKey: 'modNote', icon: '💡', code: '::::note\n提示信息内容。\n::::\n\n' },
    { nameKey: 'modTip', icon: '💚', code: '::::tip\n技巧和建议内容。\n::::\n\n' },
    { nameKey: 'modImportant', icon: '💜', code: '::::important\n重要信息内容。\n::::\n\n' },
    { nameKey: 'modWarning', icon: '⚠️', code: '::::warning\n警告内容。\n::::\n\n' },
    { nameKey: 'modCaution', icon: '🔴', code: '::::caution\n注意事项内容。\n::::\n\n' },
    { nameKey: 'modCustomAdmonition', icon: '📌', code: '::::note[自定义标题]\n带有自定义标题的提示框内容。\n::::\n\n' },
    { nameKey: 'modSpoiler', icon: '👁', code: ':spoiler[隐藏的内容]' },
    { nameKey: 'modExcerpt', icon: '✂️', code: '\n<!--more-->\n\n' },
    { nameKey: 'modInlineMath', icon: '∑', code: '$E = mc^2$' },
    { nameKey: 'modBlockMath', icon: '∫', code: '$$\n\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}\n$$\n\n' }
  ]},
  { catKey: 'catMermaid', icon: '📊', items: [
    { nameKey: 'modFlowchart', icon: '🔀', code: '```mermaid\ngraph TD\n    A[开始] --> B{条件判断}\n    B -->|是| C[处理步骤1]\n    B -->|否| D[处理步骤2]\n    C --> E[结束]\n    D --> E\n```\n\n' },
    { nameKey: 'modSequence', icon: '⏱', code: '```mermaid\nsequenceDiagram\n    participant 用户\n    participant 应用\n    participant 服务器\n    用户->>应用: 提交请求\n    应用->>服务器: 发送数据\n    服务器-->>应用: 返回结果\n    应用-->>用户: 显示结果\n```\n\n' },
    { nameKey: 'modGantt', icon: '📅', code: '```mermaid\ngantt\n    title 项目时间线\n    dateFormat YYYY-MM-DD\n    section 设计\n    需求分析 :a1, 2024-01-01, 7d\n    UI设计   :a2, after a1, 10d\n    section 开发\n    前端开发 :b1, 2024-01-15, 15d\n    后端开发 :b2, 2024-01-20, 18d\n```\n\n' },
    { nameKey: 'modClassDiag', icon: '🏗', code: '```mermaid\nclassDiagram\n    class 用户 {\n        +用户名\n        +密码\n        +登录()\n        +退出()\n    }\n    class 文章 {\n        +标题\n        +内容\n        +发布()\n    }\n    用户 "1" -- "*" 文章 : 撰写\n```\n\n' },
    { nameKey: 'modPie', icon: '🥧', code: '```mermaid\npie title 数据分析\n    "分类A" : 45.6\n    "分类B" : 30.1\n    "分类C" : 15.3\n    "其他"  : 9.0\n```\n\n' },
    { nameKey: 'modState', icon: '🔄', code: '```mermaid\nstateDiagram-v2\n    [*] --> 草稿\n    草稿 --> 审核中 : 提交\n    审核中 --> 草稿 : 拒绝\n    审核中 --> 已发布 : 通过\n    已发布 --> 已归档 : 归档\n```\n\n' }
  ]},
  { catKey: 'catVideo', icon: '🎬', items: [
    { nameKey: 'modYoutube', icon: '▶️', code: '<iframe width="100%" height="468" src="https://www.youtube.com/embed/视频ID" title="YouTube" frameborder="0" allowfullscreen></iframe>\n\n' },
    { nameKey: 'modBilibili', icon: '📺', code: '<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=视频BV号&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>\n\n' }
  ]},
  { catKey: 'catTemplates', icon: '📑', items: [
    { nameKey: 'modStdArticle', icon: '📄', code: '---\ntitle: "文章标题"\npublished: ' + new Date().toISOString().split('T')[0] + '\nupdated: \ndescription: "文章描述"\nimage: ./cover.webp\ntags: [标签1, 标签2]\ncategory: 分类名称\ndraft: false\npinned: false\ncomment: true\n---\n\n# 文章主标题\n\n这里是文章开头部分。\n\n<!--more-->\n\n## 二级标题\n\n正文内容，支持**加粗**、*斜体*、`行内代码`。\n\n### 三级标题\n\n- 列表项一\n- 列表项二\n\n```javascript\nconsole.log("Hello World");\n```\n\n> 引用内容\n\n---\n\n## 总结\n\n文章总结部分。\n' },
    { nameKey: 'modEncArticle', icon: '🔐', code: '---\ntitle: "加密文章示例"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "需要密码访问的加密文章"\nencrypted: true\npassword: "myPassword123"\ntags: [加密, 安全]\ncategory: 安全\n---\n\n# 🔒 加密内容\n\n> 这是一篇加密文章，只有输入正确密码才能查看。\n\n## 敏感信息\n\n这里包含需要保护的内容。\n' },
    { nameKey: 'modPinArticle', icon: '📢', code: '---\ntitle: "重要公告"\npublished: ' + new Date().toISOString().split('T')[0] + '\npinned: true\npriority: 0\ndescription: "重要通知"\ntags: [公告, 重要]\ncategory: 公告\n---\n\n# 🚨 重要公告\n\n> 📅 **时间**：待定\n> 🔧 **影响范围**：全站\n\n## 详细内容\n\n公告详情...\n\n::::warning[重要提醒]\n请注意...\n::::\n' },
    { nameKey: 'modTutorial', icon: '🎓', code: '---\ntitle: "技术教程标题"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "技术教程描述"\nimage: "./cover.webp"\ntags: [教程, 技术]\ncategory: 技术教程\nlicenseName: "CC BY-NC-SA 4.0"\n---\n\n# 技术教程标题\n\n简介段落。\n\n<!--more-->\n\n## 基本概念\n\n概念说明...\n\n### 示例代码\n\n```python\ndef hello():\n    print("Hello World")\n```\n\n## 实际应用\n\n::::tip[实用技巧]\n技巧内容。\n::::\n\n```mermaid\ngraph TD\n    A[开始] --> B[结束]\n```\n\n## 总结\n\n**关键词**：关键词1, 关键词2\n' }
  ]}
];

// ========== DOM References ==========
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const editor = $('#editor');
const preview = $('#preview');
const moduleList = $('#moduleList');
const modulePanel = $('#modulePanel');
const editorSection = $('#editorSection');
const previewSection = $('#previewSection');

// ========== Theme Color ==========
function setHue(h) {
  document.documentElement.style.setProperty('--hue', h);
  $('#huePreview').style.background = `hsl(${h} 70% 55%)`;
  localStorage.setItem('mizuki-editor-hue', h);
}

$('#themePickerBtn').onclick = () => $('#themePickerPanel').classList.toggle('hidden');
$('#hueSlider').oninput = e => setHue(e.target.value);
$$('.preset').forEach(p => p.onclick = () => {
  const h = p.dataset.hue;
  $('#hueSlider').value = h;
  setHue(h);
});

// Restore saved hue
const savedHue = localStorage.getItem('mizuki-editor-hue');
if (savedHue) { $('#hueSlider').value = savedHue; setHue(savedHue); }
else { setHue(60); }

// Close picker on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.theme-picker-btn') && !e.target.closest('.theme-picker-panel'))
    $('#themePickerPanel').classList.add('hidden');
  if (!e.target.closest('#btnLang') && !e.target.closest('.lang-dropdown'))
    $('#langDropdown').classList.add('hidden');
});

// ========== Theme Switching ==========
const THEME_CLASSES = ['theme-light', 'theme-deep-blue', 'theme-high-contrast'];
const hljsStyleLink = document.querySelector('link[href*="highlight.js"]');

function setTheme(theme) {
  THEME_CLASSES.forEach(c => document.body.classList.remove(c));
  if (theme !== 'dark') {
    document.body.classList.add('theme-' + theme);
  }
  if (hljsStyleLink) {
    hljsStyleLink.href = theme === 'light'
      ? 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css'
      : 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css';
  }
  const hueDisabled = (theme === 'deep-blue' || theme === 'high-contrast');
  $('#hueSlider').disabled = hueDisabled;
  $('#hueSlider').style.opacity = hueDisabled ? '0.35' : '1';
  $$('.preset').forEach(p => p.style.pointerEvents = hueDisabled ? 'none' : 'auto');
  $$('.theme-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
  localStorage.setItem('mizuki-editor-theme', theme);
  updatePreview();
}

$$('.theme-opt').forEach(opt => {
  opt.onclick = () => setTheme(opt.dataset.theme);
});

const savedTheme = localStorage.getItem('mizuki-editor-theme');
if (savedTheme && savedTheme !== 'dark') {
  setTheme(savedTheme);
}

// ========== Language Switching ==========
$('#btnLang').onclick = () => $('#langDropdown').classList.toggle('hidden');

function setLanguage(lang) {
  currentLang = lang;
  $$('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  localStorage.setItem('mizuki-editor-lang', lang);
  applyI18n();
}

$$('.lang-opt').forEach(opt => {
  opt.onclick = () => {
    setLanguage(opt.dataset.lang);
    $('#langDropdown').classList.add('hidden');
  };
});

// Restore saved language
const savedLang = localStorage.getItem('mizuki-editor-lang');
if (savedLang && I18N[savedLang]) {
  setLanguage(savedLang);
} else {
  applyI18n(); // apply default zh-CN
}

// ========== Module Panel ==========
function renderModules(filter = '') {
  moduleList.innerHTML = '';
  const f = filter.toLowerCase();
  MODULES.forEach(cat => {
    const catName = t(cat.catKey);
    const items = cat.items.filter(i => {
      const itemName = t(i.nameKey);
      return !f || itemName.toLowerCase().includes(f) || catName.toLowerCase().includes(f);
    });
    if (!items.length) return;
    const catEl = document.createElement('div');
    catEl.className = 'module-category';
    catEl.innerHTML = `<div class="module-cat-header"><span class="arrow">▼</span>${cat.icon} ${catName}</div><div class="module-cat-items"></div>`;
    const itemsEl = catEl.querySelector('.module-cat-items');
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'module-item';
      el.innerHTML = `<span class="icon">${item.icon}</span>${t(item.nameKey)}`;
      el.onclick = () => insertAtCursor(item.code);
      el.draggable = true;
      el.ondragstart = e => e.dataTransfer.setData('text/plain', item.code);
      itemsEl.appendChild(el);
    });
    catEl.querySelector('.module-cat-header').onclick = function() {
      this.classList.toggle('collapsed');
      itemsEl.classList.toggle('collapsed');
    };
    moduleList.appendChild(catEl);
  });
}

$('#moduleSearch').oninput = e => renderModules(e.target.value);
renderModules();

// Toggle panel
$('#toggleModules').onclick = () => modulePanel.classList.toggle('collapsed');

// ========== Editor Core ==========
function insertAtCursor(text) {
  editor.focus();
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const val = editor.value;
  editor.value = val.substring(0, start) + text + val.substring(end);
  const newPos = start + text.length;
  editor.setSelectionRange(newPos, newPos);
  updatePreview();
}

// Toolbar commands
$$('[data-cmd]').forEach(btn => {
  btn.onclick = () => {
    const cmd = btn.dataset.cmd;
    const map = {
      heading: '## ', bold: '**加粗**', italic: '*斜体*', strikethrough: '~~删除~~',
      ul: '- ', ol: '1. ', task: '- [ ] ', quote: '> ',
      code: '`代码`', codeblock: '```\n代码\n```\n',
      link: '[文本](url)', image: '![描述](url)',
      table: '| 列1 | 列2 |\n|------|------|\n| 内容 | 内容 |\n',
      hr: '\n---\n'
    };
    if (map[cmd]) insertAtCursor(map[cmd]);
  };
});

// Tab key support
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    insertAtCursor('  ');
  }
});

// Drop support on editor
editor.addEventListener('dragover', e => e.preventDefault());
editor.addEventListener('drop', e => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text/plain');
  if (text) insertAtCursor(text);
});

// ========== Preview ==========
function updatePreview() {
  if (previewSection.classList.contains('hidden')) return;
  let content = editor.value;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) content = content.substring(end + 3).trim();
  }
  try {
    preview.innerHTML = marked.parse(content, {
      gfm: true, breaks: true,
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
        return hljs.highlightAuto(code).value;
      }
    });
  } catch(e) {
    preview.innerHTML = marked.parse(content);
  }
}

let previewTimer;
editor.addEventListener('input', () => {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 300);
});

// ========== View Switching ==========
$$('.view-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    if (view === 'edit') {
      editorSection.classList.remove('hidden');
      previewSection.classList.add('hidden');
    } else if (view === 'preview') {
      editorSection.classList.add('hidden');
      previewSection.classList.remove('hidden');
      updatePreview();
    } else {
      editorSection.classList.remove('hidden');
      previewSection.classList.remove('hidden');
      updatePreview();
    }
  };
});

// ========== Front Matter Modal ==========
function toggleModal(id, show) {
  const m = document.getElementById(id);
  if (show) m.classList.remove('hidden');
  else m.classList.add('hidden');
}
window.toggleModal = toggleModal;

$('#btnFrontMatter').onclick = () => { parseFMFromEditor(); toggleModal('fmModal', true); };
$('#fmClose').onclick = () => toggleModal('fmModal', false);
$('#fmCancel').onclick = () => toggleModal('fmModal', false);
$('#fmModal .modal-overlay').onclick = () => toggleModal('fmModal', false);

$('#fm-encrypted').onchange = function() {
  $('#fm-password-row').classList.toggle('hidden', !this.checked);
};

function parseFMFromEditor() {
  const val = editor.value;
  if (!val.startsWith('---')) return;
  const end = val.indexOf('---', 3);
  if (end === -1) return;
  const yaml = val.substring(3, end).trim();
  const lines = yaml.split('\n');
  lines.forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) return;
    const [, key, value] = m;
    const v = value.replace(/^["']|["']$/g, '').trim();
    const el = document.getElementById('fm-' + key);
    if (el) {
      if (el.type === 'checkbox') el.checked = v === 'true';
      else el.value = v;
    }
    if (key === 'tags') {
      $('#fm-tags').value = v.replace(/[\[\]]/g, '');
    }
  });
  if ($('#fm-encrypted').checked) $('#fm-password-row').classList.remove('hidden');
}

$('#fmApply').onclick = () => {
  let fm = '---\n';
  const add = (k, v) => { if (v) fm += `${k}: ${v}\n`; };
  const addQ = (k, v) => { if (v) fm += `${k}: "${v}"\n`; };
  addQ('title', $('#fm-title').value);
  add('published', $('#fm-published').value);
  if ($('#fm-updated').value) add('updated', $('#fm-updated').value);
  addQ('description', $('#fm-description').value);
  if ($('#fm-image').value) add('image', $('#fm-image').value);
  if ($('#fm-tags').value) {
    const tags = $('#fm-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    fm += `tags: [${tags.join(', ')}]\n`;
  }
  if ($('#fm-category').value) add('category', $('#fm-category').value);
  fm += `draft: ${$('#fm-draft').checked}\n`;
  fm += `pinned: ${$('#fm-pinned').checked}\n`;
  if ($('#fm-pinned').checked && $('#fm-priority').value) add('priority', $('#fm-priority').value);
  fm += `comment: ${$('#fm-comment').checked}\n`;
  if ($('#fm-encrypted').checked) {
    fm += 'encrypted: true\n';
    addQ('password', $('#fm-password').value);
  }
  if ($('#fm-alias').value) addQ('alias', $('#fm-alias').value);
  if ($('#fm-lang').value) add('lang', $('#fm-lang').value);
  if ($('#fm-license').value) addQ('licenseName', $('#fm-license').value);
  if ($('#fm-author').value) addQ('author', $('#fm-author').value);
  if ($('#fm-source').value) addQ('sourceLink', $('#fm-source').value);
  fm += '---\n\n';

  let content = editor.value;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) content = content.substring(end + 3).trimStart();
  }
  editor.value = fm + content;
  toggleModal('fmModal', false);
  updatePreview();
};

// ========== Import ==========
$('#btnImport').onclick = () => $('#fileInput').click();
$('#fileInput').onchange = e => {
  const file = e.target.files[0];
  if (file) readFile(file);
  e.target.value = '';
};

function readFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    let content = e.target.result;
    if (file.name.endsWith('.html')) {
      const tmp = document.createElement('div');
      tmp.innerHTML = content;
      content = tmp.textContent || tmp.innerText;
    }
    editor.value = content;
    updatePreview();
  };
  reader.readAsText(file);
}

// Drag & drop file import
document.addEventListener('dragover', e => {
  e.preventDefault();
  if (e.dataTransfer.types.includes('Files'))
    $('#dropOverlay').classList.remove('hidden');
});
$('#dropOverlay').addEventListener('dragleave', e => {
  if (e.target === $('#dropOverlay') || e.target.closest('.drop-message'))
    $('#dropOverlay').classList.add('hidden');
});
$('#dropOverlay').addEventListener('drop', e => {
  e.preventDefault();
  $('#dropOverlay').classList.add('hidden');
  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
});

// ========== Export ==========
$('#btnExport').onclick = () => toggleModal('exportModal', true);
$('#exportModal .modal-overlay').onclick = () => toggleModal('exportModal', false);

$$('.export-btn').forEach(btn => {
  btn.onclick = () => {
    const fmt = btn.dataset.format;
    let content, filename, mime;
    const raw = editor.value;
    if (fmt === 'md') {
      content = raw; filename = 'article.md'; mime = 'text/markdown';
    } else if (fmt === 'html') {
      let body = raw;
      if (body.startsWith('---')) {
        const end = body.indexOf('---', 3);
        if (end !== -1) body = body.substring(end + 3).trim();
      }
      const html = marked.parse(body);
      content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Article</title><style>body{font-family:system-ui;max-width:800px;margin:2em auto;padding:0 1em;line-height:1.7;color:#222}code{background:#f4f4f4;padding:2px 6px;border-radius:4px}pre{background:#f4f4f4;padding:1em;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #ddd;padding:.5em 1em;color:#666;margin:1em 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 12px}th{background:#f0f0f0}</style></head><body>${html}</body></html>`;
      filename = 'article.html'; mime = 'text/html';
    } else {
      let txt = raw;
      if (txt.startsWith('---')) {
        const end = txt.indexOf('---', 3);
        if (end !== -1) txt = txt.substring(end + 3).trim();
      }
      content = txt.replace(/[#*`~>[\]()_|\\-]/g, '').replace(/\n{3,}/g, '\n\n');
      filename = 'article.txt'; mime = 'text/plain';
    }
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click(); URL.revokeObjectURL(url);
    toggleModal('exportModal', false);
  };
});

// ========== Init ==========
$('#fm-published').value = new Date().toISOString().split('T')[0];

})();
