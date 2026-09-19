const ImageKit = require("@imagekit/nodejs");

let imageKitClient;

function getImageKitClient() {
    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
        throw new Error("Image storage is not configured");
    }
    if (!imageKitClient) {
        imageKitClient = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
    }
    return imageKitClient;
}

async function uploadFile(file) {
    const result = await getImageKitClient().files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "spotify/music",
    });
    return result;
}

module.exports = { uploadFile };