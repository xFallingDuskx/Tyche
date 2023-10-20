import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { formatDateTime } from '../util/appFunctions'


export type ReminderProps = {
    message: string,
    details: string,
    time: Timestamp | null,
    completed: boolean,
    uid: string,
}


const SnapshotReminder = ({ message, details, time, completed, uid }: ReminderProps) => {
    const [reminderMessage, setReminderMessage] = useState(message)
    const [reminderDetails, setReminderDetails] = useState(details)
    const [reminderTime, setReminderTime] = useState(time)
    const [reminderIsCompleted, setReminderIsCompleted] = useState(completed)
    const [showAllFields, setShowAllFields] = useState(false)
    const [hasBeenEdited, setHasBeenEdited] = useState(false)
    const defaultDT = Timestamp.fromMillis(0)

    useEffect(() => {
        const reminderDivEl = document.getElementById(`reminder${uid}`)
        if (reminderDivEl) {

            reminderDivEl.addEventListener('focusout', (e) => {
                if (!(e.currentTarget as HTMLDivElement).contains((e.relatedTarget as HTMLElement))) {
                    setShowAllFields(false)
                }
            })

            if (message !== reminderMessage || details !== reminderDetails || time !== reminderTime || completed !== reminderIsCompleted) {
                reminderDivEl.classList.add('snr-updated')
                setHasBeenEdited(true)
            } else {
                reminderDivEl.classList.remove('snr-updated')
                setHasBeenEdited(false)
            }
        }

        return
    }, [reminderMessage, reminderDetails, reminderTime, reminderIsCompleted])

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val) {
            setReminderTime(Timestamp.fromMillis(Date.parse(val)))
        } else {
            setReminderTime(null)
        }
    }

    return (
        <div
            id={`reminder${uid}`}
            className='snr-field-container flex w-full my-2 pb-2 border-b-2 border-neutral-500'>
            <input type='checkbox' id={`remindercheckbox${uid}`} className='snr-checkbox mr-2 mt-1 self-start'
                defaultChecked={reminderIsCompleted} onClick={() => setReminderIsCompleted(!reminderIsCompleted)} />
            <div className='flex flex-col w-full'>

                <div className='flex'>
                    <div className='flex flex-col flex-grow'>
                        <label htmlFor={`remindercheckbox${uid}`}>
                            <input type='text'
                                defaultValue={reminderMessage}
                                onChange={e => setReminderMessage(e.target.value)}
                                onFocus={_e => setShowAllFields(true)}
                                className={`snr-message w-full text-neutral-800 bg-transparent border-none focus:border-none overflow-hidden overflow-ellipsis 
                                            ${reminderIsCompleted ? 'line-through' : ''}`} />
                        </label>

                        {reminderDetails.length > 0 || showAllFields ?
                            <textarea
                                defaultValue={reminderDetails || ''}
                                placeholder='add details'
                                onChange={e => setReminderDetails(e.target.value)}
                                onFocus={_e => setShowAllFields(true)}
                                className={`snr-details w-full text-neutral-500 text-sm italic bg-transparent border-none focus:outline-none h-fit resize-none 
                                            ${reminderIsCompleted ? 'line-through' : ''}`} />
                            : null
                        }

                        {(reminderTime && !reminderTime.isEqual(defaultDT)) || showAllFields ?
                            <input type='datetime-local'
                                defaultValue={!reminderTime || reminderTime.isEqual(defaultDT) ? undefined : formatDateTime(reminderTime.toMillis())}
                                onChange={handleDateChange}
                                className='snr-time mt-2 bg-transparent border-none focus:border-none text-neutral-500 text-sm focus:outline-neutral-500' />
                            : null}
                    </div>

                    <div className='flex flex-col w-fit'>
                        <button className='snr-delete-btn w-5 h-5 text-sm font-bold hover:bg-neutral-400'>x</button>
                        {hasBeenEdited ?
                            <button className='snr-save-btn w-5 h-5 text-sm font-bold hover:bg-neutral-400 inline-block'>&#x2713;</button>
                            : null}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default SnapshotReminder
