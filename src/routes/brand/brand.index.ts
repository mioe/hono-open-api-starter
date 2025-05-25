import { createRouter } from '~/lib/create-app'

import * as handler from './brand.handler'
import * as route from './brand.route'

const router = createRouter()
	.openapi(route.list, handler.list)

export default router
