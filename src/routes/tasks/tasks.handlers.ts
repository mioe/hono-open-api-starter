import { eq } from 'drizzle-orm'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import type { AppRouteHandler } from '~/lib/types'

import db from '~/db'
import { taskTable } from '~/db/schema/task'
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '~/lib/constants'

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './tasks.routes'

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const tasks = await db.query.taskTable.findMany()
	return c.json(tasks)
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const task = c.req.valid('json')
	const [inserted] = await db.insert(taskTable).values(task).returning()
	return c.json(inserted, HttpStatusCodes.OK)
}

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
	const { id } = c.req.valid('param')
	const task = await db.query.taskTable.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, id)
		},
	})

	if (!task) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		)
	}

	return c.json(task, HttpStatusCodes.OK)
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

	const [task] = await db.update(taskTable)
		.set(updates)
		.where(eq(taskTable.id, id))
		.returning()

	if (!task) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		)
	}

	return c.json(task, HttpStatusCodes.OK)
}

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const { id } = c.req.valid('param')
	const result = await db.delete(taskTable)
		.where(eq(taskTable.id, id))

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
