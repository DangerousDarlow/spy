import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: 'http://localhost:7245/api/openapi/1.0',
	output: 'src/lib/api/client',
	plugins: ['@tanstack/svelte-query']
});
