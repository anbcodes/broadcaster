<script>
	import '../app.css';
	let { children } = $props();
</script>

<main class="max-w-[800px] mx-auto">
	{@render children()}
</main>