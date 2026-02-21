import {DataTypes} from 'sequelize';
export default (sequelize) => {
    return sequelize.define('character_classes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        character_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'characters',
                key: 'id',
                ondelete: 'CASCADE'
            }
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'class_reference',
                key: 'id',
            }
        },
        class_level: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        }
    });
}