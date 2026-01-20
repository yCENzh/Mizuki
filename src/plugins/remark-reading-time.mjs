import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	return (tree, { data }) => {
		const textOnPage = toString(tree);

		// 定义 中日韩 字符的正则范围（包含汉字、平假名、片假名、韩语谚文等）
		const cjkPattern =
			/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g;

		// 计算 CJK 字符数量
		const cjkMatches = textOnPage.match(cjkPattern);
		const cjkCount = cjkMatches ? cjkMatches.length : 0;

		// 将 CJK 字符替换为空格，计算剩余（主要是英文/数字）内容的统计信息
		const nonCjkText = textOnPage.replace(cjkPattern, " ");
		const nonCjkStats = getReadingTime(nonCjkText);

		const totalWords = nonCjkStats.words + cjkCount;

		// 计算预估阅读时间 (分钟)
		const wordsPerMinuteEn = 200;
		const charsPerMinuteCjk = 400;

		const minutes =
			nonCjkStats.words / wordsPerMinuteEn + cjkCount / charsPerMinuteCjk;

		data.astro.frontmatter.minutes = Math.max(1, Math.round(minutes));
		data.astro.frontmatter.words = totalWords;
	};
}
