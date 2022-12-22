const {models} = require("../../database/sequelize");
const auth = require ("../../middlewares/authentication");

module.exports = (app) => {
    app.post('/api/notifications/decline/:notificationId', auth, (req, res) => {
        const userId = req.user.id;
        const notificationId = req.params.notificationId;
        models.Notification.findOne({where: {id: notificationId}}).then(notice => {
            if(!notice) return res.status(404).json({message: "Notification not found"});
            if(notice.receiverId !== userId) return res.status(403).json({message: "You can't decline this notification"});
            if(!["invite"].includes(notice.type)) return res.status(400).json({message: "This notification can't be declined"});
            if(notice.type === "invite"){
                declineInvite(notice, userId).then(() => {
                    res.status(200).json({message: "Invite declined"});
                });
            }
        });
    });
}

async function declineInvite(notice, userId){
    await notice.destroy();
    // Send a notification to the sender
    const sender = await models.User.findOne({where: {id: notice.senderId}});
    await models.Notification.create({
        senderId: userId,
        receiverId: sender.id,
        type: "decline",
        jsonContent: {
            noticeType: "invite",
            targetId: userId
        }
    });
}