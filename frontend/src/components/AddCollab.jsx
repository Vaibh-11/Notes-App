import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { useParams } from "react-router-dom";

const AddCollab = () => {
  const [users, setUsers] = useState([]);
  const [collaborators, setCollaborators] = useState([]);

  const { noteId } = useParams();

  useEffect(() => {
    fetchUsers();
    fetchCollaborators();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/getAllUsers", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCollaborators = async () => {
    try {
      const res = await api.get(`/notes/getCollaborators/${noteId}`, {
        withCredentials: true,
      });
      console.log(res.data);
      const ids = res.data.map((c) => c.user_id);
      setCollaborators(ids);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (userId) => {
    try {
      await api.post(
        `/notes/addCollaborator/${noteId}`,
        {
          userId,
          noteId,
          role: "editor",
        },

        { withCredentials: true },
        console.log(noteId),
      );

      setCollaborators((prev) => [...prev, userId]);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await api.delete(`/notes/removeCollaborator/${noteId}/${userId}`, {
        withCredentials: true,
      });

      setCollaborators((prev) => prev.filter((id) => id !== userId));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="overflow-x-auto mt-5 px-5">
      <h2 className="text-xl font-bold mb-4">Manage Collaborators</h2>

      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>

            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isAdded = collaborators.includes(user.id);

            return (
              <tr key={user.id}>
                <td>{user.name}</td>

                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleAdd(user.id)}
                    disabled={isAdded}
                    className="btn btn-success btn-sm"
                  >
                    {isAdded ? "Added" : "Add"}
                  </button>

                  <button
                    onClick={() => handleRemove(user.id)}
                    disabled={!isAdded}
                    className="btn btn-error btn-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AddCollab;
