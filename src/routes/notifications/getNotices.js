const {models} = require("../../database/sequelize");
const auth = require ("../../middlewares/authentication");

module.exports = (app) => {
    app.get('/api/notifications', auth, (req, res) => {
        const userId = req.user.id;
        models.Notification.findAll({where: {receiverId: userId}}).then(async notices => {
            if(notices.length === 0) return res.status(404).json({message: "No notices found"});
            const finalNotices = [];
            for(let notice of notices){
                notice = notice.toJSON();
                notice.jsonContent.message = await getMessage(notice.type, notice.jsonContent);
                finalNotices.push(notice);
            }
            res.status(200).json(finalNotices);
        }).catch(err => {
            console.log(err)
            res.status(500).json({message: "Internal server error", error: err});
        });
    });
}

async function getMessage(noticeType, content){
    switch (noticeType) {
        case "info": {
            return content.message;
        }
        case "score": {
            return "Votre score est passé de " + content.oldScore + " points à " + content.newScore + " points !";
        }
        case "invite": {
            const teamName = (await models.Team.findOne({where: {code: content.teamCode}})).name;
            return "Vous avez été invité à rejoindre l'équipe " + teamName + " !";
        }
        case "join": {
            const userName = (await models.User.findOne({where: {id: content.targetId}})).username;
            return userName + " a rejoint votre équipe !";
        }
        case "leave": {
            const userName = (await models.User.findOne({where: {id: content.targetId}})).username;
            return userName + " a quitté votre équipe !";
        }
        default: {
            return "Unknown notification type";
        }
    }
}