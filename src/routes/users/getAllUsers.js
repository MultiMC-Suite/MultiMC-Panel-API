const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication")

module.exports = (app) => {
    app.get("/api/users", auth, (req, res) => {
        models.User.findAll().then(users => {
            if(users === null) return res.status(404).json({message: "No users found"});
            const finalUsers = users.map(user => {
                user = user.toJSON();
                delete user.password;
                return user;
            });
            return res.status(200).json(finalUsers);
        }).catch(error => {
            return res.status(500).json({message: "Error with database", data: error});
        });
    });
}