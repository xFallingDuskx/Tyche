import { FirebaseError } from 'firebase/app'
import { User } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { NoteProps } from '../components/SnapshotNote'
import { ReminderProps } from '../components/SnapshotReminder'
import { db } from '../firebase/config'


export default async function updateSnapshotInfo(currentUser: User, yearGoals: string[], monthGoals: string[], reminders: ReminderProps[], notes: NoteProps[]) {
    let result = null, error = null
    if (currentUser) {
        try {
            const pathRef = ref(db, 'users/' + currentUser.uid + '/snapshot')
            await set(pathRef, {
                goals: {
                    year: yearGoals,
                    month: monthGoals
                },
                reminders: reminders,
                notes: notes
            })
            result = 'success'
        } catch (e) {
            error = e as FirebaseError
        }
    }

    return { result, error }
}
