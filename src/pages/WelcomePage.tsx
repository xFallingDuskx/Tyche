import { useState } from 'react'
import signUpUser from '../firebase/auth/signUp'
import signInUser from '../firebase/auth/signIn'


const WelcomePage = () => {
    const [hasAccount, setHasAccount] = useState(true)
    const [error, setError] = useState("")

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
                    alert('successfullt logged in!')
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
                    alert('successfully signed up!')
                    document.location = '/home'
                }
            })

    }

    const signinForm = (
        <div>
            <form onSubmit={handleSignIn}>
                <input type='email' id='email' placeholder='Email Address'/>
                <input type='password' id='password' placeholder='Password'/>
                <button type='submit'> Login </button>
            </form>
            <br />
            <small>Don't have an account? <span onClick={() => setHasAccount(false)}>Create one today!</span> </small>
        </div>
    )

    const signupForm = (
        <div>
            <form onSubmit={handleSignUp}>
                <input type='email' id='email' placeholder='Email Address'/>
                <input type='password' id='password' placeholder='Password'/>
                <input type='password' id='confirmPassword' placeholder='Confirm Password'/>
                <button type='submit'> Sign Up </button>
            </form>
            <br />
            <small>Already have an account? <span onClick={() => setHasAccount(true)}>Login to get back started</span> </small>
        </div>
    )

    return (
        <div>
            <h1> Welcome to Tyche!</h1>
            <h2> The place to manage your finances in a way that's not boring </h2>
            <br />
            {hasAccount ? signinForm : signupForm}
            {error ? <small> {error} </small> : null}
        </div>
    )
}

export default WelcomePage
