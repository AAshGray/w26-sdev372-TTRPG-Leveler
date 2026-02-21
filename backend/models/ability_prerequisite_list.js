import {DataTypes} from 'sequelize';
export default (sequelize) => {
    return sequelize.define('ability_prerequisite_list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ability_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'abilities',
                key: 'id',
                ondelete: 'CASCADE'
            }
        },
        prerequisite_ability_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'abilities',
                key: 'id',
                ondelete: 'CASCADE'
            }
        }
    });
}