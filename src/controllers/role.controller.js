import { Op } from 'sequelize'
import model from '../models'

const { Role, Permission } = model

const getRoles = async (req, res) => {
	try {
		const roles = await Role.findAll({
			attributes: ['id', 'name'],
		})
		res.status(200).send({
			roles
		})
	} catch (err) {
		console.log(err)
	}
}

const createRole = async (req, res) => {
	const { name } = req.body

	try {
		if (!name) {
			const error = new Error('name is not provided')
			error.code = 403
			throw error
		}

		await model.sequelize.transaction(async (t) => {
			const role = await Role.create({
				name
			}, { transaction: t })

			if (!role) {
				const error = new Error('failed to create role')
				error.code = 401
				throw error
			}

			res.status(200).send({
				message: 'role create successful',
				data: {
					role
				},
			})
		})
	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const addPermissions = async (req, res) => {
	const { id: roleId } = req.params
	const { permissions } = req.body

	try {
		if (!permissions) {
			const error = new Error('permissions not provided')
			error.code = 401
			throw error
		}

		const args = []
		permissions.forEach((permission) => {
			args.push({
				name: permission
			})
		})

		await model.sequelize.transaction(async (t) => {
			const availablePermissions = await Permission.findAll({
				where: {
					name: {
						[Op.or]: permissions
					}
				}
			}, { transaction: t })

			if (availablePermissions.length == 0) {
				const error = new Error('permissions not found')
				error.code = 401
				throw error
			}

			const permissionsIds = []
			availablePermissions.forEach((perm) => {
				permissionsIds.push(perm.id)
			})

			const role = await Role.findOne({
				where: {
					id: roleId
				}
			}, { transaction: t })

			if (!role) {
				const error = new Error('role not found')
				error.code = 401
				throw error
			}

			const result = await role.addPermissions(permissionsIds, { transaction: t })

			if (!result) {
				const error = new Error('failed to add permissions to role')
				error.code = 403
				throw error
			}

			res.status(200).send({
				message: 'permissions successfully added to role',
				data: {
					role,
					result
				},
			})
		})
	} catch (e) {
		console.log(e)
		res.status(e.code || 500).send({
			message: e.message,
		})
	}
}

const roleController = {
	getRoles,
	createRole,
	addPermissions
}

export default roleController
