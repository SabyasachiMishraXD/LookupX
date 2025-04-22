import jwt from 'jsonwebtoken';

// Function to generate JWT token
export  const generateToken = (user) =>{
    return jwt.sign(
        { id: user.id, phoneNumber: user.phoneNumber },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}