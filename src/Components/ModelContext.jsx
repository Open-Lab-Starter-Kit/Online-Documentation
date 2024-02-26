import { createContext, useState, useEffect } from "react";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
    const [modelProperties, setModelProperties] = useState(null)
    const [stepCount, setStepCount] = useState(0)
    const [stepList, setStepList] = useState(null)
    const [partsInOut, setPartsInOut] = useState(true)
    const [visibleObj, setVisibleObj] = useState()
    const [currentStepName, setCurrentStepName] = useState()


    const setProperties = (name) => {
        setModelProperties(name)
    }

    const setStepPosition = (number) => {
        setStepCount(number)
    }

    const setListOfStep = (names) => {
        setStepList(names)
    }

    const setModelInOut = (boolean) => {
        setPartsInOut(boolean)
    }

    const setVisibleModel = (obj) => {
        setVisibleObj(obj)
    }

    const setCurrentName = (name) => {
        setCurrentStepName(name)
    }

    return (
        <ModelContext.Provider value={{
            modelProperties, setProperties,
            stepCount, setStepPosition,
            stepList, setListOfStep,
            partsInOut, setModelInOut,
            visibleObj, setVisibleModel,
            currentStepName, setCurrentName
        }}>
            {children}
        </ModelContext.Provider>
    )
}

