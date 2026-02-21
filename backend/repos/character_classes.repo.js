import db from '../models/index.js';
import {Op} from 'sequelize';

export async function assignClassToCharacter(characterClassData) {
    return await db.CharacterClasses.create(characterClassData);
}

export async function findCharacterClassById(characterClassId) {
    return await db.CharacterClasses.findByPk(characterClassId);
}

export async function findAllClassesByCharacterId(characterId) {
    return await db.CharacterClasses.findAll({
        where: {
            character_id: characterId
        }
    });
}

export async function findAllCharactersWithClassByClassId(classId) {
    return await db.CharacterClasses.findAll({
        where: {
            class_id: classId
        }
    });
}

export async function findCharactersClassesByCharacterName(characterName) {
    return await db.CharacterClasses.findAll({
        include: [{ model: db.Characters,
                    as: 'character',
                    where: {
                        char_name: {
                            [Op.like]: `%${characterName}%`
                        }
                    }
                 }]
    });
}

export async function findCharactersClassesByClassName(className) {
    return await db.CharacterClasses.findAll({
        include: [{ model: db.ClassReference,
                as: 'class_reference',
                where: {
                    class_name: {
                        [Op.like]: `%${className}%`
                    }
                }
            }]
    });
}

export async function updateCharacterClass(characterClassId, updateData) {
    return await db.CharacterClasses.update(updateData, {
        where: { id: characterClassId }
    });
}

export async function removeClassFromCharacter(characterClassId) {
    return await db.CharacterClasses.destroy({
        where: { id: characterClassId }
    });
}


