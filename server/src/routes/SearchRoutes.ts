import { Router } from "express";
import { searchSong } from "../controllers/SearchController";

const router = Router();

router.get("/search", searchSong);

export default router;