import { eq } from 'drizzle-orm'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppRouteHandler } from '~/lib/types'

import db from '~/db'
import { brandTable } from '~/db/schema/brand'
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '~/lib/constants'

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './brand.route'

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const brands = await db.query.brandTable.findMany()
	return c.json(brands)
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const brand = c.req.valid('json')
	const [inserted] = await db.insert(brandTable).values(brand).returning()
	return c.json(inserted, HttpStatusCodes.CREATED)
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
	const { id } = c.req.valid('param')
	const brand = await db.query.brandTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, id)
		},
	})

	if (!brand) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		)
	}

	return c.json(brand, HttpStatusCodes.OK)
}

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
	const { id } = c.req.valid('param')
	const updates = c.req.valid('json')

	if (Object.keys(updates).length === 0) {
		return c.json(
			{
				success: false,
				error: {
					issues: [
						{
							code: ZOD_ERROR_CODES.INVALID_UPDATES,
							path: [],
							message: ZOD_ERROR_MESSAGES.NO_UPDATES,
						},
					],
					name: 'ZodError',
				},
			},
			HttpStatusCodes.UNPROCESSABLE_ENTITY,
		)
	}

	const [brand] = await db.update(brandTable)
		.set(updates)
		.where(eq(brandTable.id, id))
		.returning()

	if (!brand) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		)
	}

	return c.json(brand, HttpStatusCodes.OK)
}

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const { id } = c.req.valid('param')
	const result = await db.delete(brandTable)
		.where(eq(brandTable.id, id))

	if (result.count === 0) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		)
	}

	return c.body(null, HttpStatusCodes.NO_CONTENT)
}
