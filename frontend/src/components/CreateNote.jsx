import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/axios";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await api.post(
        "/notes/create",
        {
          title,
          content,
        },
        { withCredentials: true },
      );
      navigate("/home");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="card card-border bg-base-100 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Create Notes</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <input
              className="input"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              type="text"
              placeholder="Enter Title"
              value={title}
            />
            <br />
            <br />
            <textarea
              onChange={(e) => {
                setContent(e.target.value);
              }}
              placeholder="Enter Content"
              className="input textarea textarea-bordered"
              value={content}
            ></textarea>
            <div className="card-actions justify-center mt-5">
              <button className="btn btn-primary justify-center">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
