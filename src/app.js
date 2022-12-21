require('dotenv').config()
const express = require('express');

// Middlewares
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

// Init database
require('./database/sequelize')

const app = express();

// Init commons middlewares
// Logger
logger.token("separator", "--------------------------");
logger.token("custom", ":date[clf]")
app.use(logger('separator'))
app.use(logger('custom'))
app.use(logger('dev'))
// Others
app.use(bodyParser.json());
app.use(cors());

// Init routes
require('./handlers/routeHandler')(app);
// Init 404 middleware
app.use(({res}) => res.status(404).json({message: "Unknown route"}));

if (require.main === module) {
    // Start the API
    app.listen(process.env.PORT, process.env.BIND_ADDRESS, () => {
        console.log(`Server started on http://${process.env.BIND_ADDRESS}:${process.env.PORT}`);
    });
}

module.exports = app;