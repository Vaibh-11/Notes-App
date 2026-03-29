const connection = require("../config/databaseConnection");
const logActivity = require("../utils/activityLogger");
const crypto = require("crypto");

module.exports.getAllNotes = async (req, res) => {
  try {
    const query = `
  SELECT 
  n.*,
  u.name AS created_by,
  nc.role AS collaborator_role
FROM notes_table n
LEFT JOIN users u 
  ON n.owner_id = u.id
LEFT JOIN note_collaborators nc 
  ON n.id = nc.note_id AND nc.user_id = ?
`;

    const [notes] = await connection.query(query, [req.user.id]);

    res.json(notes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.createNotes = async (req, res) => {
  const { title, content } = req.body;

  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Please login" });
    }

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const insert =
      "Insert into notes_table (title,content,owner_id) values (?,?,?)";
    const [result] = await connection.query(insert, [title, content, userId]);
    await logActivity(req.user.id, noteId, "CREATE");
    res.json({ message: "Data added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.editNotes = async (req, res) => {
  const { title, content } = req.body;
  const { notes_id } = req.params;
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!userId) {
      return res.status(400).json({ message: "Please login" });
    }

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const findById = "select * from notes_table where id=?";
    const [find] = await connection.query(findById, [notes_id]);

    const ownerId = find[0];

    const collabUserRoleQuery =
      "SELECT role from note_collaborators WHERE user_id = ? AND note_id = ?";

    const [collabResult] = await connection.query(collabUserRoleQuery, [
      userId,
      notes_id,
    ]);

    const collabUserRole = collabResult[0]?.role;
    console.log(collabResult);

    if (
      userId === ownerId.owner_id ||
      userRole === "editor" ||
      userRole === "admin" ||
      collabUserRole.role === "editor"
    ) {
      const update =
        "update notes_table set title = ? , content = ? where id=?";
      const [result] = await connection.query(update, [
        title,
        content,
        notes_id,
      ]);
    } else {
      return res.status(400).json({
        message: "Only owner,editor and admin can edit the note",
      });
    }
    await logActivity(req.user.id, notes_id, "UPDATE");

    res.status(200).json({ message: "Edited successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.deleteNotes = async (req, res) => {
  const { notes_id } = req.params;

  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const findById = "Select * from notes_table where id=?";

    const [result] = await connection.query(findById, [notes_id]);

    if (!result.length) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const ownerId = result[0];

    if (userId === ownerId.owner_id || userRole === "admin") {
      const deleteNote = "delete from notes_table where id = ?";

      const [answer] = await connection.query(deleteNote, [notes_id]);
    } else {
      return res.status(400).json({
        message: "Only owner and admin can delete the note",
      });
    }
    await logActivity(req.user.id, notes_id, "DELETE");
    res.json({ message: "Post Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.addCollaborator = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const { noteId } = req.params;
    const loggedInUser = req.user;

    const checkOwner = "Select * from notes_table where id = ?";

    const [result] = await connection.query(checkOwner, [noteId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    const note = result[0];

    if (note.owner_id !== loggedInUser.id) {
      return res
        .status(400)
        .json({ message: "Only Owner of Notes can add collaborators" });
    }

    const addCollab =
      "Insert into note_collaborators (note_id,user_id,role) values (?,?,?)";

    await connection.query(addCollab, [noteId, userId, role]);

    res.status(200).json({
      message: "Collaborator added successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.removeCollaborator = async (req, res) => {
  try {
    const { noteId, userId } = req.params;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({ message: "Please login!!" });
    }

    const [result] = await connection.query(
      "SELECT * FROM notes_table WHERE id = ?",
      [noteId],
    );

    if (!result.length) {
      return res.status(404).json({ message: "Note not found" });
    }

    const note = result[0];

    if (note.owner_id !== loggedInUser.id) {
      return res.status(403).json({
        message: "Only Owner can remove collaborators",
      });
    }

    await connection.query(
      "DELETE FROM note_collaborators WHERE note_id = ? AND user_id = ?",
      [noteId, userId],
    );

    res.json({ message: "Collaborator removed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getCollaborators = async (req, res) => {
  const { notes_id } = req.params;

  try {
    const query = `
      SELECT 
        nc.user_id,
        nc.role,
        u.name,
        u.email
      FROM note_collaborators nc
      JOIN users u ON nc.user_id = u.id
      WHERE nc.note_id = ?
    `;

    const [result] = await connection.query(query, [notes_id]);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error fetching collaborators",
    });
  }
};

module.exports.getCollaboratorRole = async (req, res) => {
  const query = `
  select 
    n.*,
    nc.role as collaborator_role
  from notes_table n
  left join note_collaborators nc
    on n.id = nc.note_id and nc.user_id = ?
`;

  const [notes] = await connection.query(query, [req.user.id]);

  res.json(notes);
};

module.exports.searchNotes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query required" });
    }

    const searchQuery = `
      SELECT 
        n.id,
        n.title,
        n.content,
        n.owner_id,
        u.name AS created_by
      FROM notes_table n
      JOIN users u ON n.owner_id = u.id
      WHERE n.title LIKE ? OR n.content LIKE ?
      ORDER BY n.id DESC
    `;

    const value = `%${query}%`;

    const [result] = await connection.query(searchQuery, [value, value]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.generateShareLink = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    console.log(noteId, userId);

    const [result] = await connection.query(
      "SELECT * FROM notes_table WHERE id = ?",
      [noteId],
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    const note = result[0];

    if (note.owner_id !== userId) {
      return res.status(403).json({ message: "Only owner can share" });
    }

    const token = crypto.randomBytes(16).toString("hex");

    await connection.query(
      "UPDATE notes_table SET public_link = ?, isPublic = TRUE WHERE id = ?",
      [token, noteId],
    );

    await logActivity(userId, noteId, "SHARE");

    res.json({
      link: `http://localhost:5173/public/note/${token}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getPublicNote = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(token);

    const [result] = await connection.query(
      `SELECT n.title, n.content, u.name AS created_by
       FROM notes_table n
       JOIN users u ON n.owner_id = u.id
       WHERE n.public_link = ? AND n.isPublic = TRUE`,
      [token],
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Invalid link" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
