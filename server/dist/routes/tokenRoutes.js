"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tokenController_1 = require("../controllers/tokenController");
const router = (0, express_1.Router)();
router.get("/token", tokenController_1.getToeken);
router.post("/token", tokenController_1.postSongs);
exports.default = router;
