import { FirebaseError } from 'firebase/app'
import { ref, get } from 'firebase/database'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase/config'


async function fetch() {
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

export default function getFinancialAreas() {
    const promise = fetch()
    let res:string[] = []
    promise
        .then(response => {
            if (response.result) {
                res = (response.result as string[])
            }
        })
    return res
}
