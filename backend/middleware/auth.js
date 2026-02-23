export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check for "Bearer <token>" - accepts anything for now
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};