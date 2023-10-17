import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { auth } from '../firebase/config'
import { User } from 'firebase/auth'
import '../animations.css'


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


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)

            setTimeout(() => {
                setLoading(false);
            }, 3000);
        })

        return unsubscribe
    }, [])

    const loadContent = (
        <div className='m-auto'>
            <div style={{ animation: '1s infinite alternate flip-with-scale' }}>
                <img className='w-48 mx-auto my-5' src='/tyche-icon-temp.svg' alt='site-logo' />
            </div>
            <p className='text-center text-lg italic font-semibold'>Loading...</p>
        </div>

    )

    return (
        <AuthContext.Provider value={{ currentUser }} >
            {loading ? loadContent : children}
        </AuthContext.Provider>
    )
}
