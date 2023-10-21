import { useState } from 'react'
import signUpUser from '../firebase/auth/signUp'
import signInUser from '../firebase/auth/signIn'
import tempIcon from '/tyche-icon-temp.svg'
import './LandingPage.css'


const LandingPage = () => {
    const [hasAccount, setHasAccount] = useState(true)
    const [error, setError] = useState('')

    const handleSwitch = () => {
        setHasAccount(!hasAccount)
        setError('')
    }

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = (document.getElementById('email') as HTMLInputElement).value.toLowerCase().trim()
        const password = (document.getElementById('password') as HTMLInputElement).value.trim()
        const promise = signInUser(email, password)
        promise
            .then(response => {
                if (response.error) {
                    let error = 'Invalid login credentials'
                    if (response.error.code === 'auth/too-many-requests') {
                        error = 'Too many login attempts. Please try again later.'
                    }
                    setError(error)
                    console.log('Failed to log in:', response.error)
                } else {
                    document.location = '/home'
                }
            })

    }

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = (document.getElementById('email') as HTMLInputElement).value.toLowerCase().trim()
        const password = (document.getElementById('password') as HTMLInputElement).value.trim()
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value.trim()

        if (password.length < 6) {
            setError('Password should be at least 6 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        const promise = signUpUser(email, password)
        promise
            .then(response => {
                if (response.error) {
                    let error = 'Failed to create account. Please try again later.'
                    if (response.error.code === 'auth/email-already-in-use') {
                        error = 'Email already used. Please use a different email.'
                    }
                    setError(error)
                    console.log('Failed to sign up:', response.error)
                } else {
                    document.location = '/home'
                }
            })

    }

    const signinForm = (
        <div className='landing-page-form'>
            <form onSubmit={handleSignIn}>
                <input type='email' id='email' placeholder='Email Address' />
                <input type='password' id='password' placeholder='Password' />
                {error ? <small className='error'> {error} </small> : null}
                <button type='submit'> Login </button>
            </form>
            <br />
            <small>Don't have an account? <span onClick={handleSwitch}>Create one today!</span> </small>
        </div>
    )

    const signupForm = (
        <div className='landing-page-form'>
            <form onSubmit={handleSignUp}>
                <input type='email' id='email' placeholder='Email Address' />
                <input type='password' id='password' placeholder='Password' />
                <input type='password' id='confirmPassword' placeholder='Confirm Password' />
                {error ? <small className='error'> {error} </small> : null}
                <button type='submit'> Sign Up </button>
            </form>
            <br />
            <small>Already have an account? <span onClick={handleSwitch}>Sign In!</span> </small>
        </div>
    )

    return (
        <div id='main-container' className='self-start h-fit mx-auto text-center'>
            <img className='w-48 mx-auto my-5' src={tempIcon} alt='site-logo' />
            <h1 className='brand text-8xl mb-2 text-gradient from-black to-red-500 py-2'> Tyche </h1>
            <h2 className='text-xl text-gray-600 mb-16'>
                your bestfriend here to help manage your finances better than spreadsheets
            </h2>
            {/* <img className='w-48 mx-auto my-8' src='/tyche-icon-temp.svg' alt='site-logo' /> */}
            <br />
            {hasAccount ? signinForm : signupForm}
            {/* {error ? <small className='error'> {error} </small> : null} */}
        </div>
    )
}

export default LandingPage
