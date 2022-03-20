import addressController from '../controllers/address.controller'

const addressRoutes = (app) => {
	app.get('/addresses', addressController.getAddresses)
}

export default addressRoutes
