
// noteService.js
// WHY: API calls for job notes and incident logs.
// USED BY: components/notes/NotesPanel.jsx
// BACKEND: GET /api/notes/:bookingId, POST /api/notes

import api from "./api";

// Load the logged-in employee's notes for one booking, newest first.
export const getNotes = async (bookingId) => {
  const response = await api.get(`/notes/${bookingId}`);
  return response.data;
};

// Save a new note or incident for a booking.
export const createNote = async (bookingId, type, text) => {
  // Send the note details to the backend.
  const response = await api.post("/notes", {
    bookingId,
    type,
    text,
  });

  return response.data;
};
