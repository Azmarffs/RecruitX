const jwt = require('jsonwebtoken');
require('dotenv').config();

// const attachToken = (req, res, next) => 
// {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) 
//     {
//         return res.status(401).json({ message: "Unauthorized: No Token Provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     try 
//     {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } 
//     catch (error) 
//     {
//         console.error("Token Verification Error:", error.message);
//         return res.status(401).json({ message: "Unauthorized: Invalid Token" });
//     }
// };

const authenticateUser = (req, res, next) => {
    try {
        console.log('User from Token:', req.user); // Log the user object

        if (!req.user || !req.user.email || !req.user.userId) {
            return res.status(403).json({
                message: `Unauthorized: Token does not contain ${!req.user?.userId ? 'userId, ' : ''}${!req.user?.email ? 'email, ' : ''}`.slice(0, -2),
            });
        }

        if (
            (req.params.email && req.user.email.toLowerCase() !== req.params.email.toLowerCase()) ||
            (req.params.id && parseInt(req.user.userId) !== parseInt(req.params.id))
        ) {
            return res.status(403).json({ message: 'Unauthorized: You can only manage your own account' });
        }

        next();
    } catch (error) {
        console.error('Authentication Error:', error.message); // Log the error
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// const verifyToken = (req, res, next) => 
// {
//     try 
//     {
//         const authHeader = req.headers['authorization'];
//         console.log("Authorization Header:", authHeader); 

//         if (!authHeader || !authHeader.startsWith("Bearer ")) 
//         {
//             return res.status(401).json({ message: "Unauthorized: No token provided" });
//         }

//         const token = authHeader.split(" ")[1];

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded Token:", decoded);
//         req.user = decoded;
//         next();
//     } 
//     catch (error) 
//     {
//         console.error("Token Verification Error:", error.message); 
//         return res.status(403).json({ message: "Unauthorized: Invalid token" });
//     }
// };
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log('Token:', token); // Log the token for debugging

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token Verification Error:', error.message); // Log the error
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports =
{
    //attachToken,
    verifyToken,
    authenticateUser
};