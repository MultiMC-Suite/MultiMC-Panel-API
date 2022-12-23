const encryption = require("../../tools/encryption");
const {models} = require('../../database/sequelize');

module.exports = (app) => {
    app.post("/api/token", (req, res) => {
        if(!req.body.username || (!req.body.password && !req.body.code))
            return res.status(400).json({message: "Missing body content (username or (password or code))"})
        models.User.findOne({where: {username: req.body.username}}).then(user => {
            if(user === null) return res.status(404).json({message: "Username not found"});
            if(req.body.password){
                // Password authentication
                encryption.compare(req.body.password, user.password).then(result => {
                    if(!result) return res.status(401).json({message: "Invalid password"});
                    const jsonUser = user.toJSON();
                    delete jsonUser.password;
                    const token = encryption.encodeToken(user.id);
                    return res.status(200).json({user: jsonUser, token});
                })
            }else if(req.body.code === process.env.CODE){
                if(user.password !== null) return res.status(401).json({message: "User has a password authentication"})
                // Code authentication
                const jsonUser = user.toJSON();
                delete jsonUser.password;
                const token = encryption.encodeToken(user.id);
                return res.status(200).json({user: jsonUser, token});
            }else return res.status(401).json({message: "Invalid code"});
        }).catch(error => {
            // Database error
            return res.status(500).json({message: error})
        })
    });
}
