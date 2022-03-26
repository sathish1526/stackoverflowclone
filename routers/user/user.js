const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const { profile , postQuestions ,postAnswer} = require("../../controller/user/user")


router.get("/profile", auth , profile);
// router.get("/questions",auth,getQuestions);
// router.get("/myQuestions",questions);
router.post("/questions",auth, postQuestions);
router.post("/answer",auth, postAnswer);
// router.put("/questions",auth,questions);
// router.delete("/questions",auth,questions);



module.exports = router;