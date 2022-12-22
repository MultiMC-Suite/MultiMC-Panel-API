const auth = require ("../../middlewares/authentication");
const {models} = require("../../database/sequelize");

module.exports = (app) => {
    app.post('/api/notifications', auth, (req, res) => {
        const receiverId = req.body.targetId;
        if(!receiverId) return res.status(400).json({message: "Missing targetId"});
        const senderId = req.user.id;
        if(receiverId === senderId) return res.status(400).json({message: "You can't send a notification to yourself"});
        const type = req.body.type;
        if(!["info", "score", "invite", "join", "leave"].includes(type)) return res.status(400).json({message: "Invalid type"});
        const content = req.body.content;
        // Check content to verify if all require fields dot each type are present
        if(type === "info" && !content.message) return res.status(400).json({message: "Missing message field in content"});
        if(type === "score" && (!content.oldScore || !content.newScore)) return res.status(400).json({message: "Missing oldScore or newScore fields in content"});
        if(type === "invite" && !content.teamCode) return res.status(400).json({message: "Missing teamCode field in content"});
        if((type === "join" || type === "leave") && (!content.teamCode || !content.targetId)) return res.status(400).json({message: "Missing teamCode or targetId field in content"});
        models.User.findOne({where: {id: receiverId}}).then(user => {
            if(!user) return res.status(404).json({message: "Target user not found"});
            models.Notification.create({
                senderId: senderId,
                receiverId: receiverId,
                type: type,
                jsonContent: content,

            }).then(notice => {
                res.status(201).json(notice);
            }).catch(err => {
                res.status(500).json({message: "Error when creating the notice", error: err});
            });
        }).catch(err => {
            res.status(500).json({message: "Error when searching for the target user", error: err});
        });
    });
}