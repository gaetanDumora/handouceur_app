import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type UserRoles = 'owner' | 'admin' | 'user';
type UserPermissions = 'rwd' | 'rw' | 'ro';
export type User = {
	username?: string;
	accessToken?: string;
	acl?: {
		role: UserRoles;
		grant: UserPermissions;
	};
};

export const user = writable<User>({ username: undefined, accessToken: undefined, acl: undefined });

if (browser) {
	const item = localStorage.getItem('user');
	item && user.set(JSON.parse(item));
	user.subscribe((value) => localStorage.setItem('user', JSON.stringify(value)));
}
