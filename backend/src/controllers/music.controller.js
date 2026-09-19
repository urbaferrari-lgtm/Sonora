const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");

async function createMusic(req, res) {
    const title = req.body?.title?.trim();
    const file = req.file;

    if (!title) {
        return res.status(400).json({ message: "Track title is required" });
    }
    if (!file) {
        return res.status(400).json({ message: "Music file is required" });
    }

    try {
        const result = await uploadFile(file.buffer.toString("base64"));
        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user._id,
        });

        return res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to upload music", error: err.message });
    }
}

async function createAlbum(req, res) {
    try {
        const { title, musics = [] } = req.body || {};
        if (!title?.trim()) {
            return res.status(400).json({ message: "Album title is required" });
        }
        if (!Array.isArray(musics)) {
            return res.status(400).json({ message: "musics must be an array of music IDs" });
        }
        const album = await albumModel.create({
            title: title.trim(),
            artist: req.user._id,
            musics,
        });

        return res.status(201).json({
            message: "Album created succesfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                music: album.musics,
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create album", error: err.message });
    }
}

async function getAllMusics(req,res){
    try {
        const musics = await musicModel.find().sort({ createdAt: -1 }).populate("artist", "username email");
        return res.status(200).json({ message:"Music Fetched successfully", musics });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch music", error: err.message });
    }
}

async function getAllAlbum(req,res){
    try {
        const albums = await albumModel.find().select("title artist").populate("artist", "username");

        return res.status(200).json({
            message: "Albums fetched succesfully",
            albums: albums,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch albums", error: err.message });
    }
}

async function getAlbumById(req, res) {
    try {
        const { albumId } = req.params;
        const album = await albumModel.findById(albumId).populate("artist", "username");

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        return res.status(200).json({
            message: "Album fetched successfully",
            album: album,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch album", error: err.message });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbum, getAlbumById };