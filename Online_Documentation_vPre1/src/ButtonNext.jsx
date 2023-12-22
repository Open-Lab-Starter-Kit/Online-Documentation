import { useContext, useState, useEffect } from 'react'
import { ModelContext } from './ModelContext.jsx'

export default function ButtonNext() {

    let { setStepPosition, stepCount } = useContext(ModelContext)

    const buttonClickNext = () => {

        stepCount++
        setStepPosition(stepCount)

    }
    const buttonClickPrevious = () => {

        stepCount--
        setStepPosition(stepCount)

    }

    return <>
        {stepCount >= 1 ?
            <button onClick={buttonClickPrevious} className="btn" id="nextStep">Previous Step &nbsp;<i
                className="fa-sharp fa-solid fa-play"></i></button> : null}

        <button onClick={buttonClickNext} className="btn" id="nextStep">Next Step &nbsp;<i
            className="fa-sharp fa-solid fa-play"></i></button>
    </>
}

