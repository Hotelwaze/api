import common from '../helpers/common'
import model from '../models'

const { User, Role } = model

const create = async (req, res) => {
	const { name, email, password, mobile, partnerId, role } = req.body
	try {
		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		if (!email || !common.isValidEmail(email)) {
			const error = new Error('email is not valid')
			error.code = 403
			throw error
		}

		if (!password) {
			const error = new Error('provided is not provided')
			error.code = 403
			throw error
		}

		if (!role) {
			const error = new Error('role is not provided')
			error.code = 403
			throw error
		}

		const fetchedRole = await Role.findOne({
			where: {
				name: role
			}
		})

		if (!fetchedRole) {
			const error = new Error('role does not exist')
			error.code = 403
			throw error
		}

		const [firstName, lastName] = name.split(' ')

		const args = {
			name,
			firstName,
			lastName,
			email,
			password
		}

		if (mobile) {
			args.mobile = mobile
		}

		if (partnerId) {
			args.PartnerId = partnerId
		}

		await model.sequelize.transaction(async (t) => {
			const user = await User.create(args, { transaction: t })

			if (user) {
				await user.setRoles([fetchedRole.id], { transaction: t })
				const roles = await user.getRoles({ transaction: t })

				if (roles.length == 0) {
					const error = new Error('no roles found')
					error.code = 403
					throw error
				}

				const authorities = []
				for (let i = 0; i < roles.length; i += 1) {
					authorities.push(roles[i].name)
				}

				res.status(200).send({
					message: 'user create successful',
					data: {
						user: {
							id: user.id,
							email: user.email,
							name: user.name,
							firstName: user.firstName,
							lastName: user.lastName,
							roles: authorities,
						}
					},
				})
			}
		})

	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

export default {
	create
}
