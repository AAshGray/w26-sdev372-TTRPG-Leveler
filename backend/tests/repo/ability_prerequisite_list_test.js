import assert from 'assert';
import {getTestClassInput, getTestAbilityInput} from '../test_utilities.js';
import db from '../../models/index.js';
import {
    createAbilityPrerequisite,
    findPrerequisitesByAbilityId,
    findAllAbilityPrerequisites,
    updateAbilityPrerequisite,
    deleteAbilityPrerequisite
} from '../../repos/ability_prerequisite_list.repo.js';

async function testAbilityPrerequisiteListRepository() {
    let testClass, prereqEntry, Ability_A, Ability_B;

    try {
        await db.sequelize.authenticate();

        testClass = await db.ClassReference.create(getTestClassInput());
        Ability_A = await db.Abilities.create(getTestAbilityInput(testClass.id));
        Ability_B = await db.Abilities.create(getTestAbilityInput(testClass.id));

        prereqEntry = await createAbilityPrerequisite({
            ability_id: Ability_A.id,
            prerequisite_ability_id: Ability_B.id
        });
        assert.ok(prereqEntry.id, 'Prerequisite entry should have an ID');

        const fetchedByAbility = await findPrerequisitesByAbilityId(Ability_A.id);
        assert.strictEqual(fetchedByAbility.length, 1, 'Should fetch one prerequisite by ability ID');
        assert.strictEqual(fetchedByAbility[0].prerequisite_ability_id, Ability_B.id, 'Prerequisite ability ID should match');

        const allPrereqs = await findAllAbilityPrerequisites();
        assert.ok(allPrereqs.length >= 1, 'Should fetch all ability prerequisites');
        
        const updatedPrereq = await updateAbilityPrerequisite(prereqEntry.id, { prerequisite_ability_id: Ability_A.id });
        assert.strictEqual(updatedPrereq[0], 1, 'One row should be updated');

        await deleteAbilityPrerequisite(prereqEntry.id);
        const afterDelete = await findPrerequisitesByAbilityId(Ability_A.id);
        assert.strictEqual(afterDelete.length, 0, 'No prerequisites should remain after deletion');

    } catch (error) {
        console.error('Ability Prerequisite List repository test failed:', error);
    } finally {
        try { if (Ability_A) await db.Abilities.destroy({ where: { id: Ability_A.id } }); } 
            catch (e) { `${Ability_A} cleanup failed:`, console.warn(e); }
        try { if (Ability_B) await db.Abilities.destroy({ where: { id: Ability_B.id } }); } 
            catch (e) { `${Ability_B} cleanup failed:`, console.warn(e); }
        try { if (prereqEntry) await db.AbilityPrerequisiteList.destroy({ where: { id: prereqEntry.id } }); } 
            catch (e) { `${prereqEntry} cleanup failed:`, console.warn(e); }
        try { if (testClass) await db.ClassReference.destroy({ where: { id: testClass.id } }); } 
            catch (e) { `${testClass} cleanup failed:`, console.warn(e); }

        await db.sequelize.close();

        console.log('Ability Prerequisite List repository test completed');
    }
}

testAbilityPrerequisiteListRepository();