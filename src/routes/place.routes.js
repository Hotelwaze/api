import placeController from '../controllers/place.controller'

const placeRoutes = (app) => {
	app.get('/places', placeController.getPlaces)
}

export default placeRoutes
