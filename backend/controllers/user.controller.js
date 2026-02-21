import {getAllUsers, getUserById, createUser, updateUser, deleteUser} from '../repos/users.repo.js';

function sanitizeUser(user) {
    const u = user.get({ plain: true });
    delete u.user_password;
    return u;
}

export async function getUsersController(req, res) {
    try {
        const users = await getAllUsers();
        const safeUsers = users.map(user => sanitizeUser(user));
        res.status(200).json(safeUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getUser(req, res) {
    try {
        let id = req.params.id;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        let user = await getUserById(req.params.id);
        if (user) {
            const safeUser = sanitizeUser(user);
            res.status(200).json(safeUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createNewUser(req, res) {
    try {
        const { user_name, user_email, user_password } = req.body;

        if (!user_name) { return res.status(400).json({ error: 'user_name is required' }); }
        if (!user_email) { return res.status(400).json({ error: 'user_email is required' }); }
        if (!user_password) { return res.status(400).json({ error: 'user_password is required' }); }

        if (user_name.length > 50) {
            return res.status(400).json({ error: 'User Name must be less than 50 characters' });
        }

        if (!/\S+@\S+\.\S+/.test(user_email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const newUser = await createUser({ user_name, user_email, user_password });

        res.status(201).json(sanitizeUser(newUser));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateExistingUser(req, res) {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const [updatedRows] = await updateUser(userId, updateData);

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }
        const updatedUser = await getUserById(userId);
        res.status(200).json(sanitizeUser(updatedUser));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteExistingUser(req, res) {
    try {
        const deleted = await deleteUser(req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'User deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}