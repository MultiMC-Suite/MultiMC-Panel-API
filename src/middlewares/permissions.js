const auth = require("./authentication");
const {hasPermission, hasTuplePermissions} = require("../tools/permissionsManager");

module.exports = (tuple, requiredPermissions) => {
    return (req, res, next) => {
        auth(req, res, () => {
            const userPermissions = req.permissions
            if (!userPermissions)
                return res.status(400).json({
                    message: `User's permissions missing.`
                })

            if (userPermissions.length === 1 && userPermissions[0] === `*`)
                return next()

            if (!tuple && !hasPermission(userPermissions, requiredPermissions))
            return res.status(401).json({
                message: `You don't have the required permission to use this route.`
            })

            if (tuple && !hasTuplePermissions(userPermissions, requiredPermissions)) {
                return res.status(401).json({
                    message: `You don't have the required permission to use this route.`
                })
            }

            next()
        });
    }
}

