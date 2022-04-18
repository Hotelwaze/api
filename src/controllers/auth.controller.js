import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import model from '../models'
import authConfig from '../config/auth.config'
import mailer from '../services/mail.service'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { Op } from 'sequelize'

const { User, RefreshToken } = model

const passwordReset = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				email: req.body.email,
				resetPasswordToken: req.body.token,
				resetPasswordExpires: {
					[Op.gt]: Date.now()
				}
			}
		})

		if (user !== null) {
			user.update({
				password: bcrypt.hashSync(req.body.password, 11),
				resetPasswordToken: null,
				resetPasswordExpires: null,
			})
			user.save()

			res.status(200).send({
				message: 'Password change successful. You may now login using your new password.',
			})
		} else {
			const error = new Error('Password reset link is invalid or has expired.')
			error.code = 403
			throw error
		}
	} catch (err) {
		res.status(err.code || 500).send({
			message: err.message,
		})	
	}
}
const passwordResetLinkCheck = async (req, res) => {
	try {
		const user = await User.findOne({
			where: {
				resetPasswordToken: req.query.token,
				resetPasswordExpires: {
					[Op.gt]: Date.now()
				}
			}
		})

		if (user === null) {
			return res.status(403).json({ message: 'Password reset link is invalid or has expired' })
		} else {
			res.status(200).send({
				message: 'Password reset link is valid.',
				userEmail: user.email
			})
		}
	} catch (err) {
		res.status(err.code || 500).send({
			message: err.message,
		})	
	}
}

const passwordResetRequest = async (req, res) => {
	const { email } = req.body
	if (email === '') {
		return res.status(403).json({ message: 'Email is required!' })
	}

	try {
		const user = await User.findOne({
			where: {
				email
			}
		})
	
		if (user === null) {
			return res.status(403).json({ message: `User with email ${email} does not exists.` })
		} else {
			const token = crypto.randomBytes(20).toString('hex')
			user.update({
				resetPasswordToken: token,
				resetPasswordExpires: Date.now() + 3600000
			})
			user.save()
	
			const templateSource = fs.readFileSync(path.join(__dirname, '../../public/email/templates/password-reset-request.hbs'), 'utf8')
			const template = handlebars.compile(templateSource)
			const htmlToSend = template({
				token,
			})
			mailer(
				'Password Reset Request',
				htmlToSend,
				user.email
			)
			res.status(200).send({
				message: 'Password request email sent.',
			})
		}
	} catch (err) {
		res.status(err.code || 500).send({
			message: err.message,
		})	
	}
}

const refreshToken = async (req, res) => {
	const { refreshToken: requestToken } = req.body

	if (requestToken == null) {
		return res.status(403).json({ message: 'Refresh Token is required!' })
	}

	try {
		const token = await RefreshToken.findOne({ where: { token: requestToken } })

		if (!token) {
			res.status(403).json({ message: 'Refresh token is not in database!' })
		}

		if (RefreshToken.verifyExpiration(token)) {
			await token.destroy({ where: { id: token.id } })

			res.status(403).json({
				message: 'Refresh token was expired. Please make a new signin request',
			})
		}

		const user = await token.getUser()

		user.getRoles().then((roles) => {
			const authorities = []
			for (let i = 0; i < roles.length; i += 1) {
				authorities.push(roles[i].name)
			}

			const accessToken = jwt.sign(
				{
					id: user.id,
					email: user.email,
					name: user.name,
					firstName: user.firstName,
					lastName: user.lastName,
					mobile: user.mobile,
					PartnerId: user.PartnerId,
					roles: authorities
				},
				authConfig.secret, {
					expiresIn: Number(authConfig.jwtExpiration),
				},
			)

			return res.status(200).json({
				accessToken: accessToken,
				refreshToken: token.token,
			})
		})
	} catch (err) {
		console.log(err)
		return res.status(500).send({ message: err })
	}
}

const customerLogin = async (req, res) => {
	const { email, password } = req.body

	try {
		if (email === null) {
			const error = new Error('Email is required.')
			error.code = 403
			throw error
		}

		if (password === null) {
			const error = new Error('Password is required.')
			error.code = 403
			throw error
		}

		const user = await User.findOne({
			where: {
				email,
			},
		})

		if (!user) {
			const error = new Error('Your email and/or password is incorrect.')
			error.code = 403
			throw error
		}

		const passwordIsValid = bcrypt.compareSync(
			password,
			user.password,
		)

		if (!passwordIsValid) {
			const error = new Error('Your email and/or password is incorrect.')
			error.code = 403
			throw error
		}

		user.getRoles().then((roles) => {
			const authorities = []
			for (let i = 0; i < roles.length; i += 1) {
				authorities.push(roles[i].name)
			}
			
			if (!authorities.includes('customer')) {
				const error = new Error('Different account type. Access is not allowed.')
				error.code = 403
				throw error
			}

			const accessToken = jwt.sign(
				{
					id: user.id,
					email: user.email,
					name: user.name,
					firstName: user.firstName,
					lastName: user.lastName,
					mobile: user.mobile,
					PartnerId: user.PartnerId,
					roles: authorities
				},
				authConfig.secret, {
					expiresIn: Number(authConfig.jwtExpiration),
				},
			)

			RefreshToken.createToken(user).then((token) => {
				res.status(200).send({
					message: 'Login successful',
					data: {
						user: {
							id: user.id,
							email: user.email,
							name: user.fullName,
							firstName: user.firstName,
							lastName: user.lastName,
							mobile: user.mobile,
							PartnerId: user.PartnerId,
							roles: authorities,
						},
						accessToken,
						refreshToken: token,
					},
				})
			})
		})
			.catch ((err) => {
				res.status(err.code || 500).send({
					message: err.message,
				})
			})

	} catch (err) {
		res.status(err.code || 500).send({
			message: err.message,
		})
	}
}

