import moment from 'moment-timezone'
import validator from 'email-validator'
import model from '../models'

const { Role } = model

const toJSDate = (date) => moment(new Date(date))

const isValidEmail = (email) => {
	return validator.validate(email)
}

const checkPermissions = async (roleName, permNames) => {
	try {
		const role = await Role.findOne({
			where: {
				name: roleName
			}
		})

		if (role) {
			const rolePermissions = await role.getPermissions()
			const permissions = []
			for (let i = 0; i < rolePermissions.length; i += 1) {
				permissions.push(rolePermissions[i].name)
			}

			return permissions.includes(permNames.toString())
		}
	} catch (e) {
		console.log(e)
		return false
	}
}

const checkRole = (roles, role) => {
	return roles.includes(role)
}

const common = {
	toJSDate,
	isValidEmail,
	checkPermissions,
	checkRole
}

export default common
