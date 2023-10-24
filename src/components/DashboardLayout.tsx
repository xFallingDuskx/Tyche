import { Responsive, WidthProvider } from "react-grid-layout";


export type DBLayoutProps = {
    header: string,
    subheader?: string,
    bgColor: string,
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardLayout = ({ header, subheader, bgColor }: DBLayoutProps) => {

    return (
        <div style={{ backgroundColor: bgColor }} className='p-1 mt-5 mb-3 rounded-xl'>
            <h1 className='text-center text-4xl px-1 py-4'>{header}</h1>
            {subheader ? <h2>{subheader}</h2> : null}
            <ResponsiveGridLayout
                className="layout p-5 pt-0 mb-5"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                isResizable={false}
                preventCollision={true}>
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
    )
}

export default DashboardLayout
