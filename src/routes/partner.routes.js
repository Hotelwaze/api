import partnerController from '../controllers/partner.controller'
import {verifyToken} from "../middlewares/auth-jwt";

const partnerRoutes = (app) => {
	app.get('/partners', partnerController.getPartners);
	app.post('/partner-info',
		[
			verifyToken
		], partnerController.getPartnerInfo);

	app.post('/partner-info-admin',
		[
			verifyToken
		], partnerController.getPartnerInfoAdmin);

	app.post('/partner-update',
		[
			verifyToken
		], partnerController.updatePartner);

	app.post('/partner-update-admin',
		[
			verifyToken
		], partnerController.updatePartnerAdmin);

	app.post('/partner-add',
		[
			verifyToken
		], partnerController.addPartner);

	app.post('/partner-location',
		[
			verifyToken
		], partnerController.updatePartner);

	app.post('/partner-update-location',
		[
			verifyToken
		], partnerController.updatePartnerPlace);

	app.post('/partner-update-location-admin',
		[
			verifyToken
		], partnerController.updatePartnerPlaceAdmin);

	app.post('/partner-list',
		[
			verifyToken
		], partnerController.getPartnerList);
}

export default partnerRoutes
