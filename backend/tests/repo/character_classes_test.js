import assert from 'assert';
import { getTestUserInput, getTestCharacterInput, getTestClassInput} from '../test_utilities.js';
import db from '../../models/index.js';
import {
    assignClassToCharacter,
    findCharacterClassById,
    findAllClassesByCharacterId,
    findAllCharactersWithClassByClassId,
    findCharactersClassesByCharacterName,
    findCharactersClassesByClassName,
    updateCharacterClass,
    removeClassFromCharacter
} from '../../repos/character_classes.repo.js';

import { createUser, deleteUser } from '../../repos/users.repo.js';
import { createCharacter, deleteCharacter } from '../../repos/characters.repo.js';
import { createClassReference } from '../../repos/class_reference.repo.js';

async function testCharacterClassesRepository() {
    let user, character, charClass;

    try {
        await db.sequelize.authenticate();

        user = await createUser(getTestUserInput());
        character = await createCharacter({ ...getTestCharacterInput(), user_id: user.id });
        charClass = await createClassReference(getTestClassInput());
        const characterClassData = {
            character_id: character.id,
            class_id: charClass.id,
            class_level: 3
        };
        
        const characterClass = await assignClassToCharacter(characterClassData);
        assert.strictEqual(characterClass.class_id, charClass.id, 'Class ID should match');
        assert.strictEqual(characterClass.character_id, character.id, 'Character ID should match');

        const fetchedCharClass = await findCharacterClassById(characterClass.id);
        assert.ok(fetchedCharClass, 'CharacterClass should be found by ID');
        assert.strictEqual(fetchedCharClass.class_level, 3, 'Class level should match');

        const classesByCharacter = await findAllClassesByCharacterId(character.id);
        assert.ok(Array.isArray(classesByCharacter), 'Should return an array');
        assert.strictEqual(classesByCharacter.length, 1, 'Should have one class assigned to character');

        const charactersWithClass = await findAllCharactersWithClassByClassId(charClass.id);
        assert.ok(Array.isArray(charactersWithClass), 'Should return an array');
        assert.strictEqual(charactersWithClass.length, 1, 'Should have one character with the class');

        const classesByCharacterName = await findCharactersClassesByCharacterName(character.char_name);
        assert.ok(Array.isArray(classesByCharacterName), 'Should return an array');
        assert.strictEqual(classesByCharacterName.length, 1, 'Should find character classes by character name');

        const classesByClassName = await findCharactersClassesByClassName(charClass.class_name);
        assert.ok(Array.isArray(classesByClassName), 'Should return an array');
        assert.strictEqual(classesByClassName.length, 1, 'Should find character classes by class name');

        await updateCharacterClass(characterClass.id, { class_level: 4 });
        const updatedCharClass = await findCharacterClassById(characterClass.id);
        assert.strictEqual(updatedCharClass.class_level, 4, 'Class level should be updated');

        const removeClassFromCharacterResult = await removeClassFromCharacter(characterClass.id);
        assert.strictEqual(removeClassFromCharacterResult, 1, 'Should remove the class from character');

        const afterDeleteFetch = await findCharacterClassById(characterClass.id);
        assert.strictEqual(afterDeleteFetch, null, 'CharacterClass should be deleted');

        console.log('All CharacterClasses repository tests passed.');
    } catch (err) {
        console.error('Test failed:', err.message);
    } finally {
        if (charClass) {
            try {
                await removeClassFromCharacter(charClass.id);
            } catch (err) {
                console.warn(`Failed to remove class from character: ${err.message}`);
            }
        }

        if (character) {
            try {
                await deleteCharacter(character.id);
            } catch (err) {
                console.warn(`Failed to delete character: ${err.message}`);
            }
        }

        if (user) {
            try {
                await deleteUser(user.id);
            } catch (err) {
                console.warn(`Failed to delete user: ${err.message}`);
            }
        }

        await db.sequelize.close();
    }
}

testCharacterClassesRepository();