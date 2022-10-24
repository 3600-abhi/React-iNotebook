const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// jb ek step back krna ho to double dot lgate hain ("../middleware/fetchuser")
const fetchuser = require("../middleware/fetchuser");

// ROUTE-1 : Fetch all notes all notes using GET : GET "/api/notes/fetchallnotes". (Login required)
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  // check whether the user with same email exists already
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Internal server occur !!");
  }
});

// ROUTE-2 :  Add new note using : POST "/api/notes/addnote". (Login required)
router.post(
  "/addnote",
  fetchuser,
  // validation ke liye jo bhi likhna hai usko hum es array me likh denge
  // ye validation hmne (Express-validator) ka use krke kiya h
  [
    body("title", "Enter the valid title").isLength({ min: 3 }),
    body(
      "description",
      "Description should be minimum of 5 characters"
    ).isLength({ min: 5 }),
  ],

  async (req, res) => {
    try {
      // If there are errors, return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // destructuring
      const { title, description, tag } = req.body;

      const note = await new Note({
        title,
        tag,
        description,
        user: req.user.id,
      });

      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send("Internal server occur !!");
    }
  }
);

// Router-3 : Update an existing Note using PUT : "api/notes/updatenote". (Login required)
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found !!");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed !!");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    res.status(500).send("Internal server occur !!");
  }
});

// Router-4 : Update an existing Note using DELETE : "api/notes/deletenote". (Login required)
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found !!");
    }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed !!");
    }

    success = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted" });
  } catch (error) {
    res.status(500).send("Internal server occur !!");
  }
});

module.exports = router;
