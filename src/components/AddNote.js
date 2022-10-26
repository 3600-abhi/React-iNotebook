import { useContext, useRef, useState } from "react";
import NoteContext from "../context/NoteContext";

export default function AddNote(props) {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const focusTitleRef = useRef();
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "default",
  });

  const handleAdd = async (event) => {
    event.preventDefault();
    await addNote(note.title, note.description, note.title, props.showAlert);

    // to clean the title and description tag
    setNote({ title: "", description: "", tag: "default" });

    // title aur description ka tag empty kr dega just upar wali line
    // pr agr hum chahte hain ki fir se hmara cursor title pr focus krne lge isliye use kiya hai 
    focusTitleRef.current.focus();
  };

  const handleChange = (event) => {
    setNote({ ...note, [event.target.name]: event.target.value });
  };

  return (
    <div className="container mx-5">
      <h2>Add your Notes</h2>
      <form>
        <div className="form-group my-3">
          <label htmlFor="title">Title</label>
          <input
            ref={focusTitleRef}
            type="text"
            className="form-control my-2"
            id="title"
            name="title"
            aria-describedby="emailHelp"
            placeholder="Enter title"
            value={note.title}
            onChange={handleChange}
            minLength={5}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control my-2"
            id="description"
            name="description"
            placeholder="Enter your description"
            value={note.description}
            onChange={handleChange}
            minLength={5}
            required
          />
        </div>

        <button
          disabled={note.title.length < 5 || note.description.length < 5}
          type="submit"
          className="btn btn-primary my-2"
          onClick={handleAdd}
        >
          Add
        </button>
      </form>
    </div>
  );
}
