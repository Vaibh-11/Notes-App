module.exports.getActivityLogs = async (req, res) => {
  try {
    const { noteId } = req.params;

    const query = `
      SELECT 
        a.action,
        a.created_at,
        u.name
      FROM activity_logs a
      JOIN users u ON a.user_id = u.id
      WHERE a.note_id = ?
      ORDER BY a.created_at DESC
    `;

    const [result] = await connection.query(query, [noteId]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
