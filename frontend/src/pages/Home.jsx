import {useState, useEffect} from "react";
import api from "../api"
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes(); // call as soon as page is visited
    })

    // func sends get-request to /notes-route, sets the notes-var to the response.data
    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                // console.log(data);
            })
            .catch((err) => alert(err));
    };

    // func sends delete request to /notes/delete/id-route, then updates notes-list
    const deleteNote = (id) => {
        console.log("HELLLO")
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    // func sends post-request to same /notes-route passing in content/title-var
    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    return <div>
        <div>
            <h1>Notes</h1>
             {/*  map each note to a note-component */} 
             {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
        </div>
        <h2>Create a note</h2>
        {/*  when form is submitted call create-note-func */} 
        <form onSubmit={createNote}>
            {/* onchange update title-var, value is equal to title-var */} 
            <label htmlFor="title">Title:</label>
            <br/>
            <input type="text" id="title" name="title" required onChange={(e) => setTitle(e.target.value)} value={title}/>
            
            <label htmlFor="content">Content:</label>
            <br/>
            <textarea id="content" name="content" required value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            <br/>
            <input type="submit" value="Submit"></input>
        </form>
    </div>
}

export default Home;