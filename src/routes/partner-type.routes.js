import partnerTypeController from '../controllers/partner-type.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const partnerTypeRoutes = (app) => {
	app.get('/partner-types', partnerTypeController.get)
	app.post('/partner-types', verifyToken, partnerTypeController.add)
}

export default partnerTypeRoutes
