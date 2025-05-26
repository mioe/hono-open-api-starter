import { z } from '@hono/zod-openapi'
import { pgTable, text } from 'drizzle-orm/pg-core'

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

export const selectBrandSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(255),
	description: z.string().nullable(),
	country: z.string().nullable(),
	website: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})
	.openapi('Brand')

export const insertBrandSchema = z.object({
	name: z.string().min(1).max(255),
	description: z.string().optional().nullable(),
	country: z.string().optional().nullable(),
	website: z.string().url().optional().nullable(),
})
	.openapi('CreateBrand')

export const patchBrandSchema = insertBrandSchema
	.partial()
	.openapi('UpdateBrand')
