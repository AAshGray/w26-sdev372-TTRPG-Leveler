import db from '../models/index.js';
import {Op} from 'sequelize';

export async function createClassReference(classData) {
    return await db.ClassReference.create(classData);
}

export async function findAllClassReferences() {
    return await db.ClassReference.findAll();
}

export async function findClassReferenceById(classId) {
    return await db.ClassReference.findByPk(classId);
}

export async function findClassReferencesByName(className) {
    return await db.ClassReference.findAll({
        where: {
            class_name: {
                [Op.like]: `%${className}%`
            }
        }
    });
}

export async function updateClassReference(classId, updateData) {
    return await db.ClassReference.update(updateData, {
        where: {
            id: classId
        }
    });
}

export async function deleteClassReference(classId) {
    return await db.ClassReference.destroy({
        where: {
            id: classId
        }
    });
}