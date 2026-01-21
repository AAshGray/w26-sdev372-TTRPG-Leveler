import {DataTypes} from 'sequelize';

export default (sequelize) => {
    return sequelize.define('abilities', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        class_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'class_reference',
                key: 'id',
                ondelete: 'CASCADE'
            }
        },
        ability_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ability_description: {
            type: DataTypes.TEXT
        },
        ability_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        level_required: {
            type: DataTypes.INTEGER
        },
        prerequisite_required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        prerequisite_list_id: {
            type: DataTypes.INTEGER,
        }
    },
    { timestamps: false });
}