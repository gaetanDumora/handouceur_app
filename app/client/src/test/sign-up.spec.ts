import { expect, test } from 'vitest';

test('regex password', () => {
	const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
	const password = 'Azerty123.';
	expect(regex.test(password)).toBe(true);
});
