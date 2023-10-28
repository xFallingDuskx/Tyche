import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import DashboardTable from './DashboardTable'
import './DashboardLayout.css'


export type DBLayoutProps = {
    header: string,
    subheader?: string,
}

const ResponsiveGridLayout = WidthProvider(Responsive)

/* TODO List:
   - Save updated dashboard layout and content
   - Fetch current dashboard layout and content
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
    const dashboardEl = document.getElementById('dashboard-a')
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



const DashboardLayout = ({ header, subheader }: DBLayoutProps) => {
    const [changesDetected, setChangesDetected] = useState(false)
    const [changesFailedToSave, setChangesFailedToSave] = useState(false)
    const [breakpoint, setBreakpoint] = useState('')

    const saveChanges = () => {
        // TODO: add logic

        setChangesDetected(false)
        setChangesFailedToSave(false)
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

    return (
        <div className='flex flex-col my-3'>
            {/* Info Banner */}
            {changesDetected && !changesFailedToSave ?
                <div onClick={() => saveChanges()}
                    className='self-center w-fit leading-7 text-xs text-center bg-blue-500 text-white rounded-2xl hover:bg-opacity-80 hover:cursor-pointer'>
                    &nbsp;&nbsp; 💡 Click here to save any changes &nbsp;&nbsp;
                </div>
                :
                changesDetected && changesFailedToSave ?
                    <div onClick={() => saveChanges()}
                        className='self-center w-fit leading-7 text-xs text-center bg-red-700 text-white rounded-2xl hover:bg-opacity-80 hover:cursor-pointer'>
                        &nbsp;&nbsp; 🫠 Failed to save changes. Click to try again. &nbsp;&nbsp;
                    </div>
                    : null}

            {/* TODO: dynamically set id and use in getCurrentBreakpoint() */}
            <div id='dashboard-a' onClick={() => setChangesDetected(true)} className='dbl p-1 rounded-xl bg-transparent'>
                <h1 className='text-center text-4xl px-1 py-4'>{header}</h1>
                {subheader ? <h2 className='text-center text-2xl'>{subheader}</h2> : null}
                <ResponsiveGridLayout
                    className='layout p-5 pt-0 mb-5'
                    breakpoints={dbBreakpoints}
                    margin={dbMargin}
                    cols={dbCols}
                    rowHeight={dbRowHeight}
                    onBreakpointChange={(b, _c) => { setBreakpoint(b) }}
                    onResize={handleOnResize}
                    preventCollision={false}>
                    <div key='a' data-grid={{ x: 0, y: 0, w: 2, h: 5 }}>
                        <DashboardTable />
                    </div>
                    <div key='b' data-grid={{ x: 5, y: 0, w: 5, h: 2 }}>
                        <DashboardTable />
                    </div>
                    <div key='c' data-grid={{ x: 14, y: 0, w: 3, h: 2 }}>
                        <DashboardTable />
                    </div>
                </ResponsiveGridLayout>
            </div>
        </div>
    )
}

export default DashboardLayout
