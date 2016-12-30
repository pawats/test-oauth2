const fs = require('fs')

const config = {}

config.params = {
	authorize_url: "https://johndoe.com/v2.0/oauth2/authorize",
	access_token_url: "https://johndoe.com/auth/oauth2/access_token",
	token_info_url: "https://johndoe.com/auth/oauth2/tokeninfo",
	client_id: "myClientId",
	client_secret: "myClientSecret",
	response_type: "code",
	redirect_uri: "https://localhost:8443/redirect",
	product_id: "myProductId",
	realm: "/abc",
	grant_type: "authorization_code"
}

config.ssl_options = {
	key: fs.readFileSync('./localhost.key').toString(),
	cert: fs.readFileSync('./localhost.crt').toString(),
    ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
    honorCipherOrder: true,
    secureProtocol: 'TLSv1_2_method'
}

module.exports = config