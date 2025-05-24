import { sql } from 'drizzle-orm'
import { decimal, timestamp, uuid } from 'drizzle-orm/pg-core'

export const id = uuid().primaryKey().notNull().default(sql`gen_random_uuid()`)
export const cost = (name = 'cost') => decimal(name, { precision: 19, scale: 4 }).notNull()
export const createdAt = timestamp().notNull().defaultNow()
export const updatedAt = timestamp().notNull().defaultNow()
