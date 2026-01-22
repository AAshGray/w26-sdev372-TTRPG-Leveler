import {DataTypes} from 'sequelize';

export default (sequelize) => {
    return sequelize.define('class_reference', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        class_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        class_type: {
            type: DataTypes.STRING(50)
        },
        hit_die: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        primary_stat: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
    },
    { timestamps: false,
      freezeTableName: true
     });
}