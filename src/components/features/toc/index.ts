/**
 * TOC 组件统一导出
 *
 * Astro 组件使用包装器模式重导出
 * Svelte 组件（MobileTOC）请从原始位置导入：@components/MobileTOC.svelte
 */

// 组件导出（兼容包装器）
export { default as SidebarTOC } from "./SidebarTOC.astro";
export { default as FloatingTOC } from "./FloatingTOC.astro";

// 子组件导出
export { default as TOCBadge } from "./components/TOCBadge.astro";
export { default as TOCItemComponent } from "./components/TOCItem.astro";
export { default as TOCProgressBar } from "./components/TOCProgressBar.astro";

// 类型导出
export type {
	TOCItem,
	TOCConfig,
	HeadingData,
	TOCBaseProps,
	TOCObserverOptions,
	TOCScrollOptions,
} from "./types/toc";

// 工具函数导出
export {
	extractHeadings,
	getMinLevel,
	generateTOCItems,
	scrollToHeading,
	createHeadingObserver,
	getTOCConfig,
	calculateReadingProgress,
	debounce,
} from "./utils/toc-utils";

// Hooks 导出
export * from "./hooks/useFloatingTOC";

// Navigation hooks
export {
	extractHeadingsFromDOM,
	scrollToHeading as scrollToTocHeading,
	createHeadingClickHandler,
	getTOCConfig as getTocConfig,
	isPostPage,
	getContainerSelector,
} from "./hooks/useTocNavigation";

// Highlight hooks
export {
	findActiveHeadingIndex,
	findActiveHeadingByObserver,
	calculateActiveHeadingRange,
	createHeadingVisibilityObserver,
	isElementInViewport,
	calculateFallbackActiveHeading,
} from "./hooks/useTocHighlight";

// Scroll hooks
export {
	calculateReadingProgress as getReadingProgress,
	updateProgressRing,
	createScrollHandler,
	scrollActiveIntoView,
	calculateActiveIndicatorPosition,
	debounce as debounceScroll,
	throttle as throttleScroll,
} from "./hooks/useTocScroll";

// Calculator utilities
export {
	generateTOCItems as calcTOCItems,
	getMinLevel as calcMinLevel,
	getBadgeText,
	getBadgeClass,
	getIndentClass,
	getTextClass,
	isInRange,
} from "./utils/toc-calculator";

export {
	JAPANESE_KATAKANA,
	getKatakanaBadge,
	KATAKANA_COUNT,
} from "./utils/japanese-katakana";
