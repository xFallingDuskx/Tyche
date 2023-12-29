import { useAuth } from '../contexts/AuthContext'
import TopBar from '../components/TopBar'
import Snapshot from '../components/Snapshot'
import DashboardLayout from '../components/DashboardLayout'
import getDashboards from '../actions/getDashboards'
import { useEffect, useState } from 'react'
import shortUUID from 'short-uuid'


export type DBContentGrid = {
    x: number,
    y: number,
    w: number,
    h: number,
}
export type DBContentFields = {
    key: string,
    grid: DBContentGrid,
    type: string,
    data: any
}
interface DBContent {
    [key: string]: DBContentFields
}
type DBFields = {
    // title: string,
    header: string,
    subheader: string,
    color: string,
    content: DBContent
}
interface DBObjects {
    [key: string]: DBFields
}


const HomePage = () => {
    const [pages, setPages] = useState<JSX.Element[]>([])
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

    const promise = getDashboards()
    useEffect(() => {
        promise.then(response => {
            if (response.error) {
                alert('🫠 Sorry, there was an issue fetching your dashboards. Please try again.')
                return
            }

            let dashboards = response.result
            let initialPages: JSX.Element[] = []
            initialPages.push(<Snapshot />)
            Object.keys(dashboards).forEach(dbID => {
                let dbFields = dashboards[dbID]
                // Obtain the content information (DBContentFields) of each dashboard element
                let dbContent = Object.keys(dbFields['content']).map(contentIdx => dbFields['content'][contentIdx])
                initialPages.push(<DashboardLayout key={dbID} dbID={dbID} header={dbFields['header']} subheader={dbFields['subheader']} color={dbFields['color']} content={dbContent} />)
            })

            setPages(initialPages)
        })
    }, [])


    const handleAddNewDashboard = () => {
        let newDashboardID = 'd-' + shortUUID.generate().toString()
        let tempPages = pages
        setPages([...tempPages, <DashboardLayout key={newDashboardID} dbID={newDashboardID} header='Title' subheader='' color='darkred' content={[]} />])
        setPage(page + 1)
    }

    const homeBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 mx-auto material-icons' onClick={() => setPage(0)}> home </button>
    )
    const prevBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={() => setPage(page - 1)}> Prev </button>
    )
    const nextBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={() => setPage(page + 1)}> Next </button>
    )
    const newDashboardBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto opacity-60' onClick={() => handleAddNewDashboard()}> + New Dashboard </button>
    )

    const content = (
        <div id='main-container' className='h-screen w-full flex flex-col pb-4'>
            <TopBar />
            {pages[page]}
            <div className='w-full flex'>
                {page > 0 && page <= pages.length ? prevBtn : null}
                {page > 0 && page <= pages.length ? homeBtn : null}
                {page >= 0 && page < pages.length - 1 ? nextBtn : null}
                {page === pages.length - 1 ? newDashboardBtn : null}
            </div>

        </div>
    )

    return (
        <>
            {currentUser ? content : null}
        </>
    )
}

export default HomePage
