import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import model from '../models'
import authConfig from '../config/auth.config'

const { User, RefreshToken } = model

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

const login = async (req, res) => {
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

			const accessToken = jwt.sign(
				{
					id: user.id,
					email: user.email,
					name: user.name,
					firstName: user.firstName,
					lastName: user.lastName,
					mobile: user.mobile,
					roles: authorities
				},
				authConfig.secret, {
					expiresIn: Number(authConfig.jwtExpiration),
				},
			)

			RefreshToken.createToken(user).then((token) => {
				res.status(200).send({
					status: 200,
					success: true,
					message: 'Login successful',
					data: {
						user: {
							id: user.id,
							email: user.email,
							fullName: user.fullName,
							firstName: user.firstName,
							lastName: user.lastName,
							mobile: user.mobile,
							roles: authorities,
						},
						accessToken,
						refreshToken: token,
					},
				})
			})
		})

	} catch (err) {
		res.status(err.code || 500).send({
			message: err.message,
		})
	}
}

const createUser = async (req, res) => {
	const { email, password, name, mobile, RoleId, PartnerId, status } = req.body

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

		if (name === null) {
			const error = new Error('Name is required.')
			error.code = 403
			throw error
		}

		const firstName = name.split(' ')[0]
		const lastName = name.substring(firstName.length).trim()

		let args = {
			email,
			password: bcrypt.hashSync(password, 11),
			name,
			firstName,
			lastName,
			emailVerified: false,
			mobileVerified: false,
			status
		}

		if (mobile) {
			args.mobile = mobile
		}

		if (PartnerId) {
			args.PartnerId = PartnerId
		}

		await model.sequelize.transaction(async (t) => {
			const user = await User.create(args, { transaction: t })

			await user.setRoles([RoleId], { transaction: t })

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
						roles: authorities
					},
					authConfig.secret, {
						expiresIn: Number(authConfig.jwtExpiration),
					},
				)

				RefreshToken.createToken(user).then((token) => {
					res.status(200).send({
						status: 200,
						success: true,
						message: 'Registration successful',
						data: {
							user: {
								id: user.id,
								email: user.email,
								fullName: user.fullName,
								firstName: user.firstName,
								lastName: user.lastName,
								mobile: user.mobile,
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

export default {
	login,
	createUser,
	refreshToken
}
