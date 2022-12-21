const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication")

module.exports = (app) => {
    app.get("/api/teams", auth, (req, res) => {
        models.Team.findAll().then(teams => {
            if(teams === null) return res.status(404).json({message: "No teams found"});
            return res.status(200).json(teams);
        }).catch(error => {
            return res.status(500).json({message: "Error with database", data: error});
        });
    });
}