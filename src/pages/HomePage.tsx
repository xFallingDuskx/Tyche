import { useAuth } from '../contexts/AuthContext'
import TopBar from '../components/TopBar'
import Snapshot from '../components/Snapshot'


const HomePage = () => {
    const { currentUser } = useAuth()
    if (!currentUser) {
        document.location = '/'
        return
    }

    if (currentUser.displayName === null) {
        document.location = '/welcome'
        return
    }

    // TODO: only fetch if needed - use to design initial dashboards 

    const content = (
        <div id='main-container' className='h-screen w-full flex flex-col p-0'>
            {/* TODO: add user Snapshot and all GeneralDashboar components here */}
            <TopBar />
            <Snapshot />
            {/* TODO: create PageSelection component that will permanently be placed at the bottom. it will allow users
                      to switch between their snapshot and dashboards.
             */}
        </div>
    )

    return (
        <>
            {currentUser ? content : null}
        </>
    )
}

export default HomePage