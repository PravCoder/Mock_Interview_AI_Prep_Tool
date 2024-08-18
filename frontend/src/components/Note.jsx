import React from "react";
import "../styles/Note.css";


// represents single-note-comp, props are note-obj and delete-func.
// on click delete-button call ondelete-func passing note-id
function Note({note, onDelete}) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");
    return <div className="note-container">
        <p className="note-title">{note.title}</p>
        <p className="note-content">{note.content}</p>
        <p className="note-date">{formattedDate}</p>
        <button className="delete-button" onClick={() => onDelete(note.id)}>delete</button>
    </div>
}

export default Note;