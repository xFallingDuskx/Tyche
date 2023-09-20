import { useEffect, useState } from 'react'
import updateFinancialAreas from '../actions/updateFinancialAreas'
import updateUsername from '../actions/updateUsername'
import { useAuth } from '../contexts/AuthContext'
import './WelcomePage.css'


const WelcomePage = () => {
    const [currStep, setStep] = useState(-1)
    const [userPreferredName, setUserPreferredName] = useState('')
    const [userFinancialAreas, setUserFinancialAreas] = useState<string[]>([])
    const [preferredNameError, setPreferredNameError] = useState('')
    const [financialAreasError, setFinancialAreasError] = useState('')
    const { currentUser } = useAuth()

    if (!currentUser) {
        document.location = '/'
        return
    }

    if (currentUser.displayName) {
        document.location = '/home'
        return
    }

    const handleHomeClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        const failureMessage = 'Failed to finish account set up, sorry! Please try again later!'

        const promiseOne = updateUsername(currentUser, userPreferredName)
        promiseOne
            .then(response => {
                if (response.error) {
                    alert(failureMessage)
                    return
                }

                const promiseTwo = updateFinancialAreas(currentUser, userFinancialAreas)
                promiseTwo
                    .then(responseTwo => {
                        if (responseTwo.error) {
                            alert(failureMessage)
                            return
                        }
                        document.location = '/home'
                    })
            })
    }

    const checkUserInput = () => {
        const nameInput = (document.getElementById('user-preferred-name') as HTMLInputElement).value.trim()
        if (!nameInput) {
            setPreferredNameError('Hey, I still don\'t know what to call you')
        } else {
            setPreferredNameError('')
            setUserPreferredName(nameInput)
        }

        let selectedFinancialAreas: string[] = []
        let financialAreasInput = document.querySelectorAll('input[name=finance-area]:checked')
        for (let fa of financialAreasInput) {
            const labelValue = fa.id.substring(3).replace(/-/g, ' ').replace('and', '&')
            selectedFinancialAreas.push(labelValue)
        }

        setUserFinancialAreas(selectedFinancialAreas)
        if (selectedFinancialAreas.length == 0) {
            setFinancialAreasError('I can help you better after you choose at least one')
        } else {
            setFinancialAreasError('')
        }

        if (nameInput && selectedFinancialAreas.length !== 0) {
            setStep(currStep + 1)
        }
    }

    const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setStep(currStep - 1)
    }

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (currStep == 2) {
            checkUserInput()
        } else {
            setStep(currStep + 1)
        }
    }

    let steps: JSX.Element[] = []
    const step0 = (
        <>
            <h1 className='text-4xl'> Welcome to <span className='brand text-6xl text-gradient from-black to-red-500'> Tyche </span></h1>
            <h2 className='text-xl'>Here to help you manage your finances easier than spreadsheets.</h2>
        </>
    )

    const step1 = (
        <>
            <h1 className='text-3xl my-4 font-bold'> My Belief </h1>
            <p className='text-lg'>
                Finances can already be quite stressful, complicated, and overwhelming at times. As such, I, your best friend, believe
                that managing them should be as easy and pleasant as possible. That means no spending time on spreadsheets, no writing
                on scrap paper, and surely not trying to keep it all in your head.
                <br /><br />
                When it comes to finances, nothing else matters besides what you're hoping to achieve with your finances.
                So, I won't ask you for bank account information or really anything else so critical. After all, I want to <i>help </i>
                you manage your finances, not do it for you. That's the only way we get better at these things, right?
                <br /><br />
                Now, what I truly care about are just two things...
            </p>
        </>
    )

    const step2 = (
        <>
            <label htmlFor='user-preferred-name' className='text-2xl mb-2'> What Should I Call You? </label>
            <input type='text' id='user-preferred-name' className='text-lg text-center' autoComplete='off' />
            {preferredNameError ? <small className='error mt-1'>{preferredNameError}</small> : null}
            <label htmlFor='user-financial-focus-areas' className='text-2xl mt-6 mb-2'> Which Financial Areas Do You Want To Focus On? </label>
            <div id='user-financial-focus-areas'>
                <div className='checkbox-wrapper-1'>
                    <input type='checkbox' id='fa-cash-flow-tracking' name='finance-area' />
                    <label htmlFor='fa-cash-flow-tracking' className='text-lg'> Cash Flow Tracking </label>
                    <div className='tooltip-r text-xs align-top'>&nbsp; &#9432;
                        <p className='tooltip-text bg-gray-200 text-black text-sm'>
                            Track when you're paid, bills are due, a significant amount of money was spent, and more.
                        </p>
                    </div>
                </div>
                <div className='checkbox-wrapper-1'>
                    <input type='checkbox' id='fa-budgeting' name='finance-area' />
                    <label htmlFor='fa-budgeting' className='text-lg'> Budgeting </label>
                </div>
                <div className='checkbox-wrapper-1'>
                    <input type='checkbox' id='fa-saving' name='finance-area' />
                    <label htmlFor='fa-saving' className='text-lg'> Saving </label>
                </div>
                <div className='checkbox-wrapper-1'>
                    <input type='checkbox' id='fa-credit' name='finance-area' />
                    <label htmlFor='fa-credit' className='text-lg'> Credit </label>
                </div>
                <div className='checkbox-wrapper-1'>
                    <input type='checkbox' id='fa-debt-and-loans' name='finance-area' />
                    <label htmlFor='fa-debt-and-loans' className='text-lg'> Debt & Loans </label>
                </div>
                <div className='checkbox-wrapper-1'>
                    <input type='checkbox' id='fa-retirement' name='finance-area' />
                    <label htmlFor='fa-retirement' className='text-lg'> Retirement </label>
                </div>
                {financialAreasError ? <small className='error'>{financialAreasError}</small> : null}
            </div>
        </>
    )

    const step3 = (
        <>
            <p className='text-lg'>
                Amazing!
                <br />
                It's great to meet you <span className='font-extrabold text-black'>{userPreferredName}</span>! I can't wait to help you
                with
            </p>
            <ul className='list-disc'>
                {userFinancialAreas.map((fa) => <li key={fa} className='text-lg font-extrabold capitalize w-fit mx-auto'>{fa}</li>)}
            </ul>
            <p className='text-lg mt-2'>
                Ready to get started? To kick it off, go <span onClick={handleHomeClick} className='text-red-800 hover:underline hover:cursor-pointer'>Home</span> and set up your dashboards.
                You've got this!
            </p>
        </>
    )

    steps.push(step0)
    steps.push(step1)
    steps.push(step2)
    steps.push(step3)

    // Ensure that welcome page always begins at step0
    useEffect(() => {
        if (currentUser?.displayName) {
            setStep(-1)
        } else {
            setStep(0)
        }
        return () => { }
    }, [])


    const prevBtn = (
        <button className='animated-btn-2 bg-red-300 mt-8 w-fit mx-auto' onClick={handlePrev}> Prev </button>
    )
    const nextBtn = (
        <button className='animated-btn-2 bg-red-300 my-6 w-fit mx-auto' onClick={handleNext}> Next </button>
    )
    return (
        <div id='main-container' className='flex flex-col p-0 m-0 w-full justify-center place-items-center text-center'>
            <div className='scroll-container hide-scrollbar flex flex-col'>
                {!currentUser ? null : steps.at(currStep)}
                {currStep > 0 && currStep <= 3 ? prevBtn : null}
                {currStep >= 0 && currStep < 3 ? nextBtn : null}
            </div>

        </div>
    )
}

export default WelcomePage
