import { useState } from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";


export type DBLayoutProps = {
    header: string,
    subheader?: string,
    bgColor: string,
}

const ResponsiveGridLayout = WidthProvider(Responsive);

/* TODO List:
   - Save updated dashboard layout and content
   - Fetch current dashboard layout and content
   - Design basic table element (allow horizontal scrolling)
   - Ensure table content can be saved
   - Allow CRUD of layout elements
     - Click on element to change it to an "active" state
   - Allow CRUD of dashboards
*/

const DashboardLayout = ({ header, subheader, bgColor }: DBLayoutProps) => {
    const [changesDetected, setChangesDetected] = useState(false)
    const [changesFailedToSave, setChangesFailedToSave] = useState(false)

    const saveChanges = () => {
        // TODO: add logic

        setChangesDetected(false)
        setChangesFailedToSave(false)
    }

    return (
        <div className='flex flex-col my-3'>
            {/* Info Banner */}
            {changesDetected && !changesFailedToSave ?
                <div onClick={() => saveChanges()}
                    className='self-center w-fit leading-7 text-xs text-center bg-blue-500 text-white rounded-t-xl hover:bg-opacity-80 hover:cursor-pointer'>
                    &nbsp;&nbsp; 💡 Click here to save any changes &nbsp;&nbsp;
                </div>
                :
                changesDetected && changesFailedToSave ?
                    <div onClick={() => saveChanges()}
                        className='self-center w-fit leading-7 text-xs text-center bg-red-700 text-white rounded-t-xl hover:bg-opacity-80 hover:cursor-pointer'>
                        &nbsp;&nbsp; 🫠 Failed to save changes. Click to try again. &nbsp;&nbsp;
                    </div>
                    : null}

            <div onClick={() => setChangesDetected(true)} style={{ backgroundColor: bgColor }} className='p-1 rounded-xl'>
                <h1 className='text-center text-4xl px-1 py-4'>{header}</h1>
                {subheader ? <h2 className='text-center text-2xl'>{subheader}</h2> : null}
                <ResponsiveGridLayout
                    className="layout p-5 pt-0 mb-5"
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    isResizable={false}
                    preventCollision={false}>
                    <div className='border-2 border-black' key="a" data-grid={{ x: 0, y: 0, w: 2, h: 2 }}>
                        a
                    </div>
                    <div className='border-2 border-black' key="b" data-grid={{ x: 5, y: 0, w: 5, h: 2, minW: 2, maxW: 4 }}>
                        b
                    </div>
                    <div className='border-2 border-black' key="c" data-grid={{ x: 14, y: 0, w: 3, h: 2 }}>
                        c
                    </div>
                </ResponsiveGridLayout>
            </div>
        </div>
    )
}

export default DashboardLayout
