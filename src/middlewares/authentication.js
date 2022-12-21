const jwt = require("jsonwebtoken");
const {models} = require("../database/sequelize");
const encryption = require("../tools/encryption");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.status(401).json({message: "No token provided"});
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (error, decodedToken) => {
        // If error, return 401
        if(error) return res.status(401).json({message: "Invalid token"});
        // Get user id from decoded token
        const userId = decodedToken.userId;
        // Find user in database
        models.User.findOne({where: {id: userId}}).then(user => {
            // Set user in request
            user = user.toJSON();
            delete user.password;
            req.user = user;
            // Get user permissions and set them in request
            models.Group.findOne({where: {id: user.groupId}}).then(group => {
                req.permissions = group.permissions;
                return next();
            });
        });
    });
}
