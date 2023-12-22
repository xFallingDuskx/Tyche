import './DashboardTable.css'

export type DBTableProps = {
    elKey: string,
    color: string,
    headers: string[],
    rows: string[][],
    sum?: number[], // which columns (0-based, from left) to create sum for
}

export const handleTableConversion = (tableEl: HTMLTableElement) => {
    let tHeaders: string[] = []
    Array.from(tableEl.querySelectorAll('thead th') ?? [])
        .forEach(th => tHeaders.push((th as HTMLTableCellElement).textContent ?? ''))

    let tRows: string[][] = []
    Array.from(tableEl.querySelectorAll('tbody > tr') ?? [])
        .forEach(tr => {
            let currRow: string[] = []
            Array.from(tr.children).forEach(td => currRow.push((td as HTMLTableCellElement).textContent ?? ''))
            tRows.push(currRow)
        }
        )
    
    let tSum = undefined ?? []

    return { tHeaders, tRows, tSum }
}

const DashboardTable = ({ elKey, color, headers, rows, sum }: DBTableProps) => {
    return (
        <div className='dbt w-full h-full flex flex-col' >
            <table id={`t-${elKey}`} style={{ border: `3px solid ${color}` }} className='flex-grow text-center'>
                <caption style={{ backgroundColor: color }} className='text-center text-xl p-1 uppercase font-thin w-full'>Head</caption>
                <thead style={{ backgroundColor: color, opacity: 0.7, border: `2px solid ${color}` }}>
                    <tr>
                        {headers.map(h => <th>{h}</th>)}
                    </tr>
                </thead>
                <tbody style={{ borderColor: color }} className='text-neutral-700 border-2 rounded-b-3xl'>
                    {rows.map(r =>
                        <tr>
                            {r.map(rItem =>
                                <td>{rItem}</td>
                            )}
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default DashboardTable
