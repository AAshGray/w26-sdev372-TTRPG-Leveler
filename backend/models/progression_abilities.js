import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('progression_abilities', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        progression_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'progression',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        ability_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'abilities',
                key: 'id',
                onDelete: 'CASCADE'
            }
        }
    }, {
        timestamps: false
    });
};