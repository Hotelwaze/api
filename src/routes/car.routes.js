import carController from '../controllers/car.controller'
import {isCustomer, verifyToken} from "../middlewares/auth-jwt";

const carRoutes = (app) => {
  app.get('/cars/cars', carController.getCars)
  app.get('/cars/cars-nearby', carController.getCarsNearby)
  app.post('/cars/partners',
    [
      verifyToken
    ], carController.getPartnersCars)
  app.post('/cars/add',
    [
      verifyToken
    ], carController.addPartnersCars)
}

export default carRoutes
