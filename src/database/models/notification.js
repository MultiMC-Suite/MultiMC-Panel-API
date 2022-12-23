const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.JSON,
            allowNull: false
        }
    }, {
        timestamps: false
    });
}