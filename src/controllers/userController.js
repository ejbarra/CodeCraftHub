const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Register a new user
exports.registerUser = async (req, res) => {
    console.log('=== REGISTER USER CALLED ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Raw body:', req.rawBody);
    
    const { username, email, password } = req.body;
    
    console.log('Destructured:', { username, email, password: password ? '***' : undefined });
    
    // Validación básica
    if (!username || !email || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ 
            error: 'Missing required fields',
            received: { username: !!username, email: !!email, password: !!password }
        });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        console.log('User created successfully');
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Registration failed.', details: error.message });
    }
};
// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
};