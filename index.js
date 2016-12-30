// http://stackoverflow.com/questions/8169999/how-can-i-create-a-self-signed-cert-for-localhost
// create cert: openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
// add cert to keychain: open localhost.crt

const config = require('./config.js');
const params = config.params;
const ssl_options = config.ssl_options
const request = require('request')
const express = require('express')  
const session = require('express-session')
const https = require('https')
const app = express()  
const port = 8443

app.use(session({
	secret: '@uth0r1z@t10n',
	name: 'app.session'
}))

//Link to Login on TR ID
app.get('/', (request, response) => {  
	store.all(function(error, sessions){
		console.log()
	})
	request.session.test = 'bababa'
	console.log(request.session)
	let url = generateAuthorizeUrl(params);
	response.send(`<a href="${url}">Login</a> <p> ${url} </p>`)
})


//Redirect from TR ID after user authenticates
app.get('/AddinServices/module/auth/registerUser', (request, response) => {
	// console.log(request.query)
	getToken(params, request.query.code, function(access_token_object){
		getTokenInfo(params, access_token_object['access_token'], function(token_info_object){
			let combined_data = {};
			combined_data['access_token_data'] = access_token_object
			combined_data['token_info_object'] = token_info_object
			response.send(combined_data)
		})
	})
	
})


//Start server
https.createServer(ssl_options, app).listen(port, (err) => {
	if(err){
	    return console.log('something bad happened', err)
	}
	console.log(`server is listening on ${port}`)
});



function generateAuthorizeUrl(params){
	return params['authorize_url'] + "?" + 
	"client_id=" + params['client_id'] + 
	"&response_type=" + params['response_type'] + 
	"&redirect_uri=" + params['redirect_uri'] + 
	"&product_id=" + params['product_id'];
}


function getToken(params, code, cb){
	// http://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
	let auth = new Buffer(params['client_id'] + ":" + params['client_secret']).toString('base64');

	let req = {
		method: "POST",
		url: params['access_token_url'],
		headers: {
			'Authorization': "Basic " + auth,
			'Content-Type': "application/x-www-form-urlencoded"
		},
		form: {
			realm: params['realm'],
			grant_type: params['grant_type'],
			redirect_uri: params['redirect_uri'],
			code: code
		} 
	}

	// console.log(req)

	request(req, function(err, httpResponse, body){
		if(err){
			console.log(err)
		}
		cb(eval("(" + body + ")"))
	})

}

function getTokenInfo(params, access_token, cb){
	let req = {
		method: "GET",
		url: params['token_info_url'],
		qs: {
			access_token: access_token
		}
	}

	request(req, function(err, httpResponse, body){
		if(err){
			console.log(err)
		}

		console.log(body)

		cb(eval("(" + body + ")"))
	})
}
