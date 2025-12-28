import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const API_BASE = "https://api.bgm.tv";
const CONFIG_PATH = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../src/config.ts",
);
const OUTPUT_FILE = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../src/data/bangumi-data.json",
);

async function getUserIdFromConfig() {
	try {
		const configContent = await fs.readFile(CONFIG_PATH, "utf-8");
		const match = configContent.match(
			/bangumi:\s*\{[\s\S]*?userId:\s*["']([^"']+)["']/,
		);

		if (match && match[1]) {
			const userId = match[1];
			if (
				userId === "your-bangumi-id" ||
				userId === "your-user-id" ||
				!userId
			) {
				console.warn(
					"警告: src/config.ts 中的 userId 似乎是默认值。",
				);
				return userId;
			}
			return userId;
		}
		throw new Error("Could not find bangumi.userId in config.ts");
	} catch (error) {
		console.error("✘ 无法从 config.ts 读取 Bangumi ID");
		throw error;
	}
}

async function getAnimeModeFromConfig() {
	try {
		const configContent = await fs.readFile(CONFIG_PATH, "utf-8");
		const match = configContent.match(
			/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);

		if (match && match[1]) {
			return match[1];
		}
		return "bangumi";
	} catch (error) {
		return "bangumi";
	}
}

// 模拟延迟防止 API 限制
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSubjectPersons(subjectId) {
	try {
		const response = await fetch(
			`${API_BASE}/v0/subjects/${subjectId}/persons`,
		);
		if (!response.ok) return [];
		const data = await response.json();
		return Array.isArray(data) ? data : [];
	} catch (error) {
		return [];
	}
}

async function fetchCollection(userId, type) {
	let allData = [];
	let offset = 0;
	const limit = 50;
	let hasMore = true;

	console.log(`正在获取类型: ${type}...`);

	while (hasMore) {
		const url = `${API_BASE}/v0/users/${userId}/collections?subject_type=2&type=${type}&limit=${limit}&offset=${offset}`;
		try {
			const response = await fetch(url);

			if (!response.ok) {
				if (response.status === 404) {
					console.log(`   用户 ${userId} 不存在或没有此类型的数据。`);
					return [];
				}
				throw new Error(`API Error ${response.status}`);
			}

			const data = await response.json();

			if (data.data && data.data.length > 0) {
				allData = [...allData, ...data.data];
				process.stdout.write(`   已获取 ${allData.length} 条数据...\r`);
			}

			if (!data.data || data.data.length < limit) {
				hasMore = false;
			} else {
				offset += limit;
				await delay(300);
			}
		} catch (e) {
			console.error(`\n获取失败 (Type ${type}):`, e.message);
			hasMore = false;
		}
	}
	console.log("");
	return allData;
}

async function processData(items, status) {
	const results = [];
	let count = 0;
	const total = items.length;

	for (const item of items) {
		count++;
		process.stdout.write(
			`[${status}] 处理进度: ${count}/${total} (${item.subject_id})\r`,
		);

		const subjectPersons = await fetchSubjectPersons(item.subject_id);
		await delay(100);

		const year = item.subject?.date
			? item.subject.date.slice(0, 4)
			: "Unknown";

		const rating = item.subject?.score
			? Number.parseFloat(item.subject.score.toFixed(1))
			: item.rate
				? Number.parseFloat(item.rate.toFixed(1))
				: 0;

		const progress = item.ep_status || 0;
		const totalEpisodes = item.subject?.eps || progress;

		let studio = "Unknown";
		if (Array.isArray(subjectPersons)) {
			const priorities = ["动画制作", "製作", "制作"];
			for (const relation of priorities) {
				const match = subjectPersons.find(
					(p) => p.relation === relation,
				);
				if (match?.name) {
					studio = match.name;
					break;
				}
			}
		}

		results.push({
			title:
				item.subject?.name_cn || item.subject?.name || "Unknown Title",
			status: status,
			rating: rating,
			cover: item.subject?.images?.medium || "/assets/anime/default.webp",
			description: (
				item.subject?.short_summary ||
				item.subject?.name_cn ||
				""
			).trimStart(),
			episodes: `${totalEpisodes} episodes`,
			year: year,
			genre: item.subject?.tags
				? item.subject.tags.slice(0, 3).map((tag) => tag.name)
				: ["Unknown"],
			studio: studio,
			link: item.subject?.id
				? `https://bgm.tv/subject/${item.subject.id}`
				: "#",
			progress: progress,
			totalEpisodes: totalEpisodes,
			startDate: item.subject?.date || "",
			endDate: item.subject?.date || "",
		});
	}
	console.log(`\n✓ 完成 ${status} 列表处理`);
	return results;
}

async function main() {
	console.log("初始化 Bangumi 数据更新脚本...");

	const animeMode = await getAnimeModeFromConfig();
	if (animeMode !== "bangumi") {
		console.log(
			`检测到当前番剧模式为 "${animeMode}"，跳过 Bangumi 数据更新。`,
		);
		return;
	}

	const USER_ID = await getUserIdFromConfig();
	console.log(`读取到 User ID: ${USER_ID}`);

	const collections = [
		{ type: 3, status: "watching" },
		{ type: 1, status: "planned" },
		{ type: 2, status: "completed" },
		{ type: 4, status: "onhold" },
		{ type: 5, status: "dropped" },
	];

	let finalAnimeList = [];

	for (const c of collections) {
		const rawData = await fetchCollection(USER_ID, c.type);
		if (rawData.length > 0) {
			const processed = await processData(rawData, c.status);
			finalAnimeList = [...finalAnimeList, ...processed];
		}
	}

	const dir = path.dirname(OUTPUT_FILE);
	try {
		await fs.access(dir);
	} catch {
		await fs.mkdir(dir, { recursive: true });
	}

	await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalAnimeList, null, 2));
	console.log(`\n更新完成！数据已保存到: ${OUTPUT_FILE}`);
	console.log(`总计收录: ${finalAnimeList.length} 部番剧`);
}

main().catch((err) => {
	console.error("\n✘ 脚本执行出错:");
	console.error(err);
	process.exit(1);
});
