import {DataTypes} from 'sequelize';
export default (sequelize) => {
    return sequelize.define('characters', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
                ondelete: 'CASCADE'
            }
        },
        char_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        total_level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        total_hp: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        initiative_bonus: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        strength: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        dexterity: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        constitution: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        intelligence: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        wisdom: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        charisma: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        languages: {
            type: DataTypes.STRING(255),
        }
    },
    { timestamps: false });
}