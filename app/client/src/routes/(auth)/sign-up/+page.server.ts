import { INPUT_FIELD_ERRORS, TRANSLATED_CODE_ERRORS, type ErrorCodes } from '$lib/constants';
import { registerUser } from '$lib/server';
import { fail } from '@sveltejs/kit';

type InputErrors = {
	emailAddress?: { reason: string | undefined };
	username?: { reason: string | undefined };
	password?: { reason: string | undefined };
};

const validateEmail = (email: FormDataEntryValue | null) => {
	const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
	const reason = regex.test(email as string) ? undefined : INPUT_FIELD_ERRORS.EMAIL;
	return reason;
};
const validateUsername = (username: FormDataEntryValue | null) => {
	const reason = (username as string)?.length >= 5 ? undefined : INPUT_FIELD_ERRORS.USERNAME;
	return reason;
};
const validatePassword = (password: FormDataEntryValue | null) => {
	const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
	const reason = regex.test(password as string) ? undefined : INPUT_FIELD_ERRORS.PASSWORD;
	return reason;
};

const hasReasons = (errors: InputErrors) => {
	return Object.values(errors).some((error) => error.reason);
};

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();

		const emailAddress = formData.get('emailAddress') as string;
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const values = { emailAddress, username, password };

		let errors: InputErrors = {
			emailAddress: { reason: validateEmail(emailAddress) },
			username: { reason: validateUsername(username) },
			password: { reason: validatePassword(password) }
		};

		// Validate user inputs
		if (hasReasons(errors)) {
			return fail(400, { values, errors });
		}

		// Validate user creation
		const { success, reason } = await registerUser({ emailAddress, username, password });
		if (!success && reason) {
			const key = reason.description === 'email_address' ? 'emailAddress' : 'username';
			errors = { [key]: { reason: TRANSLATED_CODE_ERRORS[reason.code as ErrorCodes] } };
			return fail(400, { values, errors });
		}

		return { success };
	}
};
