import { auth } from  '../config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseApp, FirebaseError } from 'firebase/app'


export default async function signUpUser(email: string, password: string) {
    let result = null, error = null
    try {
        result = await createUserWithEmailAndPassword(auth, email, password)
    } catch (e) {
        error = e as FirebaseError
    }

    return { result, error }
}
