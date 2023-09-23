import { FirebaseError } from 'firebase/app'
import { User } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { db } from '../firebase/config'


export default async function updateFinancialAreas(currentUser: User, newFinancialAreas: string[]) {
    let result = null, error = null
    if (currentUser) {
        try {
            const pathRef = ref(db, 'users/' + currentUser.uid)
            await set(pathRef, {
                financialAreas: newFinancialAreas,
            })
            result = 'success'
        } catch (e) {
            error = e as FirebaseError
        }
    }

    return { result, error }
}
