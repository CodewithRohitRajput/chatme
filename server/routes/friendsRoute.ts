import { Router } from "express";
import { allUsers, sendRequest, incomingRequest, acceptORreject, frndList, removeFriend } from "../controllers/friendsController.js";
import { requireAuth } from "../middleware.js";

const router = Router();

router.get("/", requireAuth, allUsers);
router.post("/request/:id", requireAuth, sendRequest);
router.get("/requests/incoming", requireAuth, incomingRequest);
router.patch("/requests/:id", requireAuth, acceptORreject);
router.get('/allFriends', requireAuth, frndList);
router.patch("/remove", requireAuth, removeFriend)

export default router;