import moment from 'moment-timezone'
import validator from 'email-validator'

const toJSDate = (date) => moment(new Date(date))

const isValidEmail = (email) => {
	return validator.validate(email)
}

const common = {
	toJSDate,
	isValidEmail
}

export default common
