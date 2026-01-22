import db from '../models/index.js';
import {Op} from 'sequelize';

export async function createAbility(abilityData) {
    return await db.Abilities.create(abilityData);
}

export async function findAbilityById(abilityId) {
    return await db.Abilities.findByPk(abilityId);
}

export async function findAllAbilities() {
    return await db.Abilities.findAll();
}

export async function findAbilitiesByClassId(classId) {
    return await db.Abilities.findAll({
        where: {
            class_id: classId
        }
    });
}

export async function findAbilitiesByClassName(className) {
    return await db.Abilities.findAll({
        include: [
            {
                model: db.ClassReference,
                as: 'class_reference',
                where: {
                    class_name: {
                        [Op.like]: `%${className}%`
                    }
                }
            }
        ]
    });
}

export async function findAbilitiesByName(ability_name) {
    return await db.Abilities.findAll({
        where: {
            ability_name: {
                [Op.like]: `%${ability_name}%`
            }
        }
    });
}

export async function updateAbility(abilityId, updateData) {
    return await db.Abilities.update(updateData, {
        where: {
            id: abilityId
        }
    });
}

export async function deleteAbility(abilityId) {
    return await db.Abilities.destroy({
        where: {
            id: abilityId
        }
    });
}

