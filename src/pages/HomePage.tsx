import { useAuth } from '../contexts/AuthContext'
import TopBar from '../components/TopBar'
import Snapshot from '../components/Snapshot'
import DashboardLayout from '../components/DashboardLayout'
import getDashboards from '../actions/getDashboards'
import { useEffect, useState } from 'react'


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
    header: string,
    subheader: string,
    color: string,
    content: DBContent
}
interface DBObjects {
    [key: string]: DBFields
}


const HomePage = () => {
    const [page, setPage] = useState(0)
    const [dashboards, setDashboards] = useState<DBObjects>({})
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
            setDashboards(response.result)
        })
    }, [])


    let pages: JSX.Element[] = []
    pages.push(<Snapshot />)
    Object.keys(dashboards).forEach(dbID => {
        let dbFields = dashboards[dbID]
        // Obtain the content information (DBContentFields) of each dashboard element
        let dbContent = Object.keys(dbFields['content']).map(contentIdx => dbFields['content'][contentIdx])
        pages.push(<DashboardLayout dbID={dbID} header={dbFields['header']} subheader={dbFields['subheader']} color={dbFields['color']} content={dbContent} />)
    })

    const prevBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={() => setPage(page - 1)}> Prev </button>
    )
    const nextBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={() => setPage(page + 1)}> Next </button>
    )

    const content = (
        <div id='main-container' className='h-screen w-full flex flex-col pb-4'>
            <TopBar />
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
