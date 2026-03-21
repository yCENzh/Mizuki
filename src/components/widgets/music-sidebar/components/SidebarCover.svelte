<script lang="ts">
	import CoverImage from "../../music-player/atoms/CoverImage.svelte";
	import type { Song } from "../../music-player/types";

	interface Props {
		currentSong: Song;
		isPlaying: boolean;
		isLoading: boolean;
		onTogglePlay: () => void;
	}

	const { currentSong, isPlaying, isLoading, onTogglePlay }: Props = $props();
</script>

<CoverImage
	cover={currentSong.cover}
	{isPlaying}
	{isLoading}
	size="expanded"
	interactive={true}
	onclick={onTogglePlay}
/>
