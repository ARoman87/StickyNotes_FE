import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Note as NoteModel } from "./assets/models/note";
import Note from "./components/Note";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/note_api";
import AddEditNote from "./components/AddEditNote";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Spinner from "react-bootstrap/Spinner"

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true)
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false)

  const [showAddNote, setShowAddNote] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
		setShowNotesLoadingError(false)
		setNotesLoading(true)
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true)
      } finally {
		setNotesLoading(false)
	  }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }


  const notesGrid =
	<Row xs={1} md={2} lg={3} className={`g-4 ${styles.notesGrid}`}>
	{notes.map((note) => (
		<Col key={note._id}>
		<Note
			note={note}
			className={styles.note}
			onNoteClick={setNoteToEdit}
			onDeleteNote={deleteNote}
		/>
		</Col>
	))}
	</Row>


  return (
    <Container className={styles.notesPage}>
      <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNote(true)}
      >
        <FaPlus />
        Add new note
      </Button>

	  {notesLoading && <Spinner animation="border" variant="primary" /> }
	  {showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>}
	  {!notesLoading && !showNotesLoadingError && 
	  <>
	  { notes.length > 0
			? notesGrid
			: <p>You don't have any notes yet.</p>
	  }
	  </>
	  }
      
      {showAddNote && (
        <AddEditNote
          onDismiss={() => setShowAddNote(false)}
          onNoteSave={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNote(false);
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNote
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSave={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id
                  ? updatedNote
                  : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </Container>
  );
}

export default App;
