import db from '../models/index.js';
import {Op} from 'sequelize';

export async function createAbilityPrerequisite(prerequisiteData) {
    return await db.AbilityPrerequisiteList.create(prerequisiteData);
}

export async function findPrerequisitesByAbilityId(abilityId) {
    return await db.AbilityPrerequisiteList.findAll({
        where: {
            ability_id: abilityId
        }
    });
}

export async function findPrerequisiteByClassName(className) {
    return await db.AbilityPrerequisiteList.findAll({
        include: [{
            model: db.Abilities,
            as: 'ability',
            where: { 
            class_name: {[Op.like]: `%${className}%`} } 
        }]
    });
}

export async function findAllAbilityPrerequisites() {
    return await db.AbilityPrerequisiteList.findAll();
}

export async function updateAbilityPrerequisite(prerequisiteId, updateData) {
    return await db.AbilityPrerequisiteList.update(updateData, {
        where: {
            id: prerequisiteId
        }
    });
}

export async function deleteAbilityPrerequisite(prerequisiteId) {
    return await db.AbilityPrerequisiteList.destroy({
        where: {
            id: prerequisiteId
        }
    });
}