const createCustomer = async (req, res) => {
	const { email, password, name } = req.body

	try {
		if (email === null || email === '') {
			const error = new Error('Email is required.')
			error.code = 403
			throw error
		}

		if (password === null || password === '') {
			const error = new Error('Password is required.')
			error.code = 403
			throw error
		}

		if (name === null || name === '') {
			const error = new Error('Name is required.')
			error.code = 403
			throw error
		}

		let args = {
			email,
			password: bcrypt.hashSync(password, 11),
			name,
			status: 'active'
		}

		await model.sequelize.transaction(async (t) => {
			const user = await User.create(args, { transaction: t })

			await user.setRoles([3], { transaction: t })

			user.getRoles().then((roles) => {
				const authorities = []
				for (let i = 0; i < roles.length; i += 1) {
					authorities.push(roles[i].name)
				}

				const accessToken = jwt.sign(
					{
						id: user.id,
						email: user.email,
						name: user.name,
						roles: authorities
					},
					authConfig.secret, {
						expiresIn: Number(authConfig.jwtExpiration),
					},
				)

				RefreshToken.createToken(user).then((token) => {
					const templateSource = fs.readFileSync(path.join(__dirname, '../../public/email/templates/new-user-welcome.hbs'), 'utf8')
					const template = handlebars.compile(templateSource)
					const htmlToSend = template({
						name: user.name,
					})
					mailer(
						'Welcome to Hotelwaze',
						htmlToSend,
						user.email
					)
					res.status(200).send({
						message: 'Registration successful',
						data: {
							user: {
								id: user.id,
								email: user.email,
								name: user.fullName,
								roles: authorities,
							},
							accessToken,
							refreshToken: token,
						},
					})
				})
			})
				.catch((err) => {
					console.log(err)
					res.status(err.code || 500).send({
						message: err.message,
					})		
				})
		})
	} catch (err) {
		console.log(err)
		res.status(err.code || 500).send({
			message: err.message,
		})
	}
}

const createAdminUser = async (req, res) => {
	const { email, password, name,  } = req.body

	try {
		if (email === null || email === '') {
			const error = new Error('Email is required.')
			error.code = 403
			throw error
		}

		if (password === null || password === '') {
			const error = new Error('Password is required.')
			error.code = 403
			throw error
		}

		if (name === null || name === '') {
			const error = new Error('Name is required.')
			error.code = 403
			throw error
		}

		let args = {
			email,
			password: bcrypt.hashSync(password, 11),
			name,
			status: 'active'
		}

		await model.sequelize.transaction(async (t) => {
			const user = await User.create(args, { transaction: t })

			await user.setRoles([3], { transaction: t })

			user.getRoles().then((roles) => {
				const authorities = []
				for (let i = 0; i < roles.length; i += 1) {
					authorities.push(roles[i].name)
				}

				const accessToken = jwt.sign(
					{
						id: user.id,
						email: user.email,
						name: user.name,
						roles: authorities
					},
					authConfig.secret, {
						expiresIn: Number(authConfig.jwtExpiration),
					},
				)

				RefreshToken.createToken(user).then((token) => {
					res.status(200).send({
						message: 'Registration successful',
						data: {
							user: {
								id: user.id,
								email: user.email,
								name: user.fullName,
								roles: authorities,
							},
							accessToken,
							refreshToken: token,
						},
					})
				})
			})
		})
	} catch (err) {
		console.log(err)
		res.status(err.code || 500).send({
			message: err.message,
		})
	}
}

const createPartnerUser = async (req, res) => {
	const { email, password, name, PartnerId, rolesList } = req.body

	try {
		if (email === null || email === '') {
			const error = new Error('Email is required.')
			error.code = 403
			throw error
		}

		if (password === null || password === '') {
			const error = new Error('Password is required.')
			error.code = 403
			throw error
		}

		if (name === null || name === '') {
			const error = new Error('Name is required.')
			error.code = 403
			throw error
		}

		if (PartnerId === null || PartnerId === '') {
			const error = new Error('Name is required.')
			error.code = 403
			throw error
		}

		if (rolesList === null || rolesList === '' || rolesList.length === 0) {
			const error = new Error('Role is required.')
			error.code = 403
			throw error
		}

		let args = {
			email,
			password: bcrypt.hashSync(password, 11),
			name,
			status: 'active'
		}

		await model.sequelize.transaction(async (t) => {
			const user = await User.create(args, { transaction: t })

			await user.setRoles(rolesList, { transaction: t })

			user.getRoles().then((roles) => {
				const authorities = []
				for (let i = 0; i < roles.length; i += 1) {
					authorities.push(roles[i].name)
				}
				
				res.status(200).send({
					message: 'New user was sucessfully added.',
				})
			})
		})
	} catch (err) {
		console.log(err)
		res.status(err.code || 500).send({
			message: err.message,
		})
	}
}

export default {
	passwordReset,
	passwordResetLinkCheck,
	passwordResetRequest,
	refreshToken,
	customerLogin,
	createCustomer,
	createAdminUser,
	createPartnerUser,
}