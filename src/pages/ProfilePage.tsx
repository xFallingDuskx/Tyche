import './ProfilePage.css'
import { useAuth } from '../contexts/AuthContext'
import signOutUser from '../firebase/auth/signOut'
import { useState } from 'react'


const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const promise = signOutUser()
    promise
        .then(response => {
            if (!response.error) {
                document.location = '/home'
            }
        })
}


const ProfilePage = () => {
    const [viewingContent, setViewingContent] = useState<JSX.Element|null>(null)
    const { currentUser } = useAuth()
    if (!currentUser) {
        document.location = '/'
        return
    }

    if (currentUser.displayName === null) {
        document.location = '/welcome'
        return
    }

    const generalContent = (
        <>
            <h2>General</h2>
        </>
    )

    const personalInfoContent = (
        <>
            <h2>Personal Information</h2>
        </>
    )

    const accountMattersContent = (
        <>
            <h2>Account Matters</h2>
        </>
    )

    const securityprivacyContent = (
        <>
            <h2>Security & Privacy</h2>
        </>
    )

    const placeholderContent = (
        <h1 className='brand mt-20 text-center text-8xl h-fit py-4 text-gradient from-black to-red-500 opacity-50'> Tyche </h1>
    )


    return (
        <div id='main-container' className='h-screen w-full flex flex-col pb-4'>
            <button className='text-xl mb-2 w-fit' onClick={() => document.location = '/home'}> &lt; Home </button>
            <div className='flat-to-stack h-screen'>
                <div className='fts-half-content mb-5'>
                    <h1 className='mx-auto text-5xl text-red-700 mb-3'>Hey, {currentUser.displayName}</h1>
                    <ul id='profile-options-tab'>
                        <li onClick={() => setViewingContent(generalContent)}>General</li>
                        <li onClick={() => setViewingContent(personalInfoContent)}>Personal Information</li>
                        <li onClick={() => setViewingContent(accountMattersContent)}>Account Matters</li>
                        <li onClick={() => setViewingContent(securityprivacyContent)}>Security & Privacy</li>
                    </ul>
                    <button
                        className='animated-btn-2 bg-red-300 !block my-6 !text-lg !py-1'
                        onClick={handleSignOut}> Sign Out </button>
                    <button
                        className='animated-btn-2 bg-black !text-red-300 !block my-6 !text-lg !py-1'> Delete Account </button>
                </div>
                <div id='profile-details-tab' className='fts-half-content'>
                    {viewingContent ?? placeholderContent}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
