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

const { User, RefreshToken, Role } = model

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
			return res.status(403).json({ message: `User with email ${email} does not exist.` })
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

		if (user) {
			const roles = await user.getRoles()

			if (roles) {
				const authorities = []
				for (let i = 0; i < roles.length; i += 1) {
					authorities.push(roles[i].name)
				}

				const perms = []
				const currentRole = await Role.findOne({
					where: {
						id: roles[0].id
					}
				})

				const permissions = await currentRole.getPermissions()
				for (let i = 0; i < permissions.length; i += 1) {
					perms.push(permissions[i].name)
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
						roles: authorities,
						permissions: perms
					},
					authConfig.secret, {
						expiresIn: Number(authConfig.jwtExpiration),
					},
				)

				return res.status(200).json({
					user: accessToken,
					refreshToken: token.token,
				})
			}
		}

	} catch (err) {
		console.log(err)
		return res.status(500).send({ message: err })
	}
}

const login = async (req, res) => {
	const { email, password } = req.body

	try {
		if (!email) {
			const error = new Error('email is not provided')
			error.code = 403
			throw error
		}

		if (!password) {
			const error = new Error('password is not provided')
			error.code = 403
			throw error
		}

		const user = await User.findOne({
			where: {
				email,
			},
		})

		if (!user) {
			const error = new Error('user not found')
			error.code = 403
			throw error
		}

		const passwordIsValid = bcrypt.compareSync(
			password,
			user.password,
		)

		if (!passwordIsValid) {
			const error = new Error('password is invalid')
			error.code = 403
			throw error
		}

		const roles = await user.getRoles()
		if (roles) {
			const authorities = []
			for (let i = 0; i < roles.length; i += 1) {
				authorities.push(roles[i].name)
			}

			const perms = []
			const currentRole = await Role.findOne({
				where: {
					id: roles[0].id
				}
			})

			const permissions = await currentRole.getPermissions()
			for (let i = 0; i < permissions.length; i += 1) {
				perms.push(permissions[i].name)
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
					roles: authorities,
					permissions: perms
				},
				authConfig.secret, {
					expiresIn: Number(authConfig.jwtExpiration),
				},
			)

			const refreshToken = RefreshToken.createToken(user)

			if (refreshToken) {
				res.status(200).send({
					message: 'Login successful',
					data: {
						user: accessToken,
						refreshToken: refreshToken,
					},
				})
			}
		}
	} catch (err) {
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
	login
}
