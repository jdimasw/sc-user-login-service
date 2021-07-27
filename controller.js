const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const UserModel = require('./user-model'); 
const jwt = require('jsonwebtoken');

let tokenList = {};

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await UserModel.findOne({username});

        if(!user) {
            throw("User not found")
        }

        let token, refreshToken;

		let result = bcrypt.compareSync(password, user.password);

		if(result) {
            const paramsUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }

            token = jwt.sign(paramsUser, process.env.JWT_SECRET, { expiresIn: 60 });
            refreshToken = jwt.sign(paramsUser, process.env.JWT_REFRESH_TOKEN, { expiresIn: 60 * 60 });
        } else {
            throw("Password Incorrect");
        }

		res.status(200).json({ 
            "username": username, 
            "token": token, 
            "refreshToken": refreshToken
        });
	} catch(err) {
		res.status(401).json({ err });
	}
});

router.post('/refresh-token', async (req,res) => {
    try {
        const { refreshToken, username } = req.body;

        if(refreshToken) {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async function(err, decoded) {
                if (err) {
                    return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
                }

                const user = await UserModel.findOne({username});

                const paramsUser = {
                    username: user.username,
                    name: user.name,
                    role: user.role
                }

                const token = jwt.sign(paramsUser, process.env.JWT_SECRET, { expiresIn: 60 })
                const response = {
                    "token": token,
                }

                res.status(200).json(response); 
            });       
        } else {
            res.status(404).send('Invalid request')
        }
    } catch(err) {
        res.status(401).json({ err });
    }
})

module.exports = router;