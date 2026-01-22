import db from '../models/index.js';
import {Op} from 'sequelize';

export async function createUser(userData) {
    return await db.Users.create(userData);
}

export async function findUserById(userId) {
    return await db.Users.findByPk(userId, {
        include: [
            {
                model: db.Characters,
                as: 'characters'
            }
        ]
    });
}

export async function findUserByEmail(user_email) {
    return await db.Users.findOne({
        where: {
            user_email: {
                [Op.eq]: user_email
            }
        }
    });
}

export async function updateUser(userId, updateData) {
    return await db.Users.update(updateData, {
        where: {
            id: userId
        }
    });
}

export async function deleteUser(userId) {
    return await db.Users.destroy({
        where: {
            id: userId
        }
    });
}

