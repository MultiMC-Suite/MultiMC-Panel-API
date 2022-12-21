const {models} = require("../../../database/sequelize");
const auth = require("../../../middlewares/authentication");

module.exports = (app) => {
    app.delete("/api/teams/members/:id", auth, (req, res) => {
        const userId = req.user.id;
        const targetId = req.params.id;
        // Check if user is team owner
        models.User.findOne({where: {id: userId}}).then(user => {
            if(!user) return res.status(404).json({message: "User not found"});
            const teamCode = user.teamCode;
            models.Team.findOne({where: {code: teamCode}}).then(team => {
                if(!team) return res.status(404).json({message: "Team not found"});
                if(team.ownerId !== userId) return res.status(403).json({message: "You are not the team owner"});
                // Check if target user is in the team
                models.User.findOne({where: {id: targetId}}).then(target => {
                    if(!target) return res.status(404).json({message: "Target user not found"});
                    if(target.teamCode !== teamCode) return res.status(404).json({message: "User is not in your team"});
                    // Remove user from team
                    target.teamCode = null;
                    target.save().then(() => {
                        return res.status(204).json({message: "User removed from team"});
                    });
                });
            });
        });

    });
}