const {models} = require("../../database/sequelize");
const auth = require("../../middlewares/authentication")

module.exports = (app) => {
    app.post("/api/teams", auth, (req, res) => {
        const teamName = req.body.teamName;
        if(!teamName) return res.status(400).json({message: "Missing team name"});
        const userId = req.user.id;
        models.User.findOne({where: {id: userId}}).then(user => {
            if(user.teamCode !== null) return res.status(400).json({message: "User already in a team"});
            models.Team.findOne({where: {name: teamName}}).then(team => {
                if(team !== null) return res.status(400).json({message: "Team already exists"});
                const teamCode = Math.random().toString(36).substring(2, 7).toUpperCase();
                models.Team.create({name: teamName, code: teamCode, ownerId: userId}).then(team => {
                    user.setTeam(team).then(async () => {
                        // Remove all invites send to this user
                        const invites = await models.Notification.findAll({where: {receiverId: userId, type: "invite"}});
                        for(let invite of invites){
                            await invite.destroy();
                        }
                        return res.status(201).json(team);
                    }).catch(error => {
                        return res.status(500).json({message: "Error with database", data: error});
                    });
                });
            });
        });
    });
}