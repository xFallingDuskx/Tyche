import { useEffect, useState } from 'react'
import getFinancialAreas from '../actions/getFinancialAreas'
import getSnapshotInfo from '../actions/getSnapshotInfo'
import updateSnapshotInfo from '../actions/updateSnapshotInfo'
import { useAuth } from '../contexts/AuthContext'
import { afCapitalize, rgb2hex, generateUid } from '../util/appFunctions'
import './Snapshot.css'
import SnapshotNote, { NoteProps } from './SnapshotNote'
import SnapshotReminder, { ReminderProps } from './SnapshotReminder'


const Snapshot = () => {
    const { currentUser } = useAuth()
    if (!currentUser) return
    // Handling goal section
    const [isEditingGoals, setIsEditingGoals] = useState(false)
    const [userYearGoals, setUserYearGoals] = useState<string[]>([])
    const [userMonthGoals, setUserMonthGoals] = useState<string[]>([])
    const [userFinancialAreas, setUserFinancialAreas] = useState<string[]>([])
    // Handling reminders
    const [userReminders, setUserReminders] = useState<ReminderProps[]>([])
    // Handling notes
    const [userNotes, setUserNotes] = useState<NoteProps[]>([])
    const [isDeletingNotes, setIsDeletingNotes] = useState(false)
    const [notesToDelete, setNotesToDelete] = useState(new Set())
    // TODO: place fetches in functions
    const faPromise = getFinancialAreas()
    const snapshotInfoPromise = getSnapshotInfo()

    // Fetch user FFAs and other Snapshot Info on initial load
    useEffect(() => {
        /* TODO: use Session Storage and Local Storage to persist data
            - SS: save FFAs and Snapshot Info
            - LS: track when the most recent session was last updated, as
                  well as the database
        */
        faPromise
            .then(response => {
                if (response.result) {
                    let _: string[] = []
                    let result = (response.result as string[])
                    result.forEach(word => _.push(afCapitalize(word)))
                    setUserFinancialAreas(_)
                }
            })

        snapshotInfoPromise
            .then(response => {
                if (response.result) {
                    const snapshotInfo = response.result

                    let yearGoals: string[] = []
                    for (let idx in snapshotInfo['goals']['year']) {
                        yearGoals.push(snapshotInfo['goals']['year'][idx])
                    }
                    setUserYearGoals(yearGoals)

                    let monthGoals: string[] = []
                    for (let idx in snapshotInfo['goals']['month']) {
                        monthGoals.push(snapshotInfo['goals']['month'][idx])
                    }
                    setUserMonthGoals(monthGoals)

                    let reminders: any[] = []
                    for (let idx in snapshotInfo['reminders']) {
                        reminders.push(snapshotInfo['reminders'][idx])
                    }
                    setUserReminders(reminders)

                    let notes: any[] = []
                    for (let idx in snapshotInfo['notes']) {
                        notes.push(snapshotInfo['notes'][idx])
                    }
                    setUserNotes(notes)
                }
            })
    }, [])

    // Use to track notes to delete
    useEffect(() => {
        let clickAction = (_e: MouseEvent) => { }
        if (isDeletingNotes) {
            clickAction = (e: MouseEvent) => {
                const snsParentDiv = (e.currentTarget as HTMLDivElement)
                const noteId = snsParentDiv.id.slice(4)
                if (snsParentDiv.classList.contains('sns-delete-selected')) {
                    notesToDelete.delete(noteId)
                    snsParentDiv.classList.remove('sns-delete-selected')
                } else {
                    notesToDelete.add(noteId)
                    snsParentDiv.classList.add('sns-delete-selected')
                }
                setNotesToDelete(new Set(notesToDelete))
            }
        }

        const addNewNoteBtn = (document.getElementById('sns-btn-add') as HTMLButtonElement)
        addNewNoteBtn.disabled = isDeletingNotes ? true : false

        Array.from(document.getElementsByClassName('snapshot-note-subject')).forEach(sns => {
            const snsParentDiv = (sns.parentNode as HTMLDivElement)
            const editBtn = (snsParentDiv.getElementsByTagName('button')[0] as HTMLButtonElement)
            editBtn.disabled = isDeletingNotes ? true : false
            snsParentDiv.onclick = clickAction

            const noteId = snsParentDiv.id.slice(4)
            if (!isDeletingNotes && notesToDelete.has(noteId)) {
                notesToDelete.delete(noteId)
                setNotesToDelete(new Set(notesToDelete))
                snsParentDiv.classList.remove('sns-delete-selected')
            }
        })
    }, [isDeletingNotes, notesToDelete])

    const finishEdit = (toSave: boolean) => {
        const addedLiInputs = document.querySelectorAll('.user-goals-list input')

        let newUserYearGoals: string[] = []
        let newUserMonthGoals: string[] = []
        addedLiInputs.forEach(inputEl => {
            if (toSave) {
                // Save each input value that is non-empty 
                const ugl_id = (inputEl.parentNode!.parentNode as HTMLUListElement).id
                const value = (inputEl as HTMLInputElement).value
                if (value.length > 0) {
                    ugl_id === 'ugl-1' ? newUserYearGoals.push(value) : newUserMonthGoals.push(value)
                }
            }

            // Always remove new li + input field 
            const assocLi = (inputEl.parentNode as HTMLLIElement)
            if (assocLi.hasAttribute('temp')) {
                assocLi?.parentNode?.removeChild(assocLi)
            }

        })

        if (toSave) { // Update all info
            setUserYearGoals(newUserYearGoals ?? userYearGoals)
            setUserMonthGoals(newUserMonthGoals ?? userMonthGoals)

            // Must use new* variables since the set hooks take time to apply to their relates constants
            const snapshotUpdatePromise = updateSnapshotInfo(currentUser, newUserYearGoals, newUserMonthGoals, userReminders, userNotes)
            snapshotUpdatePromise
                .then(response => {
                    if (response.error) {
                        alert(`Uh oh, seems that there was an issue updating your goals 🫠 Please try again later.`)
                        location.reload()
                    }
                    setNotesToDelete(new Set())
                })
        }

        setIsEditingGoals(!isEditingGoals)
    }

    const addNewListItem = (ugl_id: string) => {
        const uglEl = document.getElementById(ugl_id)
        const newLi = document.createElement('li')
        newLi.setAttribute('key', `${uglEl!.children.length + 1}`)
        newLi.setAttribute('temp', 'true')
        const newInput = document.createElement('input')
        newInput.type = 'text'
        newLi.appendChild(newInput)
        uglEl!.appendChild(newLi)
    }

    const addNewNote = () => {
        const newNote: NoteProps = {
            subject: '',
            content: '',
            colorHex: '#fdfd96',
            uid: generateUid()
        }

        setUserNotes([...userNotes, newNote])
    }

    const saveNotes = () => {
        let updatedNotes: NoteProps[] = []

        Array.from(document.getElementsByClassName('snapshot-note-subject')).forEach(sns => {
            const nSubject = (sns as HTMLHeadElement).textContent ?? ''
            const nContent = (sns.nextSibling as HTMLHeadElement).textContent ?? ''
            const nColorHex = rgb2hex((sns.parentNode as HTMLDivElement).style.backgroundColor) ?? '#fdfd96';
            const noteId = (sns.parentNode as HTMLDivElement).id.slice(4)

            // don't add note if it is set to be deleted
            if (!notesToDelete.has(noteId)) {
                updatedNotes.push({
                    subject: nSubject,
                    content: nContent,
                    colorHex: nColorHex,
                    uid: (sns.parentNode as HTMLDivElement).id.slice(4)
                });
            }

        })

        setUserNotes(updatedNotes)
        const snapshotUpdatePromise = updateSnapshotInfo(currentUser, userYearGoals, userMonthGoals, userReminders, updatedNotes)
        snapshotUpdatePromise
            .then(response => {
                if (response.error) {
                    alert(`Uh oh, seems that there was an issue updating your goals 🫠 Please try again later.`)
                    location.reload()
                }

                // Change notes to reflect save status
                Array.from(document.getElementsByClassName('snapshot-note-status')).forEach(sns => (sns as HTMLParagraphElement).style.display = 'none')

                alert('Notes updated!')
            })
    }

    const addNewReminder = () => {
        const newReminder:ReminderProps = {
            message: '',
            details: '',
            time: null,
            uid: generateUid(),
        }

        setUserReminders([...userReminders, newReminder])
    }

    return (
        <div className='dashboard-container'>
            {/* TODO: add logic later */}
            <div className='bg-blue-200 p-2 mt-2 rounded-xl'><h1 className='inline-block'> &#128205; Notices: </h1> <span className='text-slate-400'> none today! </span></div>
            <div className='relative bg-transparent border-neutral-400 border-2 box-border p-2 my-4 rounded-xl'>
                {isEditingGoals ?
                    <>
                        <span className='absolute left-2 top-1 hover:cursor-pointer text-neutral-500 hover:text-neutral-900'
                            onClick={() => finishEdit(true)}>Save</span>
                        <span className='absolute right-2 top-1 hover:cursor-pointer text-neutral-500 hover:text-neutral-900'
                            onClick={() => finishEdit(false)}>Cancel</span>
                    </>

                    : <span className='absolute right-2 top-1 hover:cursor-pointer text-neutral-500 hover:text-neutral-900'
                        onClick={() => setIsEditingGoals(!isEditingGoals)}>Edit</span>}
                <h1 className='text-center text-3xl font-bold'> Goals </h1>
                <div className='flat-to-stack'>
                    <div className='fts-half-content'>
                        <h2 className='text-center text-2xl my-auto'> Year </h2>
                        <ul id='ugl-1' className='user-goals-list'>
                            {isEditingGoals ?
                                userYearGoals.map((goal, idx) => <li className='ml-2' key={'y' + idx}><input defaultValue={goal} /></li>)
                                : userYearGoals.map((goal, idx) => <li className='ml-2' key={'y' + idx}>{goal}</li>)}
                        </ul>
                        {isEditingGoals ?
                            <small className='self-start text-neutral-500 hover:cursor-pointer' onClick={() => addNewListItem('ugl-1')}>add new
                                <span className='text-xl pl-1'>+</span>
                            </small>
                            : null}
                    </div>
                    <div className='fts-half-content'>
                        <h2 className='text-center text-2xl'> Month </h2>
                        <ul id='ugl-2' className='user-goals-list'>
                            {isEditingGoals ?
                                userMonthGoals.map((goal, idx) => <li key={idx}><input defaultValue={goal} /></li>)
                                : userMonthGoals.map((goal, idx) => <li key={idx}>{goal}</li>)}
                        </ul>
                        {isEditingGoals ?
                            <small className='self-start text-neutral-500 hover:cursor-pointer' onClick={() => addNewListItem('ugl-2')}>add new
                                <span className='text-xl pl-1'>+</span>
                            </small>
                            : null}                    </div>
                </div>
                <div className='border-t-2 border-neutral-400 p-2 mt-5'>
                    <h1 className='text-red-800 text-center'>Financial Focus Areas:
                        <span className='text-black hover:no-underline'> {userFinancialAreas.length == 0 ? 'None yet!' : userFinancialAreas.toString()}</span>
                        {isEditingGoals ?
                            <div className='tooltip-r text-xs align-top text-neutral-400'>&nbsp; &#9432;
                                <p className='tooltip-text bg-gray-200 text-black text-xs'>
                                    You can edit your Financial Focus Areas in your Profile &#128513;
                                </p>
                            </div>
                            : null}
                    </h1>
                </div>
            </div>
            <div className='flat-to-stack'>
                {/* Reminder section */}
                <div className='fts-half-content bg-red-200 p-2 my-3 rounded-xl mr-4'><h1 className='inline-block'> &#128337; Reminders: </h1>
                    {userReminders.length == 0 ? <span className='text-slate-400'> none at the moment! </span> : null}
                    <div className='flex flex-col pl-2'>
                        {userReminders.length == 0 ? null :
                            userReminders.map(snr => <SnapshotReminder key={snr.uid} message={snr.message} details={snr.details} time={snr.time} uid={snr.uid} />)}
                        <button
                            id='snr-btn-add'
                            className={'mt-4 self-start hover:cursor-pointer'}
                            onClick={() => addNewReminder()}>
                            <small className='m-auto text-neutral-600 my-auto block'>add new<span className='text-xl pl-1'>+</span></small>
                        </button>
                    </div>
                </div>
                {/* Check In Section */}
                <div className='fts-half-content bg-gray-200 p-2 my-3 rounded-xl'><h1 className='inline-block'> &#x23F3; Check Ins: </h1> <span className='text-slate-400'> none today! </span></div>
            </div>

            {/* Note section */}
            {/* TODO: allow users to delete notes */}
            <div className='bg-transparent border-neutral-400 border-2 box-border p-2 my-4 rounded-xl'><h1 className='inline-block'> &#x1f58a; Notes: </h1>
                {userNotes.length == 0 ? <span className='text-slate-400'> none at the moment! </span> : null}
                <div className='flex flex-wrap place-content-around'>
                    {userNotes.length == 0 ? null :
                        userNotes.map(sns => <SnapshotNote key={sns.uid} subject={sns.subject} content={sns.content} colorHex={sns.colorHex} uid={sns.uid} />)}
                    <button
                        id='sns-btn-add'
                        className={'rounded-lg mt-4 mx-2 p-3 relative max-w-sm w-56 h-fit flex flex-col outline-dashed box-border outline-neutral-400 hover:cursor-pointer'}
                        onClick={() => addNewNote()}>
                        <small className='m-auto text-neutral-600 my-auto block'>add new<span className='text-xl pl-1'>+</span></small>
                    </button>
                </div>
                <span className='block w-fit ml-auto hover:cursor-pointer text-neutral-500 hover:text-neutral-900 mt-4' onClick={() => saveNotes()}>Save</span>
                <span className='block w-fit ml-auto hover:cursor-pointer text-neutral-500 hover:text-neutral-900' onClick={() => setIsDeletingNotes(!isDeletingNotes)}>
                    {isDeletingNotes ? 'Cancel' : 'Delete'}
                </span>
                <small className='block w-fit ml-auto m-0 text-neutral-400 text-sm italic'>
                    {isDeletingNotes ? `${notesToDelete.size} note(s) selected to delete` : null}
                </small>
            </div>
        </div>
    )
}

export default Snapshot
