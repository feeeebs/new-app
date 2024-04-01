// Probably not needed as a separate function, but keeping it for now
export default async function FetchAlbumArtFromS3(albumArtKey) {
    try {
        //const response = await fetch(`https://standom-album-art.s3.us-east-2.amazonaws.com/${albumArtKey}`);
        const s3Url = `https://standom-album-art.s3.us-east-2.amazonaws.com/${albumArtKey}`;
    return s3Url;
    } catch (error) {
        console.error('Error fetching album art from S3: ', error)
        return null;
    }
}
