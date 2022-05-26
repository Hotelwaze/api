import partnerController from '../controllers/partner.controller'
import {verifyToken} from '../middlewares/auth-jwt'

const partnerRoutes = (app) => {
	app.get('/partners', partnerController.getPartners)
	app.post('/partners', partnerController.savePartner)
	app.get('/partners/:id/cars', verifyToken, partnerController.getCars)
	app.post('/partners/:id/cars', verifyToken, partnerController.saveCar)
}

export default partnerRoutes
