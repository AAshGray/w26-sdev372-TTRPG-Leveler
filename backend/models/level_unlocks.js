import {DataTypes} from 'sequelize';

export default (sequelize) => {
    return sequelize.define('level_unlocks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // null for any class
            references: {
                model: 'class_reference',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unlock_type: {
            type: DataTypes.STRING(50), // spell slots, stat, feat, etc. Probably would match "ability type" tag
            allowNull: false
        },
        choice_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        config: { // Choices to be passed to front end
            type: DataTypes.JSON,
            allowNull: true
        },
        infoblock: { // information to be displayed to player e.g. "Please pick a specialization:"
            type: DataTypes.TEXT,
            allowNull: true
        }
    });
}