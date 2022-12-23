const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication");

module.exports = (app) => {
    app.get("/api/teams/:code", auth, (req, res) => {
        models.Team.findOne({where: {code: req.params.code}}).then(team => {
            if(!team) return res.status(404).json({message: "Team not found"});
            if(req.query.complete !== "id" && req.query.complete !== "users") return res.status(200).json(team);
            models.User.findAll({where: {teamCode: team.code}}).then(users => {
                team = team.toJSON();
                const members = [];
                for(let user of users){
                    user = user.toJSON();
                    delete user.password;
                    delete user.teamCode;
                    delete user.groupId;
                    if(req.query.complete === "users")
                        members.push(user);
                    else
                        members.push(user.id);
                }
                team.members = members;
                return res.status(200).json(team);
            });
        });
    });
}