import assert from 'assert';
import randomString from '../test_utilities.js';
import db from '../../models/index.js';
import {
    createAbility,
    findAbilityById,
    findAllAbilities,
    findAbilitiesByClassName,
    findAbilitiesByName,
    updateAbility,
    deleteAbility
} from '../../repos/abilities.repo.js';


async function testAbilityRepository() {
    let classRef, ability;

    const randomStr = randomString();
    const testClassName = `TestClass_${randomStr}`;
    const testAbilityName = `testAbility_${randomStr}`;
    const testAbilityDesc = 'test description';
    const testAbilityType = 'test type';

    try {
        classRef = await db.ClassReference.create({
            class_name: testClassName,
            class_type: 'Martial',
            hit_die: 10,
            primary_stat: 'STR'
        });

        console.log('Testing createAbility...');
        ability = await createAbility({
            class_id: classRef.id,
            ability_name: testAbilityName,
            ability_description: testAbilityDesc,
            ability_type: testAbilityType,
            level_required: 1
        });
        assert.ok(ability.id);
        console.log('createAbility passed');

        console.log('Testing findAbilityById...');
        const foundById = await findAbilityById(ability.id);
        assert.equal(foundById.ability_name, testAbilityName);
        console.log('findAbilityById passed');

        console.log('Testing findAllAbilities...');
        const allAbilities = await findAllAbilities();
        assert.ok(allAbilities.some(a => a.id === ability.id));
        console.log('findAllAbilities passed');

        console.log('Testing findAbilitiesByClassName...');
        const byClassName = await findAbilitiesByClassName(testClassName);
        assert.ok(byClassName.some(a => a.id === ability.id));
        console.log('findAbilitiesByClassName passed');

        console.log('Testing findAbilitiesByName...');
        const partialMatch = await findAbilitiesByName(testAbilityName);
        assert.ok(partialMatch.some(a => a.id === ability.id));
        console.log('findAbilitiesByName passed');

        console.log('Testing updateAbility...');
        const [updatedCount] = await updateAbility(ability.id, { ability_description: 'Updated description' });
        assert.equal(updatedCount, 1);
        const updatedAbility = await findAbilityById(ability.id);
        assert.equal(updatedAbility.ability_description, 'Updated description');
        console.log('updateAbility passed');

        console.log('Testing deleteAbility...');
        const deletedCount = await deleteAbility(ability.id);
        assert.equal(deletedCount, 1);
        console.log('deleteAbility passed');

        console.log('All Ability repository tests passed');

    } catch (err) {
        console.error('Test failed:', err.message);
    } finally {
        if (classRef) await db.ClassReference.destroy({ where: { id: classRef.id } });
        await db.sequelize.close();
    }
}

testAbilityRepository();