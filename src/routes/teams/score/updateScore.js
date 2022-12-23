const auth = require ("../../../middlewares/authentication");
const {models} = require("../../../database/sequelize");

module.exports = (app) => {
    app.post('/api/teams/score', auth, (req, res) => {
        if(req.user.hasPassword === false) return res.status(403).json({message: "You need password authorization to do that"});
        if(!req.body.teamCode || !req.body.newScore) return res.status(400).json({message: "Missing parameters"});
        const teamCode = req.body.teamCode;
        const newScore = req.body.newScore;
        models.Team.findOne({where: {code: teamCode}}).then(team => {
            if(!team) return res.status(404).json({message: "Team not found"});
            const oldScore = team.score;
            team.score = newScore;
            team.save().then(() => {
                // Send notification to all team members
                models.User.findAll({where: {teamCode: teamCode}}).then(async users => {
                    for(let user of users) {
                        await models.Notification.create({
                            senderId: req.user.id,
                            receiverId: user.id,
                            type: "score",
                            content: {
                                teamCode: teamCode,
                                newScore: newScore,
                                oldScore: oldScore
                            }
                        });
                    }
                    res.status(200).json({message: "Score updated"});
                });
            });
        });
    });
}