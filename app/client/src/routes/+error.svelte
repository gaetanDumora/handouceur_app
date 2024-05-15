<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex gap-4">
	<h1 class="text-xl">
		{$page.status}
	</h1>
	|
	<h1 class="text-xl">
		{$page.error?.message || 'Internal Error'}
	</h1>
</div>
