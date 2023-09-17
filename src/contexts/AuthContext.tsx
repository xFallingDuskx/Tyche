import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { auth } from '../firebase/config'
import { User } from 'firebase/auth'


type AuthContextType = {
    currentUser: User | null,
    // getUser: () => void,
    // login: (email: string, password: string) => Promise<void | User>,
    // signOut: () => void,
    // signUp: (email: string, password: string) => Promise<void | User>,
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // const login = async (email: string, password: string) => {
    //     return signInWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             console.log("successfully logged in")
    //             const user = userCredential.user
    //             return user
    //         })
    //         .catch((error) => {
    //             console.log("failed to log in:", error.code, error.message)
    //         })
    // }

    // const signOut = async () => {
    //     return auth.signOut()
    //         .catch((error) => {
    //             console.log("failed to sign out:", error.code, error.message)
    //         })
    // }

    // const signUp = async (email: string, password: string) => {
    //     return createUserWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             console.log("successfully sign up")
    //             const user = userCredential.user
    //             return user
    //         })
    //         .catch((error) => {
    //             console.log("failed to sign up:", error.code, error.message)
    //         })
    // }

    // const getUser = () => {
    //     return currentUser
    // }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    // const value = {
    //     currentUser,
    //     getUser,
    //     login,
    //     signOut,
    //     signUp
    // }

    return (
        <AuthContext.Provider value={{ currentUser }} >
            {/* {!loading && children} */}
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}
