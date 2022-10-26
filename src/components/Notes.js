import React, { useEffect, useRef, useState } from "react";
import NoteContext from "../context/NoteContext";
import NoteItem from "./NoteItem";
import { useContext } from "react";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

export default function Notes(props) {
  const context = useContext(NoteContext);
  const { notes, fetchAllNotes, editNote } = context;
  const ref = useRef();
  const refClose = useRef();
  const navigate = useNavigate();

  const [note, setNote] = useState({
    eid: "",
    etitle: "",
    edescription: "",
    etag: "default",
  });

  const updateNote = async (event) => {
    event.preventDefault();
    await editNote(note.eid, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Note updated successfuly", "success");
  };

  const handleChange = (event) => {
    setNote({ ...note, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchAllNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const handleEditClick = (currentNote) => {
    ref.current.click();
    setNote({
      eid: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
    });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />

      {/* Modal ka code hai for updating the notes */}
      {/* es button ko hide kr diya hai using dispaly: none CSS property */}
      <button
        style={{ display: "none" }}
        ref={ref}
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group my-3">
                  <label htmlFor="etitle">Title</label>
                  <input
                    type="text"
                    className="form-control my-2"
                    id="etitle"
                    name="etitle"
                    aria-describedby="emailHelp"
                    placeholder="Enter title"
                    onChange={handleChange}
                    value={note.etitle}
                    minLength={5}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edescription">Description</label>
                  <input
                    type="text"
                    className="form-control my-2"
                    id="edescription"
                    name="edescription"
                    placeholder="Enter your description"
                    onChange={handleChange}
                    value={note.edescription}
                    minLength={5}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={
                  note.etitle.length < 5 || note.edescription.length < 5
                }
                type="button"
                className="btn btn-primary"
                onClick={updateNote}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" container row mx-5 my-5">
        {notes.length === 0 && <h2>No Notes to display</h2>}
        {notes.length > 0 && <h2>Your Notes </h2>}

        {/* Jo bhi notes hai unko display kraya gya hai */}
        {notes.map((note) => {
          return (
            <NoteItem
              key={note._id}
              note={note}
              handleEditClick={handleEditClick}
              showAlert={props.showAlert}
            />
          );
        })}
      </div>
    </>
  );
}
