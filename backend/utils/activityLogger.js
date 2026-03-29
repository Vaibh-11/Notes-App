const connection = require("../config/databaseConnection");

const logActivity = async (userId, noteId, action) => {
  try {
    const query =
      "INSERT INTO activity_logs (user_id, note_id, action) VALUES (?, ?, ?)";

    await connection.query(query, [userId, noteId, action]);
  } catch (err) {
    console.log("Activity log error:", err.message);
  }
};

module.exports = logActivity;
