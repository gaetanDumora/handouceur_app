import { type User } from '$lib/stores/user';

// contains your server-only library code. It can be imported by using the $lib/server alias. SvelteKit will prevent you from importing these in client code.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const API_URL = 'https://localhost:3000/api/v1';

type AuthServiceResponse = { success: boolean; reason?: { code: string; description: string } };
type SuccessLoginResponse = { data: User } & AuthServiceResponse;

export const registerUser = async (createUser: {
	emailAddress: string;
	username: string;
	password: string;
}) => {
	const { href } = new URL(`${API_URL}/auth/sign-up`);
	const body = JSON.stringify(createUser);
	const headers = {
		'Content-Type': 'application/json'
	};

	const request = await fetch(href, {
		method: 'POST',
		headers,
		body
	});
	if (!request.ok) {
		throw new Error(`User creation fail with status: ${request.statusText}`);
	}

	const response: AuthServiceResponse = await request.json();
	return response;
};

export const loginUser = async (credentials: { identifier: string; candidatePassword: string }) => {
	const { href } = new URL(`${API_URL}/auth/sign-in`);

	const body = JSON.stringify(credentials);
	const headers = {
		'Content-Type': 'application/json'
	};

	const request = await fetch(href, {
		method: 'POST',
		headers,
		body
	});
	if (!request.ok) {
		throw new Error(`Login fail with status: ${request.statusText}`);
	}

	const response: SuccessLoginResponse = await request.json();
	return response;
};
