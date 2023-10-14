import { FirebaseError } from 'firebase/app'
import { ref, get } from 'firebase/database'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'

type SnapshotInfo = {
    goals: {
        year: [],
        month: []
    };
    reminders: [];
    notes: [];
}

export default async function getSnapshotInfo() {
    const { currentUser } = useAuth()

    let result:SnapshotInfo | null = null, error = null
    if (currentUser) {
        try {
            const pathRef = ref(db, 'users/' + currentUser.uid + '/snapshot')
            const snapshot = await get(pathRef)
            result = (snapshot.toJSON() as SnapshotInfo); 
        } catch (e) {
            error = e as FirebaseError
            console.error('error getting financial areas:', error.message)
        }
    }

    return { result, error }
    
}
