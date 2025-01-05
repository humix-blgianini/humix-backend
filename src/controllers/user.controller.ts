import { authenticateJWT } from '@/middeware/auth'
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
        res.send(400)
        return
    }

    const hash_senha = await bcrypt.compare(senha, user.senha)

    if(!hash_senha){
        res.send(400)
        return
    }

    const accessToken = generateToken({id: user.id, email: user.email, senha: user.senha, username: user.usuario})
    res.send({token: accessToken})
})

userRoute.get('/albums', authenticateJWT, async (req: Request, res: Response) => {
    const userId = req.user?.id

    const albums = await prisma.album.findMany({
        where: {
            users: { 
                some: {
                    id: userId, 
                },
            },
            ratings: {
                none: {
                    userId: userId,
                    nota: { gt: 0 }
                }
            }
    
        },
        include: {
            banda: true, 
            songs: true,
            ratings: {
                where: {
                    userId: userId, 
                }
                
            }
        }    
    })

    res.send(albums)
})

userRoute.get('/albums/rated', authenticateJWT, async (req: Request, res: Response) => {
    const userId = req.user?.id

    const albums = await prisma.album.findMany({
        where: {
            users: { 
                some: {
                    id: userId, 
                },
            },
            ratings: {
                some: {
                    userId: userId,
                    nota: {gt: 0}
                }
            }
        },
        include: {
            banda: true, 
            songs: true,
            ratings: {
                where: {
                    userId: userId, 
                }
                
            }
        }    
    })

    res.send(albums)
})

userRoute.patch('/album/:id', authenticateJWT, async (req: Request, res: Response) => {
    const userId = req.user?.id
    const albumId = parseInt(req.params.id, 10)

    const { nota } = req.body

    const temNota = await prisma.rating.findUnique({
        where: {
            userId_albumId: {userId, albumId}
        }
    })

    let nota_res

    if (temNota) {
        // Se já existe, atualiza a nota
        nota_res = await prisma.rating.update({
          where: {
            userId_albumId: { userId, albumId },
          },
          data: {
            nota: nota,
            dateRated: new Date()
          },
        })
      } else {
        // Se não existe, cria uma nova avaliação
        nota_res = await prisma.rating.create({
          data: {
            nota: nota,
            userId: userId,
            albumId: albumId,
          },
        })
      }
    
      res.send({message: nota_res})
})

userRoute.get('/albums/by_date', authenticateJWT, async (req: Request, res: Response) => {
    const userId = req.user?.id

    const albums = await prisma.album.findMany({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
          ratings: {
            some: {
              userId: userId,
              nota: { gt: 0 },
              dateRated: { not: null },
            },
          },
        },
        include: {
          banda: true,
          songs: true,
          ratings: {
            where: {
              userId: userId,
            },
          },
        },
      });

      const sortedAlbums = albums.sort((a, b) => {
        const dateA = a.ratings[0]?.dateRated ? new Date(a.ratings[0]?.dateRated) : new Date(0);
        const dateB = b.ratings[0]?.dateRated ? new Date(b.ratings[0]?.dateRated) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      });
  
      res.status(200).json(sortedAlbums);
  
  

})