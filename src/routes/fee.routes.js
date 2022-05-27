import feeController from '../controllers/fee.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const feeRoutes = (app) => {
	app.get('/fees', feeController.findFee)
	app.post('/fees', verifyToken, feeController.save)
}

export default feeRoutes
