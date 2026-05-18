import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const isProduction =
	process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

const defaultApiUrl =
	isProduction
		? 'https://back-wonder.vercel.app'
		: 'http://localhost:3000';

const apiUrl = process.env.NG_APP_API_URL || defaultApiUrl;
const outputPath = resolve(process.cwd(), 'public', 'env.js');

const content = `window.__env = { API_URL: '${apiUrl}' };\n`;
writeFileSync(outputPath, content, 'utf8');

console.log(`[front-wonder] env.js generated with API_URL=${apiUrl}`);
