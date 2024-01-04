import { useContext, useState, useEffect } from 'react'
import { ModelContext } from './ModelContext.jsx'

export default function ButtonPartsOut() {

    const { setModelInOut } = useContext(ModelContext)
    const [partsOut, setPartsOut] = useState(false)

    const buttonClickPartsOut = () => {

        if (partsOut == false) {
            document.getElementById("partsOut").innerHTML = "Assemble";
            setPartsOut(true)
            setModelInOut(partsOut)
        }
        else if (partsOut == true) {
            document.getElementById("partsOut").innerHTML = "Explode";
            setPartsOut(false)
            setModelInOut(partsOut)
        }

    }

    return <>

        <button onClick={buttonClickPartsOut} className="btn" id="partsOut">Explode</button>
    </>
}

