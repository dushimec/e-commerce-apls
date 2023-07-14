const express = require("express");
const {
  createUser,
  loginUserCtl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handelerRefreshToken,
  logout,

} = require("../controllers/userCtl");
const { authMiddleware,isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("hi");
});

router.post("/register", createUser);
router.post("/login", loginUserCtl);
router.get("/all-users", getallUser);
router.get("/:id", getaUser);
router.get("/refresh",handelerRefreshToken);
router.get("/logout",logout);
router.delete("/:id", authMiddleware,isAdmin, deleteaUser);
router.put("/edit-user",authMiddleware, updatedUser);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser);



module.exports = router;
