const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/Users');

// Register
const registerUser = async(req, res) => {
    const { userName, email, password } = req.body;

    try {
        const userDetails = await User.findOne({email});
        if (userDetails) {
            res.status(200).json({success: false, message: 'User already exists! Please Login'});
        } else {
            const hashPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                userName,
                email,
                password: hashPassword
            })
    
            await newUser.save();
            res.status(200).json({success: true, message: 'Registered Successfully!'});
        }

    } catch(error) {
        console.log('Error - ', error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

// Login
const loginUser = async(req, res) => {
    const { email, password } = req.body;

    try {
        const userDetails = await User.findOne({email: email})
        if (userDetails) {
            const passwordCheck = await bcrypt.compare(password, userDetails.password);
            
            if (passwordCheck) {
                const token = jwt.sign({
                    id: userDetails._id, role: userDetails.role, email: userDetails.email, userName: userDetails.userName
                }, 'CLIENT_SECRET_KEY', {expiresIn: '60m'});

                res.cookie('token', token, {httpOnly: true, secure: false}).json({
                    success: true, 
                    message: 'Login successful!',
                    user: {
                        email: userDetails.email,
                        id: userDetails._id,
                        role: userDetails.role,
                        userName: userDetails.userName
                    }
                });
            } else {
                res.status(200).json({success: false, message: "Invalid password!"})
            }
        } else {
            res.status(400).json({success: false, message: "User doesn't exist! Please register."});
        }
        // const comparedPassword = await bcrypt.compare(password)
    } catch(e) {
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

// logout
const logoutUser = async(req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'Logged out successfully'
    });
}

// auth middleware
const authMiddleWare = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user!'
        })
    }

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    } catch(error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized user!'
        });
    }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleWare }