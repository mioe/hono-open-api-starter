import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { cost, createdAt, id, name, updatedAt } from '../helpers'
import { brandTable } from './brand'

export const productTable = pgTable('product', {
	id,
	name,
	brandId: uuid().notNull().references(() => brandTable.id),
	description: text().notNull(),
	cost,
	createdAt,
	updatedAt,
})
