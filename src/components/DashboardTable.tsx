import './DashboardTable.css'

export type DBTableProps = {
    color: string
}

const DashboardTable = ({ color }: DBTableProps) => {
    return (
        <div className='dbt w-full h-full flex flex-col'>
            <table style={{ border: `3px solid ${color}` }} className='flex-grow text-center'>
                <caption style={{ backgroundColor: color }} className='text-center text-xl p-1 uppercase font-thin w-full'>Head</caption>
                <thead style={{ backgroundColor: color, opacity: 0.7, border: `2px solid ${color}` }}>
                    <tr>
                        <th>T1</th>
                        <th>T1</th>
                    </tr>
                </thead>
                <tbody style={{ borderColor: color }} className='text-neutral-700 border-2 rounded-b-3xl'>
                    <tr>
                        <td>T2</td>
                        <td>T2</td>
                    </tr>
                    <tr>
                        <td>T3</td>
                        <td>T3</td>
                    </tr>
                    <tr>
                        <td>T3</td>
                        <td>T3</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default DashboardTable
