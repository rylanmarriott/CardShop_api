const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const passwordSchema = require("../config/passwordPolicy");

const prisma = new PrismaClient();

const signup = async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    // Validate input fields
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const passwordValidationErrors = passwordSchema.validate(password, { list: true });

    if (passwordValidationErrors.length > 0) {
        const errorMessages = passwordValidationErrors.map((error) => {
            switch (error) {
                case "min":
                    return "Password must be at least 8 characters long";
                case "uppercase":
                    return "Password must have at least one uppercase letter";
                case "lowercase":
                    return "Password must have at least one lowercase letter";
                case "digits":
                    return "Password must have at least one number";
            }
        });

        return res.status(400).json({
            message: "Password does not meet the required policy",
            errors: errorMessages,
        })
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
        if (!req.session.user) {
            return res.status(401).json({ message: "No active session to log out" });
        }
        
        req.session.destroy((err) => {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Failed to log out" });
        })
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
        

        res.status(200).json({
            customer_id: req.session.user.customer_id,
            email: req.session.user.email,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login, logout, getSession };
