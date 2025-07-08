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

export const userLogin = async(req, res ) => {
    const {email, password} = req.body;
    try{
        const foundData = await User.findOne({email});
        if(!foundData) {
            return res.status(401).json({
                message: "User not found.",

            })
        }
        const comaparison = await bcrypt.compare(password, foundData.password);
        if(!comaparison) {
            return res.status(400).json({
                message: "Wrong credentials."
            })
        }

        const token = jwt.sign({
            _id: user._id, role: user.role
        }, process.env.JWT_SECRET);

        res.json({
            user,
            token
        })

    }catch(e) {
        res.status(500).json({
            message: "Login failed",
            error: e
        })
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorzed" });
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) 
            return res.status(401).json({ error: "Unauthorized" });
        });
        res.json({ message: "Logout successfully" });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};


export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body;
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ eeor: "Forbidden" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "User not found" });

        await User.updateOne(
            { email },
            { skills: skills.length ? skills : user.skills, role }
        );
        return res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const users = await User.find().select("-password");
        return res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Update failed", details: error.message });
    }
};