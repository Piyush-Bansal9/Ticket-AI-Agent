import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"
import { inngest } from "../inngest/client.js"

export const userSignup = async(req, res) => {
    const {email, password, skills = []} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({email, password: hashedPassword, skills});
        await inngest.send({
            name: "user/signup",
            data: {
                email
            }
        })
        const token = jwt.sign({
            _id: user._id, role: user.role
        }, process.env.JWT_SECRET);

        res.json({
            user,
            token
        })

    } catch (e) {
        res.status(500).json({
            message: "Singup failed",
            error: e
        })
    }
}