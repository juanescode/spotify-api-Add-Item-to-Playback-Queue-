import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getToeken = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://test-viking.netlify.app/api/callback",
      }),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ REFRESH TOKEN:", response.data.refresh_token);
    return res.json(response.data);
  } catch (error: any) {
    console.error("❌ Error en /callback:", error.response?.data || error.message);
    return res.status(500).json({ error: "Error al obtener el token de Spotify" });
  }
}

export const postSongs = async (req: Request, res: Response) => {
  const { uri } = req.body;

  if (!uri) {
    return res.status(400).json({ error: "Falta el URI de la canción" });
  }

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken || "",
      }),
      {
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      return res.status(500).json({ error: "No se pudo obtener el access_token" });
    }

    const queueRes = await axios.post(
      `https://api.spotify.com/v1/me/player/queue`,
      null,
      {
        params: { uri },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.json({ message: "🎵 Canción agregada correctamente a la cola" });
  } catch (error: any) {
    console.error("❌ Error al agregar a la cola:", error.response?.data || error.message);
    return res.status(500).json({ error: "No se pudo agregar la canción a la cola" });
  }
}
