const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Team', {
        code: {
            type: DataTypes.STRING(6),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    });
}