export const TRANSLATED_CODE_ERRORS = {
	// Key are those returned by the backend
	UNIQ_CONSTRAINT: 'The value is already taken',
	INCORRECT_CREDENTIALS: 'Incorrect credential'
} as const;
export type ErrorCodes = keyof typeof TRANSLATED_CODE_ERRORS;

export const INPUT_FIELD_ERRORS = {
	REQUIRED: 'This field is required',
	EMAIL: 'The Email must be a valid address mail',
	USERNAME: 'The Username must be at least 5 characters long',
	PASSWORD:
		'The Password must be at least 8 characters long, containing at least one lowercase letter, one uppercase letter, one number and one special character'
} as const;
