const {models} = require("../../database/sequelize");
const auth = require ("../../middlewares/authentication");

module.exports = (app) => {
    app.get('/api/notifications', auth, (req, res) => {
        const userId = req.user.id;
        models.Notification.findAll({where: {receiverId: userId}}).then(notices => {
            if(notices.length === 0) return res.status(404).json({message: "No notices found"});
            res.status(200).json(notices);
        }).catch(err => {
            console.log(err)
            res.status(500).json({message: "Internal server error", error: err});
        });
    });
}