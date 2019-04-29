const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.locals.notes = [];

app.get("/api/v1/notes", (request, response) => {
    // the get method pulls all data down to the response
  response.status(200).json(app.locals.notes);
   // the returned status code is 200 for 'ok', indicating a succesful fetch as well as the json'd data in app.locals.notes
});

// get method pulls al local notes from app.locals.notes in the file returns the json'd data with a status code

app.post("/api/v1/notes", (request, response) => {
  // the post method creates a new piece of data to be stored on the server
  const { notes } = app.locals;
  // destructored notes from the app.locals
  const newNote = request.body;
  // creating a new variable 'newNote' using the request body
  if (Object.keys(newNote).length === 0)
    return response.status(422).json("No request body found");
    // this conditional checks if the request.body has length. If not, return the 422 status as well as a the json'd string 
  notes.push({
    title: newNote.title,
    listItems: newNote.listItems,
    id: Date.now()
  });
  //  here we are still in the conditional, but the destructored array of notes gets a new 'note' pushed into it on line 26
  response.status(201).json(notes[notes.length - 1]);
  // we are sending the status code of a successful creation of data, as well as the json of the current note being referenced
});

app.put("/api/v1/notes/:id", (request, response) => {
  // the put method alters existing data in the server
  const { id } = request.params;
  // creating a new variable 'id' using the request params
  const noteIndex = app.locals.notes.find(note => {
    // searching through the noteIndex, to find a specific note based on the 'id' variable as stated above
    return note.id == id;
  });
  if (!noteIndex) {
    return response.sendStatus(404);
    // if the note is not found, we send an error code that declares the asset 'not found'
  } else {
    const index = app.locals.notes.indexOf(noteIndex);
    // this declares the index of noteIndex into a new variable
		app.locals.notes.splice(index, 1, request.body);
    return response.status(200).json("successfully updated");
    // if found, we splice the found note with the data in the request body, deleting the original note and replacing it with the response body
  }
});

app.delete("/api/v1/notes/:id", (request, response) => {
   // the delete method alters existing data in the server by removing a piece 
  const { id } = request.params;
   // creating a new variable 'id' using the request params
  const updatedNotes = app.locals.notes.filter(note => note.id != id);
  // filters through the app.locals.notes looking for the supplied 'id'
  if (updatedNotes.length === app.locals.notes.length) return response.sendStatus(422);
  // if the unfound, the arrays will be the same length, in which case we return a status declaring an 'unprocessable entity'
  app.locals.notes = updatedNotes;
  // if it is found, we redeclare the original app.locals.notes to the value of updatedNotes, effectively removing the piece of data
  return response.sendStatus(204);
  // This returns the successful status code of 'no content', because it has been removed
});

export default app;
