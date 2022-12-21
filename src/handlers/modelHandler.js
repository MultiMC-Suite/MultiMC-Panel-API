const loadFiles = require('./fileHandler');

module.exports = (sequelize) => {
    const models = {};
    const files = loadFiles('./src/database/models', true);
    files.forEach(file => {
        console.log(`Registering model ${file}...`);
        const model = require(`../database/models/${file}`)(sequelize);
        models[model.name] = model;
    })
    return models;
}
