import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export type ReminderProps = {
    message: string,
    details: string,
    time: Timestamp | null,
    uid: string,
}

const SnapshotReminder = ({ message, details, time, uid }: ReminderProps) => {
    const [reminderMessage, setReminderMessage] = useState(message)
    const [reminderDetails, setReminderDetails] = useState(details)
    const [reminderTime, setReminderTime] = useState(time)
    const [showAllFields, setShowAllFields] = useState(false)



    useEffect(() => {
        const reminderDivEl = document.getElementById(`reminder${uid}`)
        if (reminderDivEl) {
            reminderDivEl.addEventListener('focusout', (e) => {
                if (! (e.currentTarget as HTMLDivElement).contains((e.relatedTarget as HTMLElement))) {
                    setShowAllFields(false)
                }
            })
        }
    }, [reminderMessage, reminderDetails, reminderTime])

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val) {
            setReminderTime(Timestamp.fromMillis(Date.parse(val)))
        }
    }
    return (
        <div
            id={`reminder${uid}`}
            className='snr-field-container flex w-full my-2 pb-2 border-b-2 border-neutral-500'>
            <input type='checkbox' id={`remindercheckbox${uid}`} className='snr-checkbox mr-2 mt-1 self-start' />
            <div className='flex flex-col w-full'>
                <label htmlFor={`remindercheckbox${uid}`}>
                    <input type='text'
                        defaultValue={reminderMessage}
                        onChange={e => setReminderMessage(e.target.value)}
                        onFocus={_e => setShowAllFields(true)}
                        className='snr-message w-full text-neutral-800 bg-transparent border-none focus:border-none' />
                </label>

                {reminderDetails.length > 0 || showAllFields ?
                    <input type='text'
                        defaultValue={reminderDetails || 'add details'}
                        onChange={e => setReminderDetails(e.target.value)}
                        className='w-full text-neutral-500 text-sm italic bg-transparent border-none focus:border-none' />
                    : null
                }

                {reminderTime || showAllFields ?
                    <>
                        {/* <label
                            htmlFor={`remindertime${uid}`}
                            defaultValue={reminderTime?.toDate().toString() || 'add date/time'}
                            className='mt-2 text-neutral-500 text-sm bg-transparent'> */}
                            <input
                                id={`remindertime${uid}`}
                                defaultValue={reminderTime?.toDate().toDateString()}
                                type='datetime-local' onChange={handleDateChange} 
                                className='mt-2 bg-transparent border-none focus:border-none text-neutral-500 text-sm focus:outline-neutral-500' />
                        {/* </label> */}
                    </>
                    : null}


            </div>

        </div>
    )
}

export default SnapshotReminder
