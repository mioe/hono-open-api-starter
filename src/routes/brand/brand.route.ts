import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers'
import { createErrorSchema } from 'stoker/openapi/schemas'

import { insertBrandSchema, patchBrandSchema, selectBrandSchema } from '~/db/schema-bundle'
import { IdParamsSchema, notFoundSchema } from '~/lib/constants'

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

export const create = createRoute({
	path: '/brand',
	method: 'post',
	tags,
	summary: 'Create a brand',
	description: 'Create a new brand',
	request: {
		body: jsonContentRequired(
			insertBrandSchema,
			'The brand to create',
		),
	},
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			selectBrandSchema,
			'The created brand',
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(insertBrandSchema),
			'The validation error(s)',
		),
	},
})

export const getOne = createRoute({
	path: '/brand/{id}',
	method: 'get',
	tags,
	summary: 'Get a brand by ID',
	description: 'Retrieve a single brand by its ID',
	request: {
		params: IdParamsSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectBrandSchema,
			'The requested brand',
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			notFoundSchema,
			'Brand not found',
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			'Invalid id error',
		),
	},
})

export const patch = createRoute({
	path: '/brand/{id}',
	method: 'patch',
	tags,
	summary: 'Update a brand',
	description: 'Update an existing brand',
	request: {
		params: IdParamsSchema,
		body: jsonContentRequired(
			patchBrandSchema,
			'The brand updates',
		),
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			selectBrandSchema,
			'The updated brand',
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			notFoundSchema,
			'Brand not found',
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(patchBrandSchema)
				.or(createErrorSchema(IdParamsSchema)),
			'The validation error(s)',
		),
	},
})

export const remove = createRoute({
	path: '/brand/{id}',
	method: 'delete',
	tags,
	summary: 'Delete a brand',
	description: 'Delete a brand by ID',
	request: {
		params: IdParamsSchema,
	},
	responses: {
		[HttpStatusCodes.NO_CONTENT]: {
			description: 'Brand deleted',
		},
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			notFoundSchema,
			'Brand not found',
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			'Invalid id error',
		),
	},
})

export type ListRoute = typeof list
export type CreateRoute = typeof create
export type GetOneRoute = typeof getOne
export type PatchRoute = typeof patch
export type RemoveRoute = typeof remove
