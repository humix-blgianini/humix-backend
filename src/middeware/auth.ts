import { validateToken } from '@/utils/jwt'
import { Request, Response, NextFunction } from 'express'


export function authenticateJWT(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({error: 'token não fornecido ou inválido'})
        return
    }

    try {
        const token = authHeader.split(' ')[1]
        const decoded = validateToken(token) as {id: string, email: string, senha: string, username: string}
        req.user = decoded
        next()
    } catch (e) {
        res.status(403).json({ error: 'Token inválido ou expirado!' }) 
        return
    }
}