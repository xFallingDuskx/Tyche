import { FirebaseError } from 'firebase/app'
import { User, updateProfile } from 'firebase/auth'


export default async function updateUsername(currentUser: User, newUsername: string) {
    let result = null, error = null
    if (currentUser) {
        try {
            await updateProfile(currentUser, { displayName: newUsername })
            result = 'success'
        } catch (e) {
            error = e as FirebaseError
        }
    }

    return { result, error }
}
