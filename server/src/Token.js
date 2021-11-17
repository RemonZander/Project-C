const crypto = require('crypto');

class Token {
    createJWT(payload) {
        const encodedHeader = Buffer.from(JSON.stringify({ alg: "HS256" })).toString('base64');

        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');

        const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
        hmac.update(`${encodedHeader}.${encodedPayload}`);

        return `${encodedHeader}.${encodedPayload}.${hmac.digest('base64')}`;
    }

    verifyJWT(token) {
        const tokenParts = token.split('.');

        const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
        hmac.update(`${tokenParts[0]}.${tokenParts[1]}`);

        return tokenParts[2] === hmac.digest('base64').replace('=', '');
    }
}

module.exports = Token;