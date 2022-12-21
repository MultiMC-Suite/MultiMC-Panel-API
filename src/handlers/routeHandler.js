const loadFiles = require('./fileHandler');

module.exports = (app) => {
    const files = loadFiles('./src/routes', true);
    files.forEach(file => {
        try{
            console.log(`Registering route ${file}...`);
            require(`../routes/${file}`)(app);
        } catch (e){
            console.error(`Error while registering route ${file}: ${e}`);
        }

    })
}
