'use strict';

const fs = require('fs');
const path = require('path');
const htmlReporter = require('pa11y-reporter-html');

const OUTPUT_DIR = path.join(process.cwd(), 'reports', 'a11y');

function slugify(url) {
	return url.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

module.exports = {
	beforeAll() {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	},

	async results(results) {
		const html = await htmlReporter.results(results);
		const file = path.join(OUTPUT_DIR, `${slugify(results.pageUrl)}.html`);
		fs.writeFileSync(file, html);
	},

	error(error, url) {
		const file = path.join(OUTPUT_DIR, `${slugify(url)}.html`);
		fs.writeFileSync(
			file,
			`<!doctype html><meta charset="utf-8"><title>pa11y error</title>` +
			`<h1>Error analizando ${url}</h1><pre>${error.stack || error.message}</pre>`
		);
	}
};
