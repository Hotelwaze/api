import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.config'

export const verifyToken = async (req, res, next) => {
	const bearerHeader = req.headers['authorization']
	let bearerToken = ''

	try {
		if (typeof bearerHeader !== 'undefined') {
			const bearer = await bearerHeader.split(' ')
			bearerToken = bearer[1]
		} else {
			const error = new Error('No token provided!')
			error.code = 403
			throw error
		}
	} catch (error) {
		res.status(error.code || 500).send({
			message: error.message,
		})
	}

	await jwt.verify(bearerToken, authConfig.secret, (err, decoded) => {
		if (err) {
			res.status(500).send({
				message: err.message,
			})
		}
		req.user = decoded
		next()
	})
}
