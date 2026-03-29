const setupSocket = (io, connection) => {
  io.on("connection", (socket) => {
    socket.on("join_note", (noteId) => {
      socket.join(noteId);
      console.log(`User joined note room: ${noteId}`);
    });

    socket.on("edit_note", async ({ noteId, content }) => {
      try {
        console.log("✏️ Editing note:", noteId);

        if (!noteId || content === undefined) {
          console.log("Invalid data:", { noteId, content });
          return;
        }

        await connection.query(
          "UPDATE notes_table SET content = ? WHERE id = ?",
          [content, noteId],
        );

        const data = { noteId, content };

        console.log("Sending:", data);

        socket.to(noteId).emit("receive_edit", data);
      } catch (err) {
        console.error("Socket error:", err.message);
      }
    });

    socket.on("typing", (noteId) => {
      socket.to(noteId).emit("user_typing", noteId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = setupSocket;
