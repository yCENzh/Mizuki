// Projects page filter handler
// Loaded as global script, works with Swup page transitions

(() => {
	if (typeof window.projectsPageState === "undefined") {
		window.projectsPageState = {
			initialized: false,
		};
	}

	function initProjectsFilter() {
		var categoryTags = document.querySelectorAll(
			".filter-tag[data-category]",
		);
		var cards = document.querySelectorAll(".project-card");
		var noResults = document.getElementById("no-results");

		if (categoryTags.length === 0 || cards.length === 0) {
			return false;
		}

		cards.forEach(function (card) {
			card.classList.remove("filtered-out");
		});
		if (noResults) noResults.classList.add("hidden");

		categoryTags.forEach(function (tag) {
			tag.classList.remove("active");
		});
		var allTag = document.querySelector('.filter-tag[data-category="all"]');
		if (allTag) allTag.classList.add("active");

		categoryTags.forEach(function (tag) {
			tag.addEventListener("click", function () {
				categoryTags.forEach(function (t) {
					t.classList.remove("active");
				});
				tag.classList.add("active");

				var activeCategory = tag.dataset.category || "all";
				var visibleCount = 0;

				cards.forEach(function (card) {
					var cardCategory = card.dataset.category;
					var match =
						activeCategory === "all" ||
						cardCategory === activeCategory;

					if (match) {
						card.classList.remove("filtered-out");
						visibleCount++;
					} else {
						card.classList.add("filtered-out");
					}
				});

				if (noResults) {
					noResults.classList.toggle("hidden", visibleCount > 0);
				}
			});
		});

		window.projectsPageState.initialized = true;
		return true;
	}

	function onInit() {
		if (document.querySelector(".filter-tag[data-category]")) {
			initProjectsFilter();
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onInit);
	} else {
		onInit();
	}

	document.addEventListener("astro:page-load", onInit);
})();
