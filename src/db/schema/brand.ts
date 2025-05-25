import { pgTable, text } from 'drizzle-orm/pg-core'
import { createSchemaFactory } from 'drizzle-zod'

import { createdAt, description, id, name, updatedAt } from '../helpers'

export const brandTable = pgTable('brand', {
	id,
	name,
	description,
	country: text(),
	website: text(),
	createdAt,
	updatedAt,
})

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
	coerce: {
		date: true,
	},
})

export const selectBrandSchema = createSelectSchema(brandTable)

export const insertBrandSchema = createInsertSchema(
	brandTable,
	{
		name: schema => schema.min(1).max(255),
		website: schema => schema.url().nullable().optional(),
	},
).required({
	id: true,
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export const patchBrandSchema = insertBrandSchema.partial()
