import { Router } from "express";
import { getToeken, postSongs } from "../controllers/tokenController";

const router = Router();

router.get("/api", getToeken);
router.post("/token", postSongs);

export default router;