const {models} = require("../../database/sequelize");
const auth = require ("../../middlewares/authentication");

module.exports = (app) => {
    app.post('/api/notifications/accept/:notificationId', auth, (req, res) => {
        const userId = req.user.id;
        const notificationId = req.params.notificationId;
        models.Notification.findOne({where: {id: notificationId}}).then(notice => {
            if(!notice) return res.status(404).json({message: "Notification not found"});
            if(notice.receiverId !== userId) return res.status(403).json({message: "You can't accept this notification"});
            if(!["invite"].includes(notice.type)) return res.status(400).json({message: "This notification can't be accepted"});
            if(notice.type === "invite"){
                acceptInvite(notice, userId).then(() => {
                    res.status(200).json({message: "Invite accepted"});
                });
            }
        });
    });
}

async function acceptInvite(notice, userId){
    const teamCode = notice.jsonContent.teamCode;
    await notice.destroy();
    // Delete all other invites send to this user
    const otherInvites = await models.Notification.findAll({where: {receiverId: userId, type: "invite"}});
    for(let otherInvite of otherInvites)
        await otherInvite.destroy();
    // Update user to set his the good team
    const user = await models.User.findOne({where: {id: userId}});
    user.teamCode = teamCode;
    await user.save();
    // Send join notification to all team members
    const teamMembers = await models.User.findAll({where: {teamCode: teamCode}});
    for(let member of teamMembers){
        await models.Notification.create({
            receiverId: member.id,
            type: "join",
            jsonContent: {
                teamCode: teamCode,
                targetId: userId
            }
        });
    }
}