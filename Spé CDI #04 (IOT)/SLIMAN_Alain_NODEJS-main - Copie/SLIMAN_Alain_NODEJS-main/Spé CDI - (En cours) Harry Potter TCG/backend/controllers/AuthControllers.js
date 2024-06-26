import { PrismaClient } from '@prisma/client';
import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();



const signUp = async (req, res) => {
    const { email, pseudo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
    prisma.user.create({
            data: {
                email: email,
                pseudo: pseudo,
                password: hashedPassword,
            },
        })
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user
        .findUnique({
            where: {
                email,
            },
        })
        
            if (!user) {
                return res.status(404).json({ message: 'No user found' });
            }
            const valid =await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(404).json({ message: 'Invalid password' });
            }
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });
            res.json( token );
        }
        


export { signUp, login };
