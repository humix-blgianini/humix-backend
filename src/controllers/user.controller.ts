import { generateToken } from '@/utils/jwt'
import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
const bcrypt = require('bcrypt')

export const userRoute = express.Router()
const prisma = new PrismaClient()

userRoute.post('/registrar', async (req: Request, res: Response) => {
    const { usuario, email, senha } = req.body

    const hash_senha = await bcrypt.hash(senha, 10)

    const user = await prisma.user.create({
        data: {usuario, email, senha: hash_senha}
    })

    res.send({message: "usuário criado"})
})

userRoute.post('/login', async (req: Request, res: Response) => {
    const { email, senha } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user){
        res.send({message: "usuário não encontrado"})
        return
    }

    const hash_senha = await bcrypt.compare(senha, user.senha)

    if(!hash_senha){
        res.send({message: "senha incorreta"})
        return
    }

    const accessToken = generateToken({id: user.id, email: user.email, senha: user.senha})
    res.send({token: accessToken})
})