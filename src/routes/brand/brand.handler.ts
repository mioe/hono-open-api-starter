import type { AppRouteHandler } from '~/lib/types'

import db from '~/db'

import type { ListRoute } from './brand.route'

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const tasks = await db.query.brandTable.findMany()
	return c.json(tasks)
}
