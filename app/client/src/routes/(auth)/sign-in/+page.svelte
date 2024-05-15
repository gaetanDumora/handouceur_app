<script lang="ts">
	import { enhance } from '$app/forms'; // see https://kit.svelte.dev/docs/form-actions#progressive-enhancement
	import { user } from '$lib/stores/user';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let identifier = form?.values?.identifier ?? '';
	let candidatePassword = form?.values?.candidatePassword ?? '';

	// With enhance, the page will not reload, instead the component state is updated.
	// That means any usage of props in code will have to be reactive to work correctly.
	$: user.set({
		username: form?.data?.username,
		accessToken: form?.data?.accessToken,
		acl: form?.data?.acl
	});
</script>

<div class="flex flex-col gap-2">
	{#if form?.success}
		<div class="flex justify-center">
			<p class="text-secondary font-bold text-xl">Welcome back!</p>
		</div>
	{/if}

	<form class="flex flex-col gap-2 w-64" action="?/login" method="post" use:enhance>
		<div class="">
			<label class="input input-bordered input-primary flex items-center gap-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4 opacity-70"
					><path
						d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
					/></svg
				>
				<input
					bind:value={identifier}
					type="text"
					placeholder="Username or Email"
					name="identifier"
				/>
			</label>
			{#if form?.errors?.identifier?.reason}
				<p class="label-text-alt text-error p-2">
					{form.errors.identifier.reason}
				</p>
			{/if}
		</div>

		<div class="">
			<label class="input input-bordered input-primary flex items-center gap-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4 opacity-70"
					><path
						fill-rule="evenodd"
						d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
						clip-rule="evenodd"
					/></svg
				>
				<input
					bind:value={candidatePassword}
					type="text"
					placeholder="Password"
					name="candidatePassword"
				/>
			</label>
			{#if form?.errors?.candidatePassword?.reason}
				<p class="label-text-alt text-error p-2">{form.errors.candidatePassword.reason}</p>
			{/if}
		</div>

		<button disabled={form?.success} class="btn btn-secondary mt-6">Login</button>
	</form>

	<a class="text-xs underline mt-4 text-center" href="/">forget password</a>
</div>
