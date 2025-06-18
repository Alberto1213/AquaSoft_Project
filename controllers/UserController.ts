import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Model } from 'sequelize';

interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role_id: number;
}

const login = async (req: any, res: any) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } }) as (Model & IUser) | null;

        if (!user) {
        return res.status(401).json({ message: 'The email or password is incorrect' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
        return res.status(401).json({ message: 'The email or password is incorrect' });
        }

        const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role_id },
        'supersecret',
        { expiresIn: '1h' }
        );

        res.json({
        message: 'Succes',
        token
        });

    } catch (err: any) {
        res.status(500).json({ message: 'Loggin error', error: err.message });
    }
};

const register = async (req: any, res: any) => {
    const { username, email, password } = req.body;

    try {
        const exists = await User.findOne({
            where: { email }
        });

        if (exists) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        })as (Model & IUser) | null

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser?.id,
                username: newUser?.username,
                email: newUser?.email,
            }
        });

    } catch (err: any) {
        res.status(500).json({ message: 'Error registering user', error: err.message});
    }
};

const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role_id']
        });
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

const deleteUser = async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });

    } catch (err: any) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
}

const updateUser = async (req: any, res: any) => {
    const { id } = req.params;
    const { username, email, role_id } = req.body;

    try {
        const user = await User.findByPk(id) as (Model & IUser) | null;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role_id = role_id || user.role_id;

        await user.save();
        res.json({ message: 'User updated successfully', user });

    } catch (err: any) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};
export default {login, register, updateUser, deleteUser, getAllUsers};