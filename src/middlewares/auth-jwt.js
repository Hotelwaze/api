import jwt from 'jsonwebtoken'
import * as _ from 'lodash'
import authConfig from '../config/auth.config'
import model from '../models'

const { User } = model

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
		console.log(decoded.user.id)
		req.userId = decoded.user.id
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
				const error = new Error('unauthorized')
				error.code = 401
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

export const isPartner = async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				id: req.userId,
			},
		})

		if (user) {
			const roles = await user.getRoles()
			roles.map((role) => role.id)

			const roleExists = _.find(roles, (role) => role.name = 'partner_admin')
			if (roleExists === undefined) {
				const error = new Error('unauthorized')
				error.code = 401
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
		const user = await User.findOne({
			where: {
				id: req.userId,
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
	} catch (error) {
		return res.status(error.code || 500).send({
			success: error.success,
			message: error.message,
		})
	}
}
