import axios from 'axios'
import { base64encode } from 'nodejs-base64'

const getApiUrl = () => process.env.PAYMONGO_API_URL

const prepareCreateHeader = () => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: `Basic ${base64encode(process.env.PAYMONGO_SECRET_KEY)}`,
})

const create = (resource, args) => {
	console.log(`${getApiUrl()}/${resource}`);
	try {
		return axios.post(`${getApiUrl()}/${resource}`, args, { headers: prepareCreateHeader() })
	}catch (e){
		console.log(e,"DALAWA")
		console.log(e.message)
		return ;
	}

}

const paymongoService = {
	create,
}

export default paymongoService
