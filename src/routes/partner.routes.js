import partnerController from '../controllers/partner.controller'

const partnerRoutes = (app) => {
	app.get('/partners', partnerController.getPartners)
}

export default partnerRoutes
