const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);

const encrypt = async (password) => {
    return await bcrypt.hash(password, 10);
}

const compare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

const encodeToken = (userId) => {
    return jwt.sign(
        {userId},
        process.env.PRIVATE_KEY,
        {expiresIn: process.env.TOKEN_EXPIRATION}
    );
}

module.exports = {
    encrypt, compare, encodeToken
}
