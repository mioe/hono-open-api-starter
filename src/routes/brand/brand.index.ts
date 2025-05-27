import { createRouter } from '~/lib/create-app'

import * as handler from './brand.handler'
import * as route from './brand.route'

const router = createRouter()
	.openapi(route.list, handler.list)
	.openapi(route.create, handler.create)
	.openapi(route.getOne, handler.getOne)
	.openapi(route.patch, handler.patch)
	.openapi(route.remove, handler.remove)

export default router
