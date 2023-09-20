import { useAuth } from '../contexts/AuthContext'
import signOutUser from '../firebase/auth/signOut'


const HomePage = () => {
    const { currentUser } = useAuth()
    if (! currentUser) {
        document.location = '/'
        return
    }

    if (currentUser.displayName === null) {
        document.location = '/welcome'
        return
    }

    const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const promise = signOutUser()
        promise
            .then(response => {
                if (! response.error) {
                    document.location = '/home'
                }
            })
    }

    const content = (
        <div id='main-container' className='h-screen w-full flex flex-col'>
            <button onClick={handleSignOut} className='self-start mt-3 p-1 animated-btn-1 bg-red-300'>Sign Out</button>
            <p>Your email is {currentUser.email}</p>
        </div>
    )

    return (
        <>
            {currentUser ? content : null}
        </> 
    )
}

export default HomePage
