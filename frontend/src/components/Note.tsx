import { Card } from "react-bootstrap"
import { Note as NoteModel } from "../assets/models/note"
import styles from "../styles/Note.module.css"
import styleUtils from "../styles/utils.module.css"
import { formatDate } from "../utils/formatDate"
import { MdDelete } from "react-icons/md"


interface NoteProps {
    note: NoteModel,
    className?: string,
    onNoteClick: (note: NoteModel) => void,
    onDeleteNote: (note: NoteModel) => void
}

function Note({note, className, onDeleteNote, onNoteClick}: NoteProps) {
    const {title, text, createdAt, updatedAt} = note

    let createdUpdatedText: string

    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt)
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt)
    }
    return (
        <Card 
        className={`${styles.noteCard} ${className}`}
        onClick={() => onNoteClick(note)}
        >
           <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete 
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteNote(note)
                            e.stopPropagation()
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body> 
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Note