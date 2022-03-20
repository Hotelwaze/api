import optionController from '../controllers/option.controller'

const optionRoutes = (app) => {
	app.get('/options', optionController.findOption)
}

export default optionRoutes
