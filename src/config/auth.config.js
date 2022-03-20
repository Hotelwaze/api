const dotenv = require('dotenv')

dotenv.config()

const authConfig = {
	secret: process.env.JWT_SECRET,
	jwtExpiration: process.env.JWT_EXPIRATION,
	jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
}

export default authConfig
