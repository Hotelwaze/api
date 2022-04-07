import listenerController from '../controllers/listener.controller'

const listenerRoutes = (app) => {
	app.post('/listeners/paymongo', listenerController.payMongo)
}

export default listenerRoutes
