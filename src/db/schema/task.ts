import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

import { createdAt, id, updatedAt } from '../helpers'

export const taskTable = pgTable('task', {
	id,
	name: text().notNull(),
	done: boolean()
		.default(false),
	createdAt,
	updatedAt,
})

export const selectTasksSchema = createSelectSchema(taskTable)

export const insertTasksSchema = createInsertSchema(
	taskTable,
	{
		name: schema => schema.min(1).max(500),
	},
).required({
	done: true,
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export const patchTasksSchema = insertTasksSchema.partial()
