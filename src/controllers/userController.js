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
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the user by email
        const user = await prisma.customer.findUnique({
            where: { email },
        });

        if (!user) {
            // If user doesn't exist, return 404
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // If the password is invalid, return 401
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.user = {
            customer_id: user.customer_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        };

        // If successful, return the user's email
        res.status(200).json({ message: "Login successful", user: req.session.user });
    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ message: "Internal server error" });
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
        if (!req.session.user) {
            return res.status(401).json({ message: "No active session"});
        }
        

        res.status(200).json({ session: { user: req.session.user } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login, logout, getSession };
