import model from '../models'

const { User, Role } = model

export const checkDuplicateEmail = (req, res, next) => {
	User.findOne({
		where: {
			email: req.body.email,
		},
	})
		.then((user) => {
			if (user) {
				res.status(400).json({
					message: 'Email is already in use!',
				})
			}
			next()
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message,
			})
		})
}

export const checkRolesExisted = (req, res, next) => {
	if (req.body.roles) {
		Role.findAll()
			.then((roles) => {
				const roleNames = roles.map((role) => role.name)
				for (let i = 0; i < req.body.roles.length; i += 1) {
					if (!roleNames.includes(req.body.roles[i])) {
						res.status(400).json({
							success: false,
							message: `Failed! Role does not exist = ${req.body.roles[i]}`,
						})
						return
					}
				}
				next()
			})
			.catch((err) => {
				res.status(500).send({
					message: err.message
				})
			})
	}
}