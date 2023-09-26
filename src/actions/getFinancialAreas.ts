import { FirebaseError } from 'firebase/app'
import { ref, get } from 'firebase/database'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'


export default async function getFinancialAreas() {
    const { currentUser } = useAuth()

    let result = null, error = null
    if (currentUser) {
        try {
            const pathRef = ref(db, 'users/' + currentUser.uid + '/financialAreas')
            const snapshot = await get(pathRef)
            result = snapshot.val(); 
        } catch (e) {
            error = e as FirebaseError
            console.error('error getting financial areas:', error.message)
        }
    }

    return { result, error }
    
}
