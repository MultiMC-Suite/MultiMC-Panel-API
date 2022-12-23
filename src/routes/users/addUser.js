const {models} = require("../../database/sequelize");
const encryption = require("../../tools/encryption");
const axios = require("axios");

module.exports = (app) => {
    app.post("/api/users", async (req, res) => {
        if (!req.body.username || (!req.body.password && !req.body.code))
            return res.status(400).json({message: "Missing body content (username or (password or code))"})
        const username = req.body.username;
        const password = req.body.password;
        let encryptedPassword;
        if (password)
            encryptedPassword = await encryption.encrypt(password);
        const code = req.body.code;
        // Check code if present
        if(code)
            if(code !== process.env.CODE) return res.status(401).json({message: "Invalid code"});
        models.User.findOne({where: {username}}).then(user => {
            if (user !== null) return res.status(409).json({message: "Username already exists"});
            models.User.create({username, password: encryptedPassword, code}).then(user => {
                let data;
                if(encryptedPassword){
                    data = {
                        username,
                        password
                    }
                }else{
                    data = {
                        username,
                        code
                    }
                }
                axios.post(`http://${process.env.BIND_ADDRESS}:${process.env.PORT}/api/token`, data).then(response => {
                    return res.status(201).json(response.data);
                }).catch(error => {
                    console.log(error);
                    return res.status(500).json({message: "Error with database when login in the new user", data: error.data});
                });
            }).catch(error => {
                return res.status(500).json({message: "Error with database when adding new user", data: error});
            });
        }).catch(error => {
            return res.status(500).json({message: "Error with database when fetching existing user", data: error});
        });
    })
}