import dotenv from 'dotenv'
dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

export async function generateAuthToken(){
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    })

    const data = await response.json()
    return data.access_token
}

export async function pesquisarAlbum(nome: String, banda: String){
    const token = await generateAuthToken()

    const response = await fetch(`https://api.spotify.com/v1/search?q=${nome}${banda}&type=album&limit=1`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json()
    return data.albums.items[0]
}

export async function getAlbumTracks(uri: String) {
    const token = await generateAuthToken()
    const albumId = uri.includes("spotify:album") ? uri.split("spotify:album")[1] : uri

    const response = await fetch(` https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json()
    return data
}

export async function getBandaImage(id: String){
    const token = await generateAuthToken()

    const response = await fetch(` https://api.spotify.com/v1/artists/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json()
    return data
}