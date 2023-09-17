import { useAuth } from '../contexts/AuthContext'

const HomePage = () => {
    const { currentUser } = useAuth()
    return (
        <p>Your email is {currentUser?.email}</p>
    )
}

export default HomePage
