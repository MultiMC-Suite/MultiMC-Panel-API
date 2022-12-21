const encryption = require("../../tools/encryption");
const auth = require("../../middlewares/authentication");
const {models} = require("../../database/sequelize");

module.exports = (app) => {
    app.get("/api/token", auth, (req, res) => {
        models.User.findOne({where: {id: req.user.id}}).then(user => {
            const jsonUser = user.toJSON();
            delete jsonUser.password;
            return res.status(200).json(jsonUser);
        })
    });
}