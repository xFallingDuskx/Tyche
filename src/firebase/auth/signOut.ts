import { auth } from  '../config'
import { signOut } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'


export default async function signOutUser() {
    let result = null, error = null
    try {
        result = await signOut(auth)
    } catch (e) {
        error = e as FirebaseError
    }

    return { result, error }
}
