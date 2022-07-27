import {checkDuplicateEmail} from '../middlewares/verify-sign-up'
import authController from '../controllers/auth.controller'
import {isCustomer, verifyToken} from "../middlewares/auth-jwt";

const authRoutes = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type, Accept',
    )
    next()
  })

  app.post(
    '/auth/create-customer',
    [
      checkDuplicateEmail,
    ],
    authController.createCustomer,
  )

  app.post(
    '/auth/create-partner-user',
    [
      checkDuplicateEmail,
    ],
    authController.createPartnerUser,
  )

  app.post(
    '/auth/create-admin-user',
    [
      checkDuplicateEmail,
    ],
    authController.createAdminUser,
  )

  app.post('/auth/customer-login', authController.customerLogin)

  app.post('/auth/partner-login', authController.partnerLogin)

  app.post('/auth/refresh-token', authController.refreshToken)

  app.post('/auth/request-password-reset', authController.passwordResetRequest)

  app.get('/auth/password-reset-link-check', authController.passwordResetLinkCheck)

  app.post('/auth/password-reset', authController.passwordReset)
  app.post('/auth/save-fcm',
    [
      verifyToken,
      isCustomer,
    ], authController.saveFCM)
}

export default authRoutes
