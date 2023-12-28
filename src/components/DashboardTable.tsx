import { useEffect, useState } from 'react'
import './DashboardTable.css'

export type DBTableProps = {
    elKey: string,
    color: string,
    title: string,
    headers: string[],
    rows: string[][],
    sum?: number[], // which columns (0-based, from left) to create sum for
}

export const handleTableConversion = (tableEl: HTMLTableElement) => {
    let tTitle = tableEl.querySelector('caption')?.textContent ?? ''

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

    return { tTitle, tHeaders, tRows, tSum }
}

const DashboardTable = ({ elKey, color, title, headers, rows, sum }: DBTableProps) => {
    const [tableRows, setTableRows] = useState(rows)
    const [total, setTotal] = useState(0)


    useEffect(() => {
        const table = document.getElementById(`t-${elKey}`) as HTMLTableElement
        const handleTableSumation = () => {
            let runningTotal = 0
            for (let r of table.rows) {
                let cellValue = parseFloat(r.cells[1]?.textContent ?? '')
                if (!Number.isNaN(cellValue)) {
                    runningTotal += cellValue
                }
            }
            setTotal(runningTotal)
        }
        handleTableSumation()

        table.addEventListener('input', () => {
            handleTableSumation()
        })
    }, [])

    const handleAddRow = () => {
        let table = (document.getElementById(`t-${elKey}`) as HTMLTableElement).parentElement?.parentElement
        if (table) {
            table.style.height = (table.offsetHeight + 35) + 'px'
        }

        const newRow = ['', '']
        let newRows = [...tableRows, newRow]
        setTableRows(newRows)
    }

    return (
        <div className='dbt w-full h-full flex flex-col' >
            <span className='db-item-drag-handle leading-3 font-extrabold absolute left-2 hover:cursor-move'> : : </span>
            <table id={`t-${elKey}`} style={{ border: `3px solid ${color}` }} className='flex-grow text-center'>
                <caption style={{ backgroundColor: color }}
                    className='text-center text-xl p-1 uppercase font-thin w-full'>
                    <div contentEditable suppressContentEditableWarning>{title}</div>
                </caption>
                <thead style={{ backgroundColor: color, opacity: 0.7, border: `2px solid ${color}` }}>
                    <tr>
                        {headers.map(h => <th><div contentEditable suppressContentEditableWarning>{h}</div></th>)}
                    </tr>
                </thead>
                <tbody style={{ borderColor: color }} className='text-neutral-700 border-2 rounded-b-3xl'>
                    {tableRows.map(r =>
                        <tr>
                            {r.map(rItem =>
                                <td><div contentEditable suppressContentEditableWarning>{rItem}</div></td>
                            )}
                        </tr>)}
                    <div className='h-2'/>
                </tbody>
                <tfoot>
                    <tr style={{ backgroundColor: color }} className='hover:bg-white'>
                        <td colSpan={2}>
                            <div className='!h-0.5'>
                                <button style={{ backgroundColor: color, borderColor: color }}
                                    onClick={() => handleAddRow()}
                                    className='btn-add-row block h-6 w-fit px-2 pb-1 mx-auto -mt-3 leading-3 rounded-full text-2xl z-50 hover:border-4'> &nbsp; &#43; &nbsp; </button>
                            </div>
                        </td>
                    </tr>
                    <div className='h-1'/>
                    <tr>
                        <td>total</td>
                        <td>${total}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default DashboardTable
