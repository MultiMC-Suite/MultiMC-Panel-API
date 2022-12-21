const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define('Group', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            permissions: {
                type: DataTypes.STRING,
                allowNull: false,
                get(){
                    return this.getDataValue('permissions').split(',');
                },
                set(value){
                    this.setDataValue('permissions', value.join(','));
                }
            }
        },
        {
            timestamps: false
        });
}
