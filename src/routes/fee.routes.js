import feeController from '../controllers/fee.controller'

const feeRoutes = (app) => {
	app.get('/fee', feeController.findFee)
}

export default feeRoutes
