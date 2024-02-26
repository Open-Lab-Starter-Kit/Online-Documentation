import { useState, useContext, useEffect } from "react";
import ReactDOM from 'react-dom/client'
import Model from "../Components/Model.jsx";
import { useThree } from "@react-three/fiber";
import { ModelContext } from "../Components/ModelContext.jsx";

export default function PartsList() {

    const { modelProperties } = useContext(ModelContext)
    return <>
        <div >
            <ul>
                {modelProperties ? modelProperties.partsNames.map(([number, name], index) => <li key={index}><b> {number}x</b>  {name}</li>) : null}

            </ul>
        </div>
    </>


}