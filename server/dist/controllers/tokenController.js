"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSongs = exports.getToeken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const getToeken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = req.query.code;
    const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
    //https://accounts.spotify.com/authorize?client_id=<YOUR_CLIENT_ID>&response_type=code&redirect_uri=<YOUR_REDIRECT_URI>&scope=user-modify-playback-state%20user-read-playback-state
    try {
        const response = yield axios_1.default.post("https://accounts.spotify.com/api/token", new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:3001/api/token", //YOUR_REDIRECT_URI
        }), {
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log("✅ REFRESH TOKEN:", response.data.refresh_token);
        return res.json(response.data);
    }
    catch (error) {
        console.error("❌ Error en /callback:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).json({ error: "Error al obtener el token de Spotify" });
    }
});
exports.getToeken = getToeken;
const postSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { uri } = req.body;
    if (!uri) {
        return res.status(400).json({ error: "Falta el URI de la canción" });
    }
    const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
    try {
        const tokenRes = yield axios_1.default.post("https://accounts.spotify.com/api/token", new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken || "",
        }), {
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const accessToken = tokenRes.data.access_token;
        if (!accessToken) {
            return res.status(500).json({ error: "No se pudo obtener el access_token" });
        }
        const queueRes = yield axios_1.default.post(`https://api.spotify.com/v1/me/player/queue`, null, {
            params: { uri },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.json({ message: "🎵 Canción agregada correctamente a la cola" });
    }
    catch (error) {
        console.error("❌ Error al agregar a la cola:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        return res.status(500).json({ error: "No se pudo agregar la canción a la cola" });
    }
});
exports.postSongs = postSongs;
