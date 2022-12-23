const { Sequelize } = require('sequelize')
const encryption = require("../tools/encryption");

let sequelize;
if(process.env.DB_TYPE === "sqlite"){
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database.db',
        logging: process.env.DB_LOGGING === "true"
    });
}else{
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
        logging: process.env.DB_LOGGING === "true"
    });
}

// Loading models
const models = require('../handlers/modelHandler')(sequelize);

// Foreign keys
models.User.belongsTo(models.Group, {foreignKey: {name: "groupId", allowNull: false, defaultValue: 1}});
models.Team.belongsTo(models.User, {foreignKey: {name: "ownerId", allowNull: false}});
models.User.belongsTo(models.Team, {foreignKey: {name: "teamCode", allowNull: true}});
models.Notification.belongsTo(models.User, {foreignKey: {name: "senderId", allowNull: true}});
models.Notification.belongsTo(models.User, {foreignKey: {name: "receiverId", allowNull: false}});

sequelize.sync({force: process.env.DB_FORCE_INIT === "true"}).then(_ => {
    console.log('Database synchronized');
    if(process.env.DB_INIT === "true"){
        isRootUserExist().then(async exist => {
            if(!exist){
                console.log("Adding defaults");
                await addRoot();
                await addDefaults();
            }
        })
    }
});
const isRootUserExist = async () => {
    return await models.User.findOne({where: {username: "root"}}) !== null;
}
async function addRoot() {
    await models.Group.findOne({where: {name: "default"}}).then(group => {
        if(group === null){
            models.Group.create({
                name: "default",
                permissions: []
            })
        }
    });
    await models.Group.findOne({where: {name: "root"}}).then(group => {
        if(group === null){
            models.Group.create({
                name: "root",
                permissions: ["*"]
            })
        }
    });
    await models.User.findOne({where: {username: "root"}}).then(async (user) => {
        if(user === null){
            const encryptedPassword = await encryption.encrypt(process.env.ROOT_PASSWORD);
            const group = await models.Group.findOne({where: {name: "root"}});
            models.User.create({
                username: "root",
                password: encryptedPassword,
                groupId: group.id
            })
        }
    });
    console.log("Root user created");
}

async function addDefaults(){
    const users = [
        await models.User.create({
            username: "User 1",
            password: null,
            groupId: 1,
            teamCode: null
        }),
        await models.User.create({
            username: "User 2",
            password: null,
            groupId: 1,
            teamCode: null
        })
    ]
    await models.Team.create({
        name: "Team 1",
        code: "TEAM1",
        ownerId: 1,
        score: 15
    })
    for(const user of users){
        await models.User.update({teamCode: "TEAM1"}, {where: {id: user.id}})
    }
}

module.exports = {
    models
}

