<script lang="ts">
	// Import Tailwind CSS
	import '../app.css';
	import { isDarkTheme } from '$lib/stores/theme';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';

	$: theme = $isDarkTheme ? 'dark' : 'myTheme';
</script>

<div data-theme={theme} class="flex flex-col h-screen justify-between">
	<!-- Navbar -->
	<Navbar bind:toggleTheme={$isDarkTheme} />

	<!-- Content -->
	<div class="flex flex-col items-center">
		<slot></slot>
	</div>

	<!-- Footer -->
	<Footer />
</div>
