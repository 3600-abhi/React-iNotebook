import React, { useState } from "react";
import NoteContext from "./NoteContext";

export default function NoteState(props) {
  const host = "http://localhost:5000";

  const notesInitial = [];

  // Fetch all Note
  const fetchAllNotes = async (title, description, tag) => {
    const url = `${host}/api/notes/fetchallnotes`;

    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const data = await response.json();
    console.log(data);
    setNotes(data);
  };

  // Add a Note
  const addNote = async (title, description, tag, showAlert) => {
    console.log("Adding a new note");

    const url = `${host}/api/notes/addnote/`;

    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });

    const note = await response.json();
    setNotes(notes.concat(note));
    console.log("Added");
    showAlert("Notes Added successfully", "success");
  };

  // Delete a Note
  const deleteNote = async (id, showAlert) => {
    // TODO API CALL
    console.log("Deleting the note with " + id);
    const url = `${host}/api/notes/deletenote/${id}`;

    const response = await fetch(url, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const data = await response.json();
    console.log(data);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
    showAlert("Notes deleted successfully", "success");
  };

  // Update Note
  const editNote = async (id, title, description, tag) => {
    const url = `${host}/api/notes/updatenote/${id}`;

    const response = await fetch(url, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });

    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let i = 0; i < notes.length; i++) {
      if (notes[i]._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }

    setNotes(newNotes);
  };

  // state for notes
  const [notes, setNotes] = useState(notesInitial);

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        addNote,
        deleteNote,
        editNote,
        fetchAllNotes,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
}
