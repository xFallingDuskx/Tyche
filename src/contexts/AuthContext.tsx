import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { auth } from '../firebase/config'
import { User } from 'firebase/auth'
import tempIcon from '/tyche-icon-temp.svg'
import '../animations.css'


type AuthContextType = {
    currentUser: User | null,
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
            }, 1500);
        })

        return unsubscribe
    }, [])

    const loadContent = (
        <div className='m-auto'>
            <div style={{ animation: '1s infinite alternate flip-with-scale' }}>
                <img className='w-48 mx-auto my-5' src={tempIcon} alt='site-logo' />
            </div>
            <p className='text-center !text-2xl italic font-semibold'>Loading...</p>
        </div>

    )

    return (
        <AuthContext.Provider value={{ currentUser }} >
            {loading ? loadContent : children}
        </AuthContext.Provider>
    )
}
