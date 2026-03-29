import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Shimmer from "./Shimmer";
import api from "../utils/axios";
import socket from "../utils/socket";

const Home = ({}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const joinedRef = useRef(false);

  useEffect(() => {
    checkUserAndFetch();
  }, []);

  const checkUserAndFetch = async () => {
    try {
      const user = await api.get("/user/getLogInUser", {
        withCredentials: true,
      });

      setUserData(user.data);

      const response = await api.get("/notes/getAllNotes", {
        withCredentials: true,
      });

      setNotes(response.data);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notes.length && !joinedRef.current) {
      notes.forEach((note) => {
        socket.emit("join_note", note.id);
      });
      joinedRef.current = true;
    }
  }, [notes]);

  useEffect(() => {
    socket.on("receive_edit", ({ noteId, content }) => {
      console.log("📥 Received update:", noteId);

      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? { ...note, content } : note)),
      );
    });

    return () => socket.off("receive_edit");
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/delete/${id}`, {
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(
        `/notes/edit/${id}`,
        {
          title: editTitle,
          content: editContent,
        },
        { withCredentials: true },
      );

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, title: editTitle, content: editContent }
            : note,
        ),
      );

      setEditingNote(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (loading) return <Shimmer />;

  return (
    <div className="mt-5 mx-2 flex flex-wrap gap-4">
      {notes.map((note) => (
        <div key={note.id} className="card bg-base-300 w-96 shadow-sm">
          <div className="card-body">
            {editingNote?.id === note.id ? (
              <>
                <input
                  className="input w-full mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <textarea
                  className="textarea w-full mb-2"
                  value={editContent}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditContent(value);

                    clearTimeout(timeoutRef.current);

                    timeoutRef.current = setTimeout(() => {
                      if (editingNote) {
                        socket.emit("edit_note", {
                          noteId: editingNote.id,
                          content: value,
                        });
                      }
                    }, 300);
                  }}
                />

                <button
                  onClick={() => handleUpdate(note.id)}
                  className="btn btn-success"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingNote(null)}
                  className="btn ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="card-title">{note.title}</h2>
                <p>{note.content}</p>
                <p className="text-sm text-gray-400">By: {note.created_by}</p>
              </>
            )}
          </div>

          <div className="p-3 flex gap-2">
            {(userData?.role === "admin" || userData?.id === note.owner_id) && (
              <button
                onClick={() => handleDelete(note.id)}
                className="btn btn-error"
              >
                Delete
              </button>
            )}

            {(userData?.role === "admin" ||
              userData?.role === "editor" ||
              note.collaborator_role === "editor" ||
              userData?.id === note.owner_id) && (
              <button
                onClick={() => handleEditClick(note)}
                className="btn btn-primary"
              >
                Edit
              </button>
            )}

            {userData?.id === note.owner_id && (
              <div>
                <button
                  onClick={() => navigate(`/addCollaborator/${note.id}`)}
                  className="btn btn-secondary"
                >
                  Add Collab
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await api.post(
                        `/notes/share/${note.id}`,
                        {},
                        { withCredentials: true },
                      );

                      navigator.clipboard.writeText(res.data.link);
                      alert("Link copied!");
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                  className="btn btn-accent"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
