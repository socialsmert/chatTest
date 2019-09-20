import jwt from 'jsonwebtoken'


module.exports = (req, res, next) => {

    const token = req.headers['authorization'];

    try{
        const decoded = jwt.verify(token, 's65f4hj45154efvkc4');
        req.token = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
};