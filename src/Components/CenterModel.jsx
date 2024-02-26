import { useBounds } from '@react-three/drei'
import { useEffect, useContext, useRef } from 'react'
import { ModelContext } from "./ModelContext.jsx"


export default function CenterModel() {

    let { visibleObj, modelProperties } = useContext(ModelContext)
    const api = useBounds()

    useEffect(() => {

        api.refresh(visibleObj).clip().fit()

    }, [modelProperties])

}