const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const signup = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    // Validate input fields
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the email already exists
        const existingUser = await prisma.customer.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const newUser = await prisma.customer.create({
            data: {
                email,
                password: hashedPassword,
                first_name,
                last_name,
            },
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Authenticate user 
        // Simulate session creation
        
        res.status(200).json({ message: "User logged in successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const logout = async (req, res) => {
    try {
        // Simulate destroying a session
        

        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSession = async (req, res) => {
    try {
        // Simulate getting a session
        

        res.status(200).json({ session: { username: "test_user" } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login, logout, getSession };
