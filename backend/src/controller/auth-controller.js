const User = require("../models/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//RegisterUser

const registerUser = async(req, res) => {
    try{
        //extract user info from the body
        const {username, password} = req.body;

        //check if the username already exists in the db
        const checkUser = await User.findOne({username});
        if(checkUser) {
            return res.status(404).json({
                success : false,
                message : "User already exists!"
            })
        }

        //hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //create a new user and save it

        const newUser = new User({
            username,
            password : hashedPassword
        })

        await newUser.save();

        if(newUser){
            res.status(201).json({
                success : true,
                message : "User registered successfully!"
            })
        } else {
            res.status(400).json({
                success : false,
                message : "unable to register the user!"
            })
        }


    } catch (e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some error occured during Registration"
        })
        
    }
}

const loginUser = async(req, res) => {
    try {

        const {username, password} = req.body;

        //checking whether the current user is already registered
        const user = await User.findOne({username})

        //if user is invalid
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid Username or Password"
            })
        }

        //checking password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : '30m'
        })

        res.status(200).json({
            success : true,
            message : "logged in successfully",
            accessToken
        })


    } catch (e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "some error occured while logging in!"
        })
    }
}

module.exports - { registerUser, loginUser}