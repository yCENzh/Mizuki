import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { siteConfig } from '@/config';
import { parse as htmlParser } from 'node-html-parser';
import { getImage } from 'astro:assets';
import type { APIContext, ImageMetadata } from 'astro';
import type { RSSFeedItem } from '@astrojs/rss';
import { getSortedPosts } from '@/utils/content-utils';

const markdownParser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

/**
 * 处理图片路径转换为绝对URL
 * @param src 原始图片路径
 * @param siteUrl 网站基础URL
 * @returns 转换后的绝对URL或原路径
 */
async function processImagePath(src: string, siteUrl: URL): Promise<string> {
	if (!src) return src;
	
	// 已经是绝对URL，直接返回
	if (src.startsWith('http://') || src.startsWith('https://')) {
		return src;
	}
	
	// 处理相对路径
	if (src.startsWith('./') || src.startsWith('../')) {
		let importPath: string | null = null;
		
		if (src.startsWith('./')) {
			const prefixRemoved = src.slice(2);
			importPath = `/src/content/posts/${prefixRemoved}`;
		} else {
			const cleaned = src.replace(/^\.\.\//, '');
			importPath = `/src/content/${cleaned}`;
		}
		
		try {
			const imageMod = await imagesGlob[importPath]?.()?.then((res) => res.default);
			if (imageMod) {
				const optimizedImg = await getImage({ src: imageMod });
				return new URL(optimizedImg.src, siteUrl).href;
			}
		} catch (error) {
			console.warn(`Failed to process image: ${importPath}`, error);
		}
		
		// 如果处理失败，尝试作为普通相对路径处理
		return new URL(src, siteUrl).href;
	}
	
	// 处理绝对路径（以/开头）
	if (src.startsWith('/')) {
		return new URL(src, siteUrl).href;
	}
	
	// 处理其他情况，尝试作为相对路径
	return new URL(src, siteUrl).href;
}

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	'/src/content/**/*.{jpeg,jpg,png,gif,webp,svg,bmp,tiff,ico}',
);

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error('RSS generation failed: site URL not configured in astro.config.mjs');
	}

	console.log(`Generating RSS feed for site: ${context.site.href}`);
	
	const posts = await getSortedPosts();
	const feed: RSSFeedItem[] = [];

	let totalImages = 0;
	let processedImages = 0;
	
	for (const post of posts) {
		const cleanedBody = stripInvalidXmlChars(post.body);
		
		const htmlString = markdownParser.render(cleanedBody);
		
		const html = htmlParser.parse(htmlString);
		
		const images = html.querySelectorAll('img');
		totalImages += images.length;
		
		for (const img of images) {
			const src = img.getAttribute('src');
			if (!src) continue;

			try {
				const absoluteUrl = await processImagePath(src, context.site);
				img.setAttribute('src', absoluteUrl);
				processedImages++;
			} catch (error) {
				console.warn(`Failed to process image path: ${src} in post: ${post.slug}`, error);
				// 作为最后的备选方案，尝试创建绝对URL
				try {
					img.setAttribute('src', new URL(src, context.site).href);
					processedImages++;
				} catch (urlError) {
					console.warn(`Failed to create absolute URL for: ${src} in post: ${post.slug}`, urlError);
					// 保持原路径不变
				}
			}
		}

		const processedHtml = html.toString();
		
		const finalContent = stripInvalidXmlChars(processedHtml);

		feed.push({
			title: stripInvalidXmlChars(post.data.title),
			description: stripInvalidXmlChars(post.data.description || ''),
			pubDate: post.data.published,
			link: `/posts/${post.slug}/`,
			content: sanitizeHtml(finalContent, {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ['src', 'alt', 'title', 'width', 'height', 'loading']
				}
			}),
		});
	}
	
	console.log(`RSS generation completed: ${processedImages}/${totalImages} images processed successfully`);

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || 'No description',
		site: context.site,
		items: feed,
		customData: `<language>zh-CN</language>`,
	});
}
