import { useState } from 'react'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import updateDashboardContent from '../actions/updateDashboardContent'
import { useAuth } from '../contexts/AuthContext'
import { DBContentFields, DBContentGrid } from '../pages/HomePage'
import './DashboardLayout.css'
import DashboardTable, { handleTableConversion } from './DashboardTable'
import shortUUID from 'short-uuid'


export type DBLayoutProps = {
    dbID: string,
    header: string,
    subheader?: string,
    color: string,
    content: DBContentFields[],
}

const ResponsiveGridLayout = WidthProvider(Responsive)

/* TODO List:
   - Design basic table element (allow horizontal scrolling)
   - Ensure table content can be saved
   - Allow CRUD of layout elements
     - Click on element to change it to an 'active' state
   - Allow CRUD of dashboards
*/

const dbBreakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const dbMargin: [number, number] = [15, 15]
const dbCols = { lg: 12, md: 10, sm: 16, xs: 4, xxs: 2 }
const dbRowHeight = 25

const getCurrentBreakpoint = () => {
    const dashboardEl = document.getElementById('d-123')
    const dashboardWidth = dashboardEl!.clientWidth

    let breakpoint = ''
    if (dashboardWidth > dbBreakpoints.lg) {
        breakpoint = 'lg'
    } else if (dashboardWidth > dbBreakpoints.md) {
        breakpoint = 'md'
    } else if (dashboardWidth > dbBreakpoints.sm) {
        breakpoint = 'sm'
    } else if (dashboardWidth > dbBreakpoints.xs) {
        breakpoint = 'xs'
    } else {
        breakpoint = 'xxs'
    }

    return breakpoint
}


