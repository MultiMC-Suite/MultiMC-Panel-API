const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication")

module.exports = (app) => {
    app.get("/api/teams", auth, (req, res) => {
        models.Team.findAll().then(teams => {
            if(teams === null) return res.status(404).json({message: "No teams found"});
            if(req.query.complete !== "id" && req.query.complete !== "users") return res.status(200).json(teams);
            models.User.findAll().then(users => {
                const teamsWithUsers = [];
                for(let team of teams){
                    team = team.toJSON();
                    const members = [];
                    const teamMembers = users.filter(user => user.teamCode === team.code);
                    for(let user of teamMembers){
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
                    teamsWithUsers.push(team);
                }
                return res.status(200).json(teamsWithUsers);
            });
        }).catch(error => {
            return res.status(500).json({message: "Error with database", data: error});
        });
    });
}