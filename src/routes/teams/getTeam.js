const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication");

module.exports = (app) => {
    app.get("/api/teams/:code", auth, (req, res) => {
        models.Team.findOne({where: {code: req.params.code}}).then(team => {
            if(!team) return res.status(404).json({message: "Team not found"});
            return res.json(team);
        });
    });
}