<script lang="ts">
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import I18nKey from "../../../i18n/i18nKey";
	import { i18n } from "../../../i18n/translation";
	import { navigateToPage } from "../../../utils/navigation-utils";
	import { panelManager } from "../../../utils/panel-manager.js";
	import {
		// 类型
		type TOCItem,
		type PostItem,
		// 函数
		generateTOCItems,
		generatePostItems,
		checkIsHomePage,
		scrollToHeading as scrollToHeadingUtil,
		getTOCConfig,
	} from "./hooks/useMobileTOC";

	// 状态
	let tocItems: TOCItem[] = $state([]);
	let postItems: PostItem[] = $state([]);
	let activeId = $state("");
	let isHomePage = $state(false);

	// 交叉观察器
	let observer: IntersectionObserver | undefined;
	let swupListenersRegistered = $state(false);

	// 面板切换
	const togglePanel = async () => {
		await panelManager.togglePanel("mobile-toc-panel");
	};

	const setPanelVisibility = async (show: boolean): Promise<void> => {
		await panelManager.togglePanel("mobile-toc-panel", show);
	};

	// 导航函数
	const scrollToHeading = (id: string) => {
		setPanelVisibility(false);
		scrollToHeadingUtil(id);
	};

	const navigateToPost = (url: string) => {
		setPanelVisibility(false);
		navigateToPage(url);
	};

	// 更新活动标题
	const updateActiveHeading = () => {
		const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		const scrollTop = window.scrollY;
		const offset = 100;

		let currentActiveId = "";
		headings.forEach((heading) => {
			if (heading.id) {
				const elementTop = (heading as HTMLElement).offsetTop - offset;
				if (scrollTop >= elementTop) {
					currentActiveId = heading.id;
				}
			}
		});

		activeId = currentActiveId;
	};

	// 设置交叉观察器
	const setupIntersectionObserver = () => {
		const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

		if (observer) {
			observer.disconnect();
		}

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				});
			},
			{
				rootMargin: "-80px 0px -80% 0px",
				threshold: 0,
			},
		);

		headings.forEach((heading) => {
			if (heading.id) {
				observer?.observe(heading);
			}
		});
	};

	// 设置 Swup 监听器
	const setupSwupListeners = () => {
		if (typeof window !== "undefined" && (window as any).swup && !swupListenersRegistered) {
			const swup = (window as any).swup;

			swup.hooks.on("page:view", () => {
				setTimeout(() => init(), 200);
			});

			swupListenersRegistered = true;
		} else if (!swupListenersRegistered) {
			window.addEventListener("popstate", () => {
				setTimeout(init, 200);
			});
			swupListenersRegistered = true;
		}
	};

	// 检查 Swup 可用性
	const checkSwupAvailability = () => {
		if (typeof window !== "undefined") {
			if ((window as any).swup) {
				setupSwupListeners();
			} else {
				const checkSwup = () => {
					if ((window as any).swup) {
						setupSwupListeners();
						document.removeEventListener("swup:enable", checkSwup);
					}
				};

				document.addEventListener("swup:enable", checkSwup);
				setTimeout(() => {
					if ((window as any).swup) {
						setupSwupListeners();
						document.removeEventListener("swup:enable", checkSwup);
					}
				}, 1000);
			}
		}
	};

	// 初始化
	const init = () => {
		isHomePage = checkIsHomePage();
		checkSwupAvailability();

		if (isHomePage) {
			tocItems = [];
			postItems = generatePostItems();
		} else {
			const config = getTOCConfig();
			tocItems = generateTOCItems(config);
			postItems = [];
			setupIntersectionObserver();
			updateActiveHeading();
		}
	};

	// 生命周期
	onMount(() => {
		setTimeout(init, 100);
		window.addEventListener("scroll", updateActiveHeading);

		return () => {
			observer?.disconnect();
			window.removeEventListener("scroll", updateActiveHeading);

			if (typeof window !== "undefined" && (window as any).swup) {
				const swup = (window as any).swup;
				swup.hooks.off("page:view");
			}

			swupListenersRegistered = false;
		};
	});

	// 导出初始化函数供外部调用
	if (typeof window !== "undefined") {
		(window as any).mobileTOCInit = init;
	}
</script>

<!-- TOC toggle button for mobile -->
<button
	on:click={togglePanel}
	aria-label="Table of Contents"
	id="mobile-toc-switch"
	class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 lg:!hidden theme-switch-btn"
>
	<Icon icon="material-symbols:format-list-bulleted" class="text-[1.25rem]" />
</button>

<!-- Mobile TOC Panel -->
<div
	id="mobile-toc-panel"
	class="float-panel float-panel-closed mobile-toc-panel absolute md:w-[20rem] w-[calc(100vw-2rem)]
		top-20 left-4 md:left-[unset] right-4 shadow-2xl rounded-2xl p-4"
