/* eslint-disable node/no-process-env */
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'node:path'
import { z } from 'zod'

expand(config({
	path: path.resolve(
		process.cwd(),
		process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
	),
}))

const EnvSchema = z.object({
	NODE_ENV: z.string().default('development'),
	PORT: z.coerce.number().default(5173),
	LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
	PG_HOST: z.string().default('localhost'),
	PG_PORT: z.coerce.number().default(54321),
	PG_DB: z.string().default('pg-db'),
	PG_USER: z.string().default('pg-user'),
	PG_PASSWORD: z.string().default('pg-pass'),
	DATABASE_URL: z.string().url(),
	BEARER_TOKEN: z.string().min(10, 'Bearer token must be at least 10 characters long'),
}).superRefine((input, ctx) => {
	if (input.NODE_ENV === 'production') {
		ctx.addIssue({
			code: z.ZodIssueCode.invalid_type,
			expected: 'string',
			received: 'undefined',
			path: ['DATABASE_AUTH_TOKEN'],
			message: 'Must be set when NODE_ENV is \'production\'',
		})
	}
})

export type env = z.infer<typeof EnvSchema>

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env)

if (error) {
	console.error('❌ Invalid env:')
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
	process.exit(1)
}

export default env!
