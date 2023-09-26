import { useEffect, useState } from 'react'
import getFinancialAreas from '../actions/getFinancialAreas'
import { afCapitalize } from '../util/appFunctions'


const Snapshot = () => {
    const [userFinancialAreas, setUserFinancialAreas] = useState<string[]>([])
    const promise = getFinancialAreas()
    useEffect(() => {
        promise
            .then(response => {
                if (response.result) {
                    let _:string[] = []
                    let result = (response.result as string[])
                    result.forEach(word => _.push(afCapitalize(word)))
                    setUserFinancialAreas(_)
                }
            })
    }, [])

    return (
        <div className='dashboard-container'>
            {/* TODO: add logic later */}
            <div className='bg-blue-200 p-2 mt-2 rounded-xl'><h1 className='inline-block'> &#128205; Notices: </h1> <span className='text-slate-400'> none today! </span></div>
            <div className='bg-transparent border-neutral-400 border-2 box-border p-2 my-4 rounded-xl'>
                <h1 className='text-center text-3xl font-bold'> Goals </h1>
                <div className='flat-to-stack'>
                    <div className='fts-half-content'>
                        <h2 className='text-center text-2xl my-auto'> Year </h2>
                    </div>
                    <div className='fts-half-content'>
                        <h2 className='text-center text-2xl'> Month </h2>
                    </div>
                </div>
                <div className='border-t-2 border-neutral-400 p-2 mt-5'>
                    <h1 className='text-red-800 text-center'>Financial Focus Areas: <span className='text-black hover:no-underline'>{userFinancialAreas.length == 0 ? 'None yet!' : userFinancialAreas.toString()}</span></h1>
                </div>
            </div>
            {/* TODO: add logic later */}
            <div className='bg-gray-200 p-2 my-3 rounded-xl'><h1 className='inline-block'> &#x23F3; Check Ins: </h1> <span className='text-slate-400'> none today! </span></div>
            {/* TODO: add logic later */}
            <div className='bg-red-200 p-2 my-3 rounded-xl'><h1 className='inline-block'> &#128337; Reminders: </h1> <span className='text-slate-400'> none at the moment! </span></div>
            {/* TODO: add logic later */}
            <div className='bg-transparent border-neutral-400 border-2 box-border p-2 my-4 rounded-xl'><h1 className='inline-block'> &#x1f58a; Notes: </h1> <span className='text-slate-400'> none at the moment! </span></div>
        </div>
    )
}

export default Snapshot
