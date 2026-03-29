const express = require("express");
const { userAuth } = require("../middleware/authentication");
const {
  createNotes,
  editNotes,
  deleteNotes,
  addCollaborator,
  removeCollaborator,
  getAllNotes,
  getCollaborators,
  getCollaboratorRole,
  searchNotes,
  generateShareLink,
  getPublicNote,
} = require("../controllers/notes");
const router = express.Router();

router.route("/getAllNotes").get(userAuth, getAllNotes);
router.route("/create").post(userAuth, createNotes);
router.route("/edit/:notes_id").put(userAuth, editNotes);
router.route("/delete/:notes_id").delete(userAuth, deleteNotes);
router.route("/addCollaborator/:noteId").post(userAuth, addCollaborator);
router
  .route("/removeCollaborator/:noteId/:userId")
  .delete(userAuth, removeCollaborator);
router.route("/getCollaborators/:notes_id").get(userAuth, getCollaborators);
router.route("/getCollaboratorRole").get(userAuth, getCollaboratorRole);
router.route("/searchNotes").get(userAuth, searchNotes);
router.route("/share/:noteId").post(userAuth, generateShareLink);
router.route("/public/:token").get(getPublicNote);
module.exports = router;
