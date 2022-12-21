module.exports = (app) => {
    app.get('/', (req, res) => {
        res.status(302).redirect('https://github.com/MultiMC-Suite/MultiMC-Panel-API');
    });
}