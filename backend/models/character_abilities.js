import {DataTypes} from 'sequelize';
export default (sequelize) => {
    return sequelize.define('character_abilities', {
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
        ability_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'abilities',
                key: 'id',
            }
        },
        proficient: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        proficiency_bonus: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        ability_level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        number_of_uses: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    { timestamps: false });
}