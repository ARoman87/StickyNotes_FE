import { Modal, Form, Button } from "react-bootstrap"
import { Note } from "../assets/models/note"
import { NoteInput } from "../network/note_api"
import { useForm } from "react-hook-form"
import * as NotesApi from "../network/note_api"

interface AddEditNoteProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSave: (note: Note) => void
}

function AddNote({ onDismiss, onNoteSave, noteToEdit }: AddEditNoteProps ) {

    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    })

    async function onSubmit(input:NoteInput) {
        try {
            let noteResponse: Note
            if (noteToEdit) {
                noteResponse = await NotesApi.updateNote(noteToEdit._id, input)
            } else {
                noteResponse = await NotesApi.createNote(input)
            }
            onNoteSave(noteResponse)
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit Note" : "Add Note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Title"
                            isInvalid={!!errors.title}
                            {...register("title", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={5}
                            placeholder="Text"
                            {...register("text")}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>

    )
    
}

export default AddNote