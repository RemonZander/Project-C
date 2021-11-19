const crypto = require('crypto');

class Token {
    _encodeObjectToJson(object) {
        try {
            const jsonString = JSON.stringify(object);

            return Buffer.from(jsonString).toString('base64').replaceAll('=', '')
        } catch (error) {
            throw error;
        }
    }

    _createSignature(alg, encodedHeader, encodedPayload) {
        if (alg === "HS256") {
            const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY);
            hmac.update(`${encodedHeader}.${encodedPayload}`);

            return hmac.digest('base64').replaceAll('=', '');
        }

        throw Error("No valid algorithm specified");
    }

    createJWT(payload) {
        const encodedHeader = this._encodeObjectToJson({alg: "HS256"});

        const encodedPayload = this._encodeObjectToJson(payload);

        const signature = this._createSignature("HS256", encodedHeader, encodedPayload);

        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    verifyJWT(token) {
        const tokenParts = token.split('.');

        const signature = this._createSignature("HS256", tokenParts[0], tokenParts[1]);

        return tokenParts[2] === signature;
    }
}

module.exports = Token;