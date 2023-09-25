import signOutUser from '../firebase/auth/signOut'
import './TopBar.css'


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

const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // TODO: design user profile page
    document.location = '/profile'
}


const TopBar = () => {
    return (
        <>
            <div id='topbar-screen' className='w-full flex py-1 justify-between'>
                <button onClick={handleSignOut} className='p-1 mt-1 animated-btn-1 bg-red-300'> Sign Out </button>
                <h1 className='brand my-auto text-5xl mb-2 py-2 text-gradient from-black to-red-500'> Tyche </h1>
                <button onClick={handleProfileClick} className='p-1 mt-1 animated-btn-1 bg-red-300'> Profile </button>
            </div>
            <div id='topbar-mobile' className='w-full flex flex-col py-1'>
                <h1 className='brand text-center text-4xl mb-2 text-gradient from-black to-red-500'> Tyche </h1>
                <div className='w-full flex'>
                    <span onClick={handleSignOut} className='text-black w-1/2 text-center border-r-2 border-black'> Sign Out </span>
                    <span onClick={handleProfileClick} className='text-black w-1/2 text-center'> Profile </span>
                </div>
            </div>
        </>
    )
}

export default TopBar
