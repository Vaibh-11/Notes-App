import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";

const PublicNote = () => {
  const { token } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/public/${token}`);
      setNote(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!note) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">{note.title}</h1>
      <p className="mt-3">{note.content}</p>
      <p className="text-sm text-gray-500 mt-2">By: {note.created_by}</p>
    </div>
  );
};

export default PublicNote;
