import partnerController from '../controllers/partner.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const partnerRoutes = (app) => {
	app.get('/partners', partnerController.getPartners)
	app.get(
		'/partners/:id/cars',
		[verifyToken],
		partnerController.getPartnerCars
	)
}

export default partnerRoutes
