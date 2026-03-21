<script lang="ts">
	import { onMount, onDestroy } from "svelte";

	import SidebarCover from "./components/SidebarCover.svelte";
	import SidebarTrackInfo from "./components/SidebarTrackInfo.svelte";
	import SidebarProgress from "./components/SidebarProgress.svelte";
	import SidebarControls from "./components/SidebarControls.svelte";
	import SidebarPlaylist from "./components/SidebarPlaylist.svelte";
	import type { Song } from "../music-player/types";

	interface SidebarState {
		currentSong: Song;
		playlist: Song[];
		currentIndex: number;
		isPlaying: boolean;
		isLoading: boolean;
		currentTime: number;
		duration: number;
		volume: number;
		isMuted: boolean;
		isShuffled: boolean;
		isRepeating: number;
	}

	const defaultSong: Song = {
		id: 0,
		title: "",
		artist: "",
		cover: "",
		url: "",
		duration: 0,
	};

	let state: SidebarState = {
		currentSong: defaultSong,
		playlist: [],
		currentIndex: 0,
		isPlaying: false,
		isLoading: false,
		currentTime: 0,
		duration: 0,
		volume: 0.7,
		isMuted: false,
		isShuffled: false,
		isRepeating: 0,
	};

	let showPlaylist = false;

	function handleStateEvent(event: Event) {
		const custom = event as CustomEvent<SidebarState>;
		if (!custom.detail) {
			return;
		}
		state = custom.detail;
	}

	onMount(() => {
		window.addEventListener("music-sidebar:state", handleStateEvent);
	});

	onDestroy(() => {
		window.removeEventListener("music-sidebar:state", handleStateEvent);
	});

	function togglePlay() {
		window.dispatchEvent(new CustomEvent("music:toggle-play"));
	}

	function prev() {
		window.dispatchEvent(new CustomEvent("music:prev"));
	}

	function next() {
		window.dispatchEvent(new CustomEvent("music:next"));
	}

	function toggleMode() {
		window.dispatchEvent(new CustomEvent("music:toggle-mode"));
	}

	function togglePlaylist() {
		showPlaylist = !showPlaylist;
	}

	function playIndex(index: number) {
		window.dispatchEvent(
			new CustomEvent("music:play-index", { detail: { index } }),
		);
	}

	function seek(time: number) {
		window.dispatchEvent(
			new CustomEvent("music:seek", { detail: { time } }),
		);
	}

	function toggleMute() {
		window.dispatchEvent(new CustomEvent("music:toggle-mute"));
	}

	function setVolume(volume: number) {
		window.dispatchEvent(
			new CustomEvent("music:set-volume", { detail: { volume } }),
		);
	}
</script>

<div class="music-sidebar-widget">
	<div class="flex items-center gap-3 mb-2.5">
		<SidebarCover
			currentSong={state.currentSong}
			isPlaying={state.isPlaying}
			isLoading={state.isLoading}
			onTogglePlay={togglePlay}
		/>
		<SidebarTrackInfo
			currentSong={state.currentSong}
			currentTime={state.currentTime}
			duration={state.duration}
			volume={state.volume}
			isMuted={state.isMuted}
			onToggleMute={toggleMute}
			onSetVolume={setVolume}
		/>
	</div>

	<SidebarProgress
		currentTime={state.currentTime}
		duration={state.duration}
		onSeek={seek}
	/>

	<SidebarControls
		isPlaying={state.isPlaying}
		isShuffled={state.isShuffled}
		repeatMode={state.isRepeating}
		onToggleMode={toggleMode}
		onPrev={prev}
		onNext={next}
		onTogglePlay={togglePlay}
		onTogglePlaylist={togglePlaylist}
	/>

	<SidebarPlaylist
		playlist={state.playlist}
		currentIndex={state.currentIndex}
		isPlaying={state.isPlaying}
		show={showPlaylist}
		onClose={togglePlaylist}
		onPlaySong={playIndex}
	/>
</div>

<style>
	@media (max-width: 520px) {
		.music-sidebar-widget {
			min-width: 0;
		}

		.music-sidebar-widget > :global(div:first-child) {
			gap: 0.75rem;
			margin-bottom: 0.5rem;
		}
	}
</style>
