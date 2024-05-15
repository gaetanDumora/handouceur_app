import { INPUT_FIELD_ERRORS, TRANSLATED_CODE_ERRORS, type ErrorCodes } from '$lib/constants';
import { loginUser } from '$lib/server/index.js';
import { fail } from '@sveltejs/kit';

type InputErrors = {
	identifier?: { reason: string | undefined };
	candidatePassword?: { reason: string | undefined };
};

const hasReasons = (errors: InputErrors) => {
	return Object.values(errors).some((error) => error.reason);
};

export const actions = {
	login: async ({ request }) => {
		const formData = await request.formData();

		const identifier = formData.get('identifier') as string;
		const candidatePassword = formData.get('candidatePassword') as string;
		const values = { identifier, candidatePassword };

		let errors: InputErrors = {
			identifier: { reason: identifier.length ? undefined : INPUT_FIELD_ERRORS.REQUIRED },
			candidatePassword: {
				reason: candidatePassword.length ? undefined : INPUT_FIELD_ERRORS.REQUIRED
			}
		};

		// Validate user inputs
		if (hasReasons(errors)) {
			return fail(400, { values, errors });
		}

		// Validate user login
		const { success, reason, data } = await loginUser(values);
		if (!success && reason) {
			const key = reason.description === 'identifier' ? 'identifier' : 'candidatePassword';
			errors = { [key]: { reason: TRANSLATED_CODE_ERRORS[reason.code as ErrorCodes] } };
			return fail(400, { values, errors });
		}

		return { success, data };
	}
};
