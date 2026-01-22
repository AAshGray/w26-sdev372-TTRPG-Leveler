import assert from 'assert';
import randomString from '../test_utilities.js';
import db from '../../models/index.js';
import {
    createCharacterAbility,
    findAllCharacterAbilities,
    findCharacterAbilityById,
    findCharacterAbilitiesByCharacterId,
    findAllCharacterAbilitiesByCharacterIdWithDetails,
    updateCharacterAbility,
    deleteCharacterAbility
} from '../../repos/character_abilities.repo.js';
import { createCharacter } from '../../repos/characters.repo.js';
import { createAbility } from '../../repos/abilities.repo.js';

async function testCharacterAbilitiesRepository() {
    let character, ability, charAbility;

    const randomStr = randomString();
    const testCharacterName = `TestChar_${randomStr}`;
    const testAbilityName = `TestAbility_${randomStr}`;

    try {
        character = await createCharacter({ 
            user_id: 1 ,
            char_name: testCharacterName, 
            total_level: 1,
            total_hp: 10,
            initiative_bonus: 0,
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
            languages: 'Common'
        });

        ability = await createAbility({ 
            class_id: 1,
            ability_name: testAbilityName,
            ability_description: 'A test ability description.',
            ability_type: 'Passive',
            level_required: 1,
            prerequisite_required: false
         });

        charAbility = await createCharacterAbility({
            character_id: character.id,
            ability_id: ability.id,
            level: 1
        });

        // console.log('Created Character Ability:', charAbility.toJSON());
        // console.log('Created Character:', character.toJSON());
        // console.log('Created Ability:', ability.toJSON());

        const allAbilities = await findAllCharacterAbilities();
        assert.ok(allAbilities.length > 0, 'Should fetch all character abilities');

        const fetchedById = await findCharacterAbilityById(charAbility.id);
        assert.strictEqual(fetchedById.id, charAbility.id, 'Fetched by ID should match created');

        const fetchedByCharId = await findCharacterAbilitiesByCharacterId(character.id);
        assert.strictEqual(fetchedByCharId.length, 1, 'Should fetch one ability for character');
        assert.strictEqual(fetchedByCharId[0].ability_id, ability.id, 'Fetched ability ID should match');

        const fetchedWithDetails = await findAllCharacterAbilitiesByCharacterIdWithDetails(character.id);
        assert.strictEqual(fetchedWithDetails.length, 1, 'Should fetch one ability with details');
        assert.strictEqual(fetchedWithDetails[0].ability.ability_name, testAbilityName, 'Fetched ability name should match');

        await updateCharacterAbility(charAbility.id, { ability_level: 2 });
        const updatedAbility = await findCharacterAbilityById(charAbility.id);
        assert.strictEqual(updatedAbility.ability_level, 2, 'Ability level should be updated to 2');

        await deleteCharacterAbility(charAbility.id);
        const afterDelete = await findCharacterAbilityById(charAbility.id);
        assert.strictEqual(afterDelete, null, 'Ability should be deleted');

        console.log('All character abilities repository tests passed.');

    } catch (err) {
        console.error('Test failed:', err.message);
    } finally {
        if (ability) {
            const remaining = await db.CharacterAbilities.count({ where: { ability_id: ability.id } });
            if (remaining === 0) {
                await db.Abilities.destroy({ where: { id: ability.id } });
            }
        }
        await db.sequelize.close();
    }
}

testCharacterAbilitiesRepository();