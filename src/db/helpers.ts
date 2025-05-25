import { sql } from 'drizzle-orm'
import { decimal, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const id = uuid().primaryKey().notNull().default(sql`gen_random_uuid()`)
export const name = varchar({ length: 255 }).notNull()
export const description = text()
export const cost = decimal({ precision: 19, scale: 4 }).notNull()
export const createdAt = timestamp().notNull().defaultNow()
export const updatedAt = timestamp().notNull().defaultNow()
