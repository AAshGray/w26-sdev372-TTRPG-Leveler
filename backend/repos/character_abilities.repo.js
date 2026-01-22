import db from '../models/index.js';
import {Op} from 'sequelize';

export async function createCharacterAbility(abilityData) {
    return await db.CharacterAbilities.create(abilityData);
}

export async function findAllCharacterAbilities() {
    return await db.CharacterAbilities.findAll();
}

export async function findCharacterAbilityById(abilityId) {
    return await db.CharacterAbilities.findByPk(abilityId);
}

export async function findCharacterAbilitiesByCharacterId(characterId) {
    return await db.CharacterAbilities.findAll({
        where: {
            character_id: characterId
        }
    });
}

export async function findAllCharacterAbilitiesByCharacterIdWithDetails(characterId) {
    return await db.CharacterAbilities.findAll({
        where: { character_id: characterId },
        include: [{
            model: db.Abilities,
            as: 'ability'
        }]
    });
}

export async function updateCharacterAbility(characterAbilityId, updateData) {
    return await db.CharacterAbilities.update(updateData, {
        where: { id: characterAbilityId }
    });
}

export async function deleteCharacterAbility(characterAbilityId) {
    return await db.CharacterAbilities.destroy({
        where: { id: characterAbilityId }
    });
}