import moment from 'moment-timezone'

const toJSDate = (date) => moment(new Date(date))

const common = {
	toJSDate
}

export default common
