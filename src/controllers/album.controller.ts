import { authenticateJWT } from '@/middeware/auth'
import { getAlbumTrack, getBandImage, searchAlbum } from '@/utils/clientSpotify'
import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'

export const albumRoute = express.Router()
const prisma = new PrismaClient()

albumRoute.post('/', authenticateJWT, async (req: Request, res: Response) => {
    const { nome, banda } = req.body

    const album = await searchAlbum(nome, banda)

    const userId = req.user?.id

    const album_nome = album.name
    const album_link = album.uri
    const album_art = album.images[0].url

    const banda_nome = album.artists[0].name
    const banda_image = await getBandImage(album.artists[0].id)

    const trackData = await getAlbumTrack(album.uri)
    const songs = trackData.items

    const songCreationData = songs.map((song: { name: string }) => ({
        name: song.name,
        link: "a",
    }))

    
    try {

        const existingAlbum = await prisma.album.findUnique({
            where: { link: album_link },
        })

        
        const band = await prisma.banda.upsert({
            where: { nome: banda_nome },
            update: { foto: banda_image.images[0].url },
            create: {
                nome: banda_nome,
                foto: banda_image.images[0].url,
            }
        })

        let album;
        if (existingAlbum) {
            // Se o álbum já existir, apenas o associa ao usuário
            album = await prisma.album.update({
                where: { link: album_link },
                data: {
                    users: {
                        connect: { id: userId }, // Conecta o usuário ao álbum
                    },
                },
            })
        } else {
    
        const album = await prisma.album.create({
            data: {
                nome: album_nome,
                link: album_link,
                capa: album_art,
                nota: 0.0,
                banda: {
                    connect: { id: band.id },
                },
                songs: {
                    create: songCreationData,
                },
                users: {
                    connect: { id: userId }
                }
            },
            include: {
                banda: true,
                songs: true,
                users: true,
            }
        })

    }

        res.json(album)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error creating album and band' });
    }
})