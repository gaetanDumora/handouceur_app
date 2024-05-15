<script lang="ts">
	import { isDarkTheme } from '$lib/stores/theme';
	import { user } from '$lib/stores/user';
</script>

<div class="navbar bg-primary no-animation">
	<!-- Brand -->
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl text-accent">Svelte</a>
	</div>

	<div class="flex-none gap-6">
		<!-- Search -->
		<!-- <div class="form-control">
				<input
					type="text"
					placeholder="Search"
					class="input input-sm input-bordered w-24 md:w-auto sm"
				/>
			</div> -->

		<!-- Login / Profile icon -->
		{#if $user.username}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img
							alt="Tailwind CSS Navbar component"
							src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
						/>
					</div>
				</div>
				<ul
					class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
				>
					<li>
						<a href="_" class="justify-between">
							Profile
							<span class="badge">New</span>
						</a>
					</li>
					<li><a href="_">Settings</a></li>
					<li><a href="_">Logout</a></li>
				</ul>
			</div>
		{:else}
			<div class="flex gap-2">
				<a href="/sign-in" class="btn btn-sm btn-secondary">Sing in</a>
				<a href="/sign-up" class="btn btn-sm btn-accent">Sign up</a>
			</div>
		{/if}

		<!-- Theme -->
		<div class="text-neutral">
			<label class="flex cursor-pointer gap-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><circle cx="12" cy="12" r="5" /><path
						d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
					/></svg
				>
				<input
					type="checkbox"
					bind:checked={$isDarkTheme}
					class="toggle toggle-sm theme-controller bg-accent"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg
				>
			</label>
		</div>
	</div>
</div>
