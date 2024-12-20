require("dotenv").config()

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

export async function getSpotifyAuthToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
  
    const data = await response.json();
    return data.access_token;
    
}

export async function searchAlbum(name: String, banda: String) {
    const token = await getSpotifyAuthToken()

    const response = await fetch(`https://api.spotify.com/v1/search?q=${name}${banda}&type=album&limit=1`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json()

    return data.albums.items[0]
}

export async function getAlbumTrack(uri: String) {
    const token = await getSpotifyAuthToken()

    const albumId = uri.includes("spotify:album:") ? uri.split("spotify:album:")[1] : uri;

    const response = await fetch(` https://api.spotify.com/v1/albums/${albumId}/tracks`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json()

    return data
}

export async function getBandImage(id: String){
    const token = await getSpotifyAuthToken()

    const response = await fetch(` https://api.spotify.com/v1/artists/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json()

    return data
}