const DashboardLayout = ({ dbID, header, subheader, color, content }: DBLayoutProps) => {
    const [dbHeader, setDbHeader] = useState(header)
    const [dbSubheader, setDbSubheader] = useState(subheader)
    const [editDbHeaders, setEditDbHeaders] = useState(false)
    const [accentColor, setAccentColor] = useState(color)
    const [dbContent, setDbContent] = useState(content)
    const [changesDetected, setChangesDetected] = useState(false)
    const [changesFailedToSave, setChangesFailedToSave] = useState(false)
    const [breakpoint, setBreakpoint] = useState('')
    const [dbCurrentLayout, setDbCurrentLayout] = useState<Layout[]>()
    const { currentUser } = useAuth()

    if (!currentUser) {
        document.location = '/'
        return
    }

    const getCurrentBreakpoint = () => {
        const dashboardEl = document.getElementById(dbID)
        const dashboardWidth = dashboardEl!.clientWidth
    
        let breakpoint = ''
        if (dashboardWidth > dbBreakpoints.lg) {
            breakpoint = 'lg'
        } else if (dashboardWidth > dbBreakpoints.md) {
            breakpoint = 'md'
        } else if (dashboardWidth > dbBreakpoints.sm) {
            breakpoint = 'sm'
        } else if (dashboardWidth > dbBreakpoints.xs) {
            breakpoint = 'xs'
        } else {
            breakpoint = 'xxs'
        }
    
        return breakpoint
    }

    const saveChanges = () => {
        const dbEl = document.querySelector('.dbl') as HTMLDivElement
        let dbContent: any[] = []
        const dbItems = dbEl.querySelectorAll('.dbl-item')
        dbItems.forEach((item, idx) => {
            let itemKey = item.getAttribute('itemID')

            let itemLayout = dbCurrentLayout?.at(idx)
            let itemGrid: DBContentGrid = {
                x: itemLayout?.x ?? 0,
                y: itemLayout?.y ?? 0,
                w: itemLayout?.w ?? 0,
                h: itemLayout?.h ?? 0,
            }

            let itemType = ''
            let itemData = {}

            if (item.getAttribute('itemType') === 'dbtable') {
                const conversion = handleTableConversion(item.querySelector('table') as HTMLTableElement)
                itemType = 'table'
                itemData = {
                    title: conversion.tTitle,
                    headers: conversion.tHeaders,
                    rows: conversion.tRows,
                    sum: conversion.tSum
                }
            }

            dbContent.push({
                key: itemKey,
                grid: itemGrid,
                type: itemType,
                data: itemData,
            })
        })

        const promise = updateDashboardContent(currentUser, dbID, dbHeader, dbSubheader ?? '', accentColor, dbContent)
        promise
            .then(response => {
                if (response.error) {
                    console.error('failed to save dashboard: ' + response.error)
                    setChangesDetected(true)
                    setChangesFailedToSave(true)
                    return
                }
                setChangesDetected(false)
                setChangesFailedToSave(false)
                setEditDbHeaders(false)
            })
    }

    const handleOnLayoutChange = (currentLayout: ReactGridLayout.Layout[], _: ReactGridLayout.Layouts) => {
        setDbCurrentLayout(currentLayout)
    }

    const handleOnResize = (_layout: ReactGridLayout.Layout[], _oldItem: ReactGridLayout.Layout,
        newItem: ReactGridLayout.Layout, placeholder: ReactGridLayout.Layout,
        _event: MouseEvent, element: HTMLElement) => {

        // ensure that container is not resized to be smaller than its content
        const innerContent = element.previousElementSibling
        const parentWidth = element.parentElement!.parentElement!.clientWidth
        let colWidth = -1

        let currBreakpoint = breakpoint
        if (breakpoint === '') {
            currBreakpoint = getCurrentBreakpoint()
            setBreakpoint(currBreakpoint)
        }

        switch (currBreakpoint) {
            case 'lg':
                colWidth = parentWidth / dbCols.lg
                break
            case 'md':
                colWidth = parentWidth / dbCols.md
                break
            case 'sm':
                colWidth = parentWidth / dbCols.sm
                break
            case 'xs':
                colWidth = parentWidth / dbCols.xs
                break
            case 'xxs':
                colWidth = parentWidth / dbCols.xxs
                break
            default:
                console.log('invalid breakpoint:', currBreakpoint)
                break
        }

        let w = Math.ceil((innerContent!.clientWidth - dbMargin[0]) / (colWidth + dbMargin[0])) + 1
        let h = Math.ceil((innerContent!.scrollHeight - dbMargin[1]) / (dbRowHeight + dbMargin[1])) + 1
        // newItem.minH = h
        // placeholder.minH = h

        if (newItem.w < w) {
            newItem.w = w
            placeholder.w = w
        }

        if (newItem.h < h) {
            newItem.h = h
            placeholder.h = h
        }

        setChangesDetected(true)
    }


    const handleNewElement = () => {
        const newTable: DBContentFields = {
            key: shortUUID.generate().toString(),
            grid: { x: 99999, y: 99999, w: 2, h: 4 },
            type: 'table',
            data: {
                title: 'Title',
                headers: ['Item', 'Amount ($)'],
                rows: [['', '']]
            }
        }
        let newDbContent = [...dbContent, newTable]
        setDbContent(newDbContent)
        setChangesDetected(true)
    }

    return (
        <div className='flex flex-col my-3'>
            {/* Info Banner */}
            <div className='flex w-full'>
                {changesDetected && !changesFailedToSave ?
                    <div onClick={() => saveChanges()}
                        className='w-fit leading-7 tracking-wider text-sm text-center bg-blue-500 text-white rounded-2xl hover:bg-opacity-80 hover:cursor-pointer'>
                        &nbsp; 💡 Click here to save any changes &nbsp;
                    </div>
                    :
                    changesDetected && changesFailedToSave ?
                        <div onClick={() => saveChanges()}
                            className='self-center w-fit leading-7 tracking-wider text-sm text-center bg-red-700 text-white rounded-2xl hover:bg-opacity-80 hover:cursor-pointer'>
                            &nbsp; 🫠 Failed to save changes. Click to try again. &nbsp;
                        </div>
                        : null}
                <button
                    onClick={() => handleNewElement()}
                    className='ml-auto mr-2 w-fit leading-7 tracking-wider text-sm'> + new element </button>
            </div>


            {/* TODO: dynamically set id and use in getCurrentBreakpoint() */}
            <div id={dbID} onClick={() => setChangesDetected(true)} className='dbl p-1 rounded-xl bg-transparent'>
                <div className='flex justify-center'>
                    <label htmlFor='db-color-selector'
                        style={{ backgroundColor: accentColor }}
                        className='w-2 mr-1 inline-block rounded-full my-auto outline-none'>
                        <input type='color' value={accentColor}
                            id='db-color-selector'
                            name='db-color-selector'
                            onChange={(e) => setAccentColor(e.target.value)}
                            className='w-full border-0 focus:border-0 outline-1 outline-dotted p-0 invisible' />
                    </label>
                    {editDbHeaders ? <input type='text' value={dbHeader} placeholder='Enter header'
                        className='text-center !text-4xl px-1 pt-4' onChange={e => setDbHeader(e.target.value)} />
                        : <h1 className='text-center text-4xl px-1 py-4'
                            onClick={_ => setEditDbHeaders(true)}>{dbHeader}</h1>}
                    {/* <h1 className='text-center text-4xl px-1 py-4'>{dbHeader}</h1> */}
                </div>
                {editDbHeaders ? <input type='text' value={dbSubheader} placeholder='Enter subheader'
                    className='block mx-auto text-center !text-2xl italic text-gray-500 my-2' onChange={e => setDbSubheader(e.target.value)} />
                    : dbSubheader ? <h2 className='text-center text-2xl italic text-gray-500 mb-2 -mt-3'
                        onClick={_ => setEditDbHeaders(true)}>{dbSubheader}</h2> : null}

                <ResponsiveGridLayout
                    className='layout p-5 pt-0 mb-5'
                    breakpoints={dbBreakpoints}
                    draggableHandle='.db-item-drag-handle'
                    margin={dbMargin}
                    cols={dbCols}
                    rowHeight={dbRowHeight}
                    onBreakpointChange={(b, _c) => { setBreakpoint(b) }}
                    onResize={handleOnResize}
                    onLayoutChange={handleOnLayoutChange}>
                    {dbContent.map(el =>
                        el.type === 'table' ?
                            <div key={el.key} itemID={el.key} data-grid={el.grid} className='dbl-item' itemType='dbtable'>
                                <DashboardTable elKey={el.key} color={accentColor} title={el.data.title} headers={el.data.headers} rows={el.data.rows} sum={el.data.sum} />
                            </div>
                            : null
                    )}
                </ResponsiveGridLayout>
            </div>
        </div>
    )
}

export default DashboardLayout
