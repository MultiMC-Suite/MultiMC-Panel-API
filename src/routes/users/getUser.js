const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication")

module.exports = (app) => {
    app.get("/api/users/:id", auth, (req, res) => {
        models.User.findOne({where: {id: req.params.id}}).then(user => {
            if(user === null) return res.status(404).json({message: "User not found"});
            user = user.toJSON();
            delete user.password;
            return res.status(200).json(user);
        }).catch(error => {
            return res.status(500).json({message: "Error with database", data: error});
        });
    });
}