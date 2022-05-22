import partnerController from '../controllers/partner.controller'
import {isPartner, verifyToken} from '../middlewares/auth-jwt'

const partnerRoutes = (app) => {
	app.get('/partners', partnerController.getPartners)
	app.get(
		'/partners/:id/cars',
		[
			verifyToken, isPartner
		],
		partnerController.getPartnerCars
	)
}

export default partnerRoutes
