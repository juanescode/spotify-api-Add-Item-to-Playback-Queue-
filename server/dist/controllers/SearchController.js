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
exports.searchSong = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const searchSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Falta el término de búsqueda" });
    }
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
    const authString = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    try {
        const tokenRes = yield axios_1.default.post("https://accounts.spotify.com/api/token", new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }), {
            headers: {
                Authorization: `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const accessToken = tokenRes.data.access_token;
        const searchRes = yield axios_1.default.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                q: query,
                type: "track",
                limit: 8,
            },
        });
        return res.json(searchRes.data);
    }
    catch (error) {
        console.error("Error al buscar en Spotify:", error);
        return res
            .status(500)
            .json({ error: "Error al buscar canciones en Spotify" });
    }
});
exports.searchSong = searchSong;
