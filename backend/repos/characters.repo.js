import db from '../models/index.js';
import {Op} from 'sequelize';

export async function createCharacter(characterData) {
    return await db.Characters.create(characterData);
}

export async function findCharacterById(characterId) {
    return await db.Characters.findByPk(characterId);
}

export async function findAllCharactersByUserId(userId) {
    return await db.Characters.findAll({
        where: {
            user_id: userId
        }
    });
}

export async function updateCharacter(characterId, updateData) {
    return await db.Characters.update(updateData, {
        where: {
            id: characterId
        }
    });
}

export async function deleteCharacter(characterId) {
    return await db.Characters.destroy({
        where: {
            id: characterId
        }
    });
}
