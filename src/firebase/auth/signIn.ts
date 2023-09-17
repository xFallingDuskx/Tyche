import { auth } from  '../config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'


export default async function signInUser(email: string, password: string) {
    let result = null, error = null
    try {
        result = await signInWithEmailAndPassword(auth, email, password)
    } catch (e) {
        error = e as FirebaseError
    }

    return { result, error }
}
