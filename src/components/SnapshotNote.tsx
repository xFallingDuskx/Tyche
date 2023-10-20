import { useEffect, useState } from 'react';
import './SnapshotNote.css'


export type NoteProps = {
    subject: string;
    content: string;
    colorHex: string;
    uid: string;
}

const SnapshotNote = ({ subject, content, colorHex, uid }: NoteProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [noteSubject, setNoteSubject] = useState(subject)
    const [noteContent, setNoteContent] = useState(content)
    const [noteColorHex, setNoteColorHex] = useState(colorHex)
    const id = `note${uid}`
    
    useEffect(() => {
        let noteUnsavedIndicatorDisplay = 'none'

        if (subject !== noteSubject || content !== noteContent || colorHex !== noteColorHex) {
            noteUnsavedIndicatorDisplay = 'block'
        }

        const snsUnsavedIndicator = (document.querySelector(`#${id} .snapshot-note-status`) as HTMLParagraphElement)
        snsUnsavedIndicator.style.display = noteUnsavedIndicatorDisplay
        
        return
    }, [noteSubject, noteContent, noteColorHex])

    return (
        // TODO: Show link text as links
        <div
            style={{ backgroundColor: noteColorHex }}
            id={id} key={id}
            className={`shadow-grow rounded-xl mx-2 my-4 p-3 relative max-w-sm w-56 h-fit flex flex-col flex-wrap place-content-between `}>
            {isEditing ?
                <div className='ml-auto mb-2'>
                    <label htmlFor='note-color-selector'
                        style={{ backgroundColor: noteColorHex }}
                        className='w-6 h-6 inline-block rounded-full my-auto outline-double'>
                        <input type='color' value={noteColorHex}
                            id='note-color-selector'
                            name='note-color-selector'
                            onChange={(e) => setNoteColorHex(e.target.value)}
                            className='w-full border-0 focus:border-0 outline-1 outline-dotted p-0 invisible' />
                    </label>
                </div>
                : null}


            <h2 className='snapshot-note-subject px-1 w-full font-bold'>
                {isEditing ? <input type='text' defaultValue={noteSubject}
                    className='w-full p-1 mb-1 bg-black bg-opacity-5 border-none rounded focus:border-none'
                    onChange={(e) => setNoteSubject(e.target.value)} /> : noteSubject}
            </h2>

            <p className='p-1 max-h-20 overflow-ellipsis whitespace-pre-wrap overflow-scroll'>
                {isEditing ? <textarea defaultValue={noteContent} rows={4}
                    className='hide-scrollbar outline-none w-full p-1 mt-1 bg-black bg-opacity-5 border-none rounded'
                    onChange={(e) => setNoteContent(e.target.value)} /> : noteContent}
            </p>
            <button className='mt-2 px-2 w-fit self-end' onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Done' : 'Edit'}</button>
            <p className='snapshot-note-status w-fit self-end italic text-gray-500 hidden'>Unsaved</p>
        </div>
    )
}

export default SnapshotNote
