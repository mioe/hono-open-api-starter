import { Scalar } from '@scalar/hono-api-reference'

import type { AppOpenAPI } from './types'

import packageJSON from '../../package.json' with { type: 'json' }

export default function configureOpenAPI(app: AppOpenAPI) {
	app.doc('/doc', {
		openapi: '3.0.0',
		info: {
			version: packageJSON.version,
			title: 'HONO YELLOW API',
		},
	})

	app.get(
		'/ref',
		Scalar({
			defaultHttpClient: {
				targetKey: 'shell',
				clientKey: 'curl',
			},
			url: '/doc',
		}),
	)
}