>
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-bold text-[var(--primary)]">
			{isHomePage ? i18n(I18nKey.postList) : i18n(I18nKey.tableOfContents)}
		</h3>
		<button
			on:click={togglePanel}
			aria-label="Close TOC"
			class="btn-plain rounded-lg h-8 w-8 active:scale-90 theme-switch-btn"
		>
			<Icon icon="material-symbols:close" class="text-[1rem]" />
		</button>
	</div>

	{#if isHomePage}
		{#if postItems.length === 0}
			<div class="text-center py-8 text-black/50 dark:text-white/50">
				<Icon icon="material-symbols:article-outline" class="text-2xl mb-2" />
				<p>暂无文章</p>
			</div>
		{:else}
			<div class="post-content">
				{#each postItems as post}
					<button
						on:click={() => navigateToPost(post.url)}
						class="post-item"
					>
						<div class="post-title">
							{#if post.pinned}
								<Icon icon="mdi:pin" class="pinned-icon" />
							{/if}
							{post.title}
						</div>
						{#if post.category}
							<div class="post-category">{post.category}</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	{:else}
		{#if tocItems.length === 0}
			<div class="text-center py-8 text-black/50 dark:text-white/50">
				<p>{i18n(I18nKey.tocEmpty)}</p>
			</div>
		{:else}
			<div class="toc-content">
				{#each tocItems as item}
					<button
						on:click={() => scrollToHeading(item.id)}
						class="toc-item level-{item.level} {activeId === item.id ? 'active' : ''}"
						class:active={activeId === item.id}
					>
						{#if item.level === 1}
							<span class="badge">{item.badge}</span>
						{:else if item.level === 2}
							<span class="dot-square"></span>
						{:else}
							<span class="dot-small"></span>
						{/if}
						<span class="toc-text">{item.text}</span>
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.mobile-toc-panel {
		max-height: calc(100vh - 120px);
		overflow-y: auto;
		background: var(--card-bg);
		border: 1px solid var(--line-color);
		backdrop-filter: blur(10px);
	}

	/* 确保主题切换按钮的背景色即时更新 */
	:global(.theme-switch-btn)::before {
		transition: transform 75ms ease-out, background-color 0ms !important;
	}

	.toc-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.post-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.toc-item {
		display: flex;
		align-items: center;
		width: 100%;
		text-align: left;
		padding: 8px 12px;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: none;
		background: transparent;
		cursor: pointer;
		color: rgba(0, 0, 0, 0.75);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	:global(.dark) .toc-item {
		color: rgba(255, 255, 255, 0.75);
	}

	.toc-item:hover {
		background: var(--btn-plain-bg-hover);
		color: var(--primary);
	}

	.toc-item.active {
		background: var(--btn-plain-bg-active);
		color: var(--primary);
		font-weight: 600;
		border-left: 3px solid var(--primary);
		padding-left: 9px;
	}

	/* 不同级别的标题缩进 */
	.toc-item.level-1 {
		padding-left: 12px;
		font-weight: 600;
		font-size: 1rem;
		gap: 8px;
	}

	.toc-item.level-2 {
		padding-left: 28px;
		gap: 6px;
	}

	.toc-item.level-3 {
		padding-left: 36px;
		font-size: 0.85rem;
		gap: 6px;
	}

	.toc-item.level-4 {
		padding-left: 44px;
		font-size: 0.8rem;
		gap: 6px;
	}

	.toc-item.level-5,
	.toc-item.level-6 {
		padding-left: 52px;
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.5);
		gap: 6px;
	}

	:global(.dark) .toc-item.level-5,
	:global(.dark) .toc-item.level-6 {
		color: rgba(255, 255, 255, 0.5);
	}

	.toc-item.level-1.active {
		padding-left: 9px;
	}

	.toc-item.level-2.active {
		padding-left: 25px;
	}

	.toc-item.level-3.active {
		padding-left: 33px;
	}

	.toc-item.level-4.active {
		padding-left: 41px;
	}

	.toc-item.level-5.active,
	.toc-item.level-6.active {
		padding-left: 49px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 4px;
		border-radius: 6px;
		background: var(--toc-badge-bg);
		color: var(--btn-content);
		font-size: 0.8rem;
		font-weight: 600;
		flex-shrink: 0;
		line-height: 1;
	}

	.dot-square {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: var(--toc-badge-bg);
		flex-shrink: 0;
	}

	.dot-small {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 2px;
		background: rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}

	:global(.dark) .dot-small {
		background: rgba(255, 255, 255, 0.1);
	}

	.toc-text {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
	}

	.post-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 12px;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: none;
		background: transparent;
		cursor: pointer;
		border: 1px solid var(--line-color);
	}

	.post-item:hover {
		background: var(--btn-plain-bg-hover);
		border-color: var(--primary);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.post-title {
		font-size: 0.9rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.75);
		margin-bottom: 4px;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.dark) .post-title {
		color: rgba(255, 255, 255, 0.75);
	}

	.post-category {
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.5);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.dark) .post-category {
		color: rgba(255, 255, 255, 0.5);
	}

	:global(.pinned-icon) {
		display: inline;
		color: var(--primary);
		font-size: 1.25rem;
		margin-right: 0.5rem;
		transform: translateY(-0.125rem);
		vertical-align: middle;
	}

	.post-item:hover .post-title {
		color: var(--primary);
	}

	.post-item:hover .post-category {
		color: rgba(0, 0, 0, 0.75);
	}

	:global(.dark) .post-item:hover .post-category {
		color: rgba(255, 255, 255, 0.75);
	}

	/* 滚动条样式 */
	.mobile-toc-panel::-webkit-scrollbar {
		width: 4px;
	}

	.mobile-toc-panel::-webkit-scrollbar-track {
		background: transparent;
	}

	.mobile-toc-panel::-webkit-scrollbar-thumb {
		background: var(--line-color);
		border-radius: 2px;
	}

	.mobile-toc-panel::-webkit-scrollbar-thumb:hover {
		background: var(--text-color-25);
	}
</style>
