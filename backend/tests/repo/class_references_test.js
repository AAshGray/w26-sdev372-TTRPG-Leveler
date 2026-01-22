import assert from 'assert';
import randomString from '../test_utilities.js';
import db from '../../models/index.js';
import {
    createClassReference,
    findClassReferenceById,
    findAllClassReferences,
    findClassReferencesByName,
    updateClassReference,
    deleteClassReference
} from '../../repos/class_reference.repo.js';

async function testClassReferenceRepository() {
    let classRef;

    const randomStr = randomString();
    const testClassName = `TestClass_${randomStr}`;
    const testClassType = `TestType_${randomStr}`;
    const testHitDie = 8;
    const testPrimaryStat = 'Strength';

    try {
        classRef = await createClassReference({
            class_name: testClassName,
            class_type: testClassType,
            hit_die: testHitDie,
            primary_stat: testPrimaryStat
        });
        assert.ok(classRef.id);

        const fetchedById = await findClassReferenceById(classRef.id);
        assert.strictEqual(fetchedById.class_name, testClassName, 'Fetched by ID should match created');

        const allClasses = await findAllClassReferences();
        assert.ok(allClasses.length > 0, 'Should fetch all class references');

        const fetchedByName = await findClassReferencesByName(testClassName);
        assert.strictEqual(fetchedByName.length, 1, 'Should fetch one class by name');
        assert.strictEqual(fetchedByName[0].id, classRef.id, 'Fetched class ID should match');

        const updatedHitDie = 10;
        await updateClassReference(classRef.id, { hit_die: updatedHitDie });
        const updatedClass = await findClassReferenceById(classRef.id);
        assert.strictEqual(updatedClass.hit_die, updatedHitDie, 'Hit die should be updated');

        await deleteClassReference(classRef.id);
        const afterDeleteClass = await findClassReferenceById(classRef.id);
        assert.strictEqual(afterDeleteClass, null, 'Class reference should be deleted');
    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        console.log('Class reference repository test completed');
        await db.sequelize.close();
    }
}

testClassReferenceRepository();