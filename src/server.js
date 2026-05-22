const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const sequelize = require('./config/database');
const User = require('./models/User');
const GradeState = require('./models/GradeState');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc.' });
        }

        const cleanUsername = String(username).trim().toLowerCase();
        if (cleanUsername.length < 3 || cleanUsername.length > 30) {
            return res.status(400).json({ message: 'Tên đăng nhập phải từ 3 đến 30 ký tự.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự trở lên.' });
        }

        // Check user existence
        const existingUser = await User.findOne({ where: { username: cleanUsername } });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập này đã tồn tại.' });
        }

        // Create new user
        const user = await User.create({ username: cleanUsername, password });
        
        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        
        res.status(201).json({
            message: 'Đăng ký tài khoản thành công.',
            token,
            username: user.username
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký tài khoản.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc.' });
        }

        const cleanUsername = String(username).trim().toLowerCase();
        const user = await User.findOne({ where: { username: cleanUsername } });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Đăng nhập thành công.',
            token,
            username: user.username
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập.' });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    res.json({ username: req.user.username });
});

// Grades Syncing Routes
app.get('/api/grades', authMiddleware, async (req, res) => {
    try {
        const gradeState = await GradeState.findOne({ where: { userId: req.user.id } });
        if (!gradeState) {
            return res.json({ stateData: null });
        }
        res.json({ stateData: JSON.parse(gradeState.stateData) });
    } catch (error) {
        console.error('Fetch grades error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi tải điểm.' });
    }
});

app.post('/api/grades', authMiddleware, async (req, res) => {
    try {
        const { stateData } = req.body;
        if (!stateData) {
            return res.status(400).json({ message: 'Dữ liệu lưu trữ rỗng.' });
        }

        const serializedData = JSON.stringify(stateData);

        let gradeState = await GradeState.findOne({ where: { userId: req.user.id } });
        if (gradeState) {
            gradeState.stateData = serializedData;
            await gradeState.save();
        } else {
            gradeState = await GradeState.create({
                userId: req.user.id,
                stateData: serializedData
            });
        }

        res.json({ message: 'Đã đồng bộ điểm số lên hệ thống.' });
    } catch (error) {
        console.error('Save grades error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lưu điểm.' });
    }
});

app.post('/api/grades/reset', authMiddleware, async (req, res) => {
    try {
        await GradeState.destroy({ where: { userId: req.user.id } });
        res.json({ message: 'Đã xóa dữ liệu điểm lưu trữ trên đám mây.' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại điểm.' });
    }
});

// Catch-all to serve static index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Database Sync and Server Listen
sequelize.sync().then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
