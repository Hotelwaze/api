import jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import authConfig from '../config/auth.config'
import model from '../models'

const { User } = model

export const verifyToken = async (req, res, next) => {
	const bearerHeader = req.headers['authorization'] || req?.query?.token;
	console.log(req.query.token);
	let bearerToken = ''

	try {
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ')
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

	jwt.verify(bearerToken, authConfig.secret, (err, decoded) => {
		if (err) {
			res.status(500).send({
				message: err.message,
			})
		}

		req.userId = decoded?.user?.id
		next()
	})
}

export const isAdmin = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				id: req.userId,
			},
		})

		if (user) {
			const roles = await user.getRoles()
			roles.map((role) => role.id)

			const roleExists = _.find(roles, (role) => role.name = 'admin')
			if (roleExists === undefined) {
				const error = new Error('Requires an admin role.')
				error.code = 404
				error.success = false
				throw error
			}

			next()
		}
	} catch (error) {
		return res.status(error.code || 500).send({
			success: error.success,
			message: error.message,
		})
	}
}

export const isCustomer = async (req, res, next) => {
	try {

		const bearerHeader = req.headers['authorization']
		let bearerToken = ''

		try {
			if (typeof bearerHeader !== 'undefined') {
				const bearer = bearerHeader.split(' ')
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

		jwt.verify(bearerToken, authConfig.secret, async (err, decoded) => {
			if (err) {
				res.status(500).send({
					message: err.message,
				})
			}

			req.userId = decoded?.id

			const user = await User.findOne({
				where: {
					id: decoded?.id,
				},
			})

			if (user) {
				const roles = await user.getRoles()
				roles.map((role) => role.id)

				const roleExists = _.find(roles, (role) => role.name = 'customer')
				if (roleExists === undefined) {
					const error = new Error('Requires a customer role.')
					error.code = 404
					error.success = false
					throw error
				}

				next()
			}
		})


	} catch (error) {
		console.log(error)
		return res.status(error.code || 500).send({
			success: error.success,
			message: error.message,
		})
	}
}
