import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

import { selectBrandSchema } from '~/db/schema-bundle'

const tags = ['Brand']

export const list = createRoute({
	path: '/brand',
	method: 'get',
	tags,
	summary: 'Get all brands',
	description: 'Retrieve a list of all brands',
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.array(selectBrandSchema),
			'The list of brands',
		),
	},
})
export type ListRoute = typeof list
