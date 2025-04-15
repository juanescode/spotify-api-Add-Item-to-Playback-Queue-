import { Router } from "express";
import { getToeken, postSongs } from "../controllers/tokenController";

const router = Router();

router.get("/token", getToeken);
router.post("/token", postSongs);

export default router;