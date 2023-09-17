import { auth } from  '../config'
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';


export default async function resetPassword(email: string) {
    let result = null, error = null
    try {
        result = await sendPasswordResetEmail(auth, email)
    } catch (e) {
        error = e as FirebaseError
    }

    return { result, error }
}
