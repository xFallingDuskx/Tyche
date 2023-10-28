import { useAuth } from '../contexts/AuthContext'
import TopBar from '../components/TopBar'
import Snapshot from '../components/Snapshot'
import DashboardLayout from '../components/DashboardLayout'
import { useState } from 'react'


const HomePage = () => {
    const [page, setPage] = useState(0)
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

    let pages: JSX.Element[] = []
    pages.push(<Snapshot />)
    pages.push(<DashboardLayout header='General Finances' />)

    const prevBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={() => setPage(page - 1)}> Prev </button>
    )
    const nextBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={() => setPage(page + 1)}> Next </button>
    )

    const content = (
        <div id='main-container' className='h-screen w-full flex flex-col pb-4'>
            {/* TODO: add user Snapshot and all GeneralDashboar components here */}
            <TopBar />
            {/* <Snapshot />
            <DashboardLayout header='General Finances' bgColor='lightgray' /> */}
            {pages.at(page)}
            <div className='w-full flex'>
                {page > 0 && page <= pages.length ? prevBtn : null}
                {page >= 0 && page < pages.length - 1 ? nextBtn : null}
            </div>

        </div>
    )


    // const handleSelectionClick = (action: number) => {
    //     e.preventDefault()
    //     setStep(currStep - 1)
    // }

    return (
        <>
            {currentUser ? content : null}
        </>
    )
}

export default HomePage
