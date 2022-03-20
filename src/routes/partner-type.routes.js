import partnerTypeController from '../controllers/partner-type.controller'

const partnerTypeRoutes = (app) => {
	app.get('/partner-types', partnerTypeController.getPartnerTypes)
}

export default partnerTypeRoutes
