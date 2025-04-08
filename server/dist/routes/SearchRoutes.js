"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SearchController_1 = require("../controllers/SearchController");
const router = (0, express_1.Router)();
router.get("/search", SearchController_1.searchSong);
exports.default = router;
