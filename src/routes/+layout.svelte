<script>
	import '../app.css';
	let { children, data } = $props();
</script>

<div>
	<form method="POST" action="/changetheme" class="flex justify-end">
		<button class="btn m-3">Theme: {data.theme}</button>
	</form>
</div>
<main class="max-w-[800px] mx-auto p-5">
	{@render children()}
</main>
