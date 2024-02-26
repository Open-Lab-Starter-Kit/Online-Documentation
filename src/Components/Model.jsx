import { useBounds, Clone } from "@react-three/drei"
import React, { useRef, useEffect, useContext, useState } from "react";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js"
import { extend, useThree } from "@react-three/fiber";
import { BackSide, Mesh, Box3, Group, MeshBasicMaterial, EdgesGeometry, LineBasicMaterial, LineSegments, BoxGeometry } from 'three'
import { ModelContext } from "./ModelContext.jsx";
import { useCallback } from "react";

extend({ OutlineEffect })

const stepsNames = []
//Array of names for navigation menu
const stepsNamesNavi = []


export default function Model({ modelIn, modelOut, modelInCopy }) {

    console.log("render count")

    const { gl, camera, scene } = useThree() //finds the renderer (gl)
    const machine = useRef()
    const machineAux = useRef()

    let { stepCount, partsInOut, setVisibleModel } = useContext(ModelContext)

    const [stepName, setStepName] = useState(false)
    const [stepNameNavi, setStepNameNavi] = useState(false)
    const [model, setModel] = useState(modelIn)
    const [modelAux, setModelAux] = useState(modelInCopy)

    const machineMaterial = new MeshBasicMaterial({
        //metalness: 0,
        color: 0xe5e5e5
    })
    const curvesMaterial = new MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    })

    var lineMat = new LineBasicMaterial({ color: 0x404040, linewidth: 10 });

    //find parts names and title and saves in an Array
    const [state, setState] = useState({
        partsNames: [],
        titleName: [model.scene.children[0].name === `${stepName[0]}`]
    })

    //Fabulaser Mini V3
    const exceptionArray = [
        "291_Prepare_the_Fillet_Profile"
    ]

    const preparingStepArray = [
        [
            "091_Bed_Frame",
            "092_Bed_Legs",
            "093_Bed_Lamella"
        ],
        [
            "141_Preparing_the_X-axis_1",
            "142_Preparing_the_X-axis_2",
            "143_Preparing_the_X-axis_3"
        ],
        [
            "301_Prepare_Window_1",
            "302_Prepare_the_Window_2"
        ]
    ]

    const mainMachineBuildArray = []
    let preparingTempArray = []

    useEffect(() => { //controls the parts in and out status
        if (partsInOut === true) {
            setModel(modelIn)
        } else if (partsInOut === false) {
            setModel(modelOut)
        }
        console.log("partsinout")
    }, [partsInOut])

    useEffect(() => { //activated once in the first render

        model.scene.traverse((children) => {
            //creates and array with the step titles names
            if (children.isObject3D && !children.isMesh && !children.isGroup) {
                stepsNames.push(children.name)
                stepsNamesNavi.push(children.userData.name)
            }
        })

        //sorts the step titles in the correct order
        stepsNames.sort()
        setStepName(stepsNames)

        //sorts the step titles in the correct order
        stepsNamesNavi.sort()
        setStepNameNavi(stepsNamesNavi)

        //Material for already built part (modelAux)
        modelAux.traverse((o) => {
            if (o.isMesh) {
                o.material = machineMaterial
                o.frustumCulled = false //fixes disappearing faces
                var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
                var wireframe = new LineSegments(geo, lineMat);
                o.add(wireframe);
                //o.add(outline)
                geo.dispose()
                o.geometry.dispose()
                machineMaterial.dispose()
            }
        });

    }, [])


    const isException = exceptionArray.some(arr => arr.includes(stepName[stepCount])) //boolean
    const isPreparingStep = preparingStepArray.some(arr => arr.includes(stepName[stepCount])) //boolean

    const currentStepObject = model.scene.getObjectByName(stepName[stepCount])

    const stepChange = useCallback(() => {

        console.log(currentStepObject)

        let uniqueNames = []
        let partsCount = []

        if (currentStepObject) {

            //updateModel();

            for (let i = 0; i < model.scene.children.length; i++) {
                //initially makes the model invisible
                model.scene.children[i].visible = false

                if (model.scene.children[i].name === `${stepName[stepCount]}`) {
                    model.scene.children[i].traverse((children) => {
                        //finds the name of the parts in the current step
                        if (children.isGroup) {
                            partsNamesArray.push(children.userData.name)
                        }
                        //unifies repeated names
                        uniqueNames = [...new Set(partsNamesArray)]
                        //counts repeated names in the array
                        partsCount = uniqueNames.map(value => [partsNamesArray.filter(str => str === value).length, value])

                        //finds the name of the step title in the current step
                        if (children.isObject3D && !children.isMesh && !children.isGroup) {
                            stepTitleArray.push(children.userData.name)
                        }

                    })
                    setState({ ...state, partsNames: partsCount, titleName: stepTitleArray })
                }

            }

            for (let i = 0; i < modelAux.children.length; i++) {
                //initially makes the modelAux invisible
                modelAux.children[i].visible = false
            }

            currentStepObject.traverse((o) => {
                if (o.isMesh) { //Assigns material to the objects of the current step
                    o.material = machineMaterial
                    machineMaterial.color.set(0xffffff);
                    o.frustumCulled = false //fixes disappearing faces
                    var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
                    var wireframe = new LineSegments(geo, lineMat);
                    o.add(wireframe);
                    geo.dispose()
                    machineMaterial.dispose()

                    if (o.userData.name === "Curves") { //Assigns material to curves
                        o.material = curvesMaterial
                        curvesMaterial.dispose()
                        o.geometry.dispose()
                    }
                    o.geometry.dispose()
                }
            });

            if (partsInOut === true) {
                //If it is listed in the exception Array, show model
                if (isException) {
                    console.log("exception in")
                    currentStepObject.visible = true;
                    setVisibleModel(currentStepObject);
                }
                else if (isPreparingStep) {
                    console.log("preparing step in")
                    currentStepObject.visible = true;

                    for (let k = 0; k < preparingStepArray.length; k++) { //separates the individual arrays inside preparingStepArray
                        const subArray = preparingStepArray[k];
                        for (let j = 0; j < subArray.length; j++) { //goes through every indiviual name inside the array
                            const isPreparingStepTemp = subArray.some(arr => arr.includes(stepName[stepCount])); //boolean - true if the current step name is found in the subarray
                            if (isPreparingStepTemp) {
                                for (let n = stepCount - 1; n >= 0; n--) { //count down for previous steps
                                    for (let m = subArray.length - 1; m >= 0; m--) { // count down the elements from subArray
                                        if (stepName[n] === subArray[m]) { //if the current step is the same as in the subArray, retrieves the model and adds to the preparringTemArray
                                            let previousStepsModel = modelAux.getObjectByName(`${stepName[n]}`, true)
                                            if (isPreparingStepTemp) {
                                                preparingTempArray.push(previousStepsModel)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    let groupVisibleObjPrep = new Group()
                    let clonedCurrentStepObject = currentStepObject.clone()
                    groupVisibleObjPrep.add(clonedCurrentStepObject)
                    //Go through each item of the preparingTempArray and display only what is not in the exception list
                    preparingTempArray.filter(obj => preparingStepArray.some(arr => arr.includes(obj.name)))
                        .forEach(obj => {
                            obj.visible = true;
                            let clonedObj = obj.clone();
                            groupVisibleObjPrep.add(clonedObj)
                        });

                    //saves the visible objects to use in the visualization bounding box  
                    setVisibleModel(groupVisibleObjPrep)

                }
                else {
                    console.log("main building step in")
                    currentStepObject.visible = true;
                    //If it is NOT listed in the exception Array or the preparing array, add it to the mainMachineBuildArray to be displayed later
                    //counts backwards the models of the previous steps
                    for (let n = stepCount - 1; n >= 0; n--) {
                        let previousStepsModel = modelAux.getObjectByName(`${stepName[n]}`, true)
                        mainMachineBuildArray.push(previousStepsModel)
                    }

                    let groupVisibleObj = new Group()
                    let clonedCurrentStepObject = currentStepObject.clone()
                    groupVisibleObj.add(clonedCurrentStepObject)
                    //Go through each item of the mainMachineBuildArray and display only what is not in the exception list
                    mainMachineBuildArray.filter(obj => !exceptionArray.some(arr => arr.includes(obj.name)) && !preparingStepArray.some(arr => arr.includes(obj.name)))
                        .forEach(obj => {
                            obj.visible = true;
                            let clonedObj = obj.clone();
                            groupVisibleObj.add(clonedObj)
                        });
                    //saves the visible objects to use in the visualization bounding box    
                    setVisibleModel(groupVisibleObj)

                }
            }

            if (partsInOut === false) {
                if (isException) {
                    console.log("exception out")
                    currentStepObject.visible = true;
                    setVisibleModel(currentStepObject);
                }
                else if (isPreparingStep) {
                    console.log("preparing step out")
                    currentStepObject.visible = true;
                    let groupVisibleObjPrep = new Group()
                    let clonedCurrentStepObject = currentStepObject.clone()
                    groupVisibleObjPrep.add(clonedCurrentStepObject)
                    for (let k = 0; k < preparingStepArray.length; k++) { //separates the individual arrays inside preparingStepArray
                        const subArray = preparingStepArray[k];
                        for (let j = 0; j < subArray.length; j++) { //goes through envery indiviual name inside the array
                            const isPreparingStepTemp = subArray.some(arr => arr.includes(stepName[stepCount])); //boolean - true if the current step name is found in the subarray
                            if (isPreparingStepTemp) {
                                for (let n = stepCount - 1; n >= 0; n--) { //count down for previous steps
                                    for (let m = subArray.length - 1; m >= 0; m--) { // count down the elements from subArray
                                        if (stepName[n] === subArray[m]) { //if the current step is the same as in the subArray, retrieves the model and adds to the preparringTemArray
                                            let previousStepsModel = modelAux.getObjectByName(`${stepName[n]}`, true)
                                            if (isPreparingStepTemp) {
                                                preparingTempArray.push(previousStepsModel)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //Go through each item of the preparingTempArray and display only what is not in the exception list
                    preparingTempArray.filter(obj => preparingStepArray.some(arr => arr.includes(obj.name)))
                        .forEach(obj => {
                            obj.visible = true;
                            let clonedObj = obj.clone();
                            groupVisibleObjPrep.add(clonedObj)
                        });

                    //saves the visible objects to use in the visualization bounding box    
                    setVisibleModel(groupVisibleObjPrep)

                }
                else {
                    console.log("main building step out")
                    currentStepObject.visible = true;
                    //If it is NOT listed in the exception Array or the preparing array, add it to the mainMachineBuildArray to be displayed later
                    //counts backwards the models of the previous steps
                    for (let n = stepCount - 1; n >= 0; n--) {
                        let previousStepsModel = modelAux.getObjectByName(`${stepName[n]}`, true)
                        mainMachineBuildArray.push(previousStepsModel)
                    }
                    console.log(mainMachineBuildArray)
                    let groupVisibleObj = new Group()
                    let clonedCurrentStepObject = currentStepObject.clone()
                    groupVisibleObj.add(clonedCurrentStepObject)
                    //Go through each item of the mainMachineBuildArray and display only what is not in the exception list
                    mainMachineBuildArray.filter(obj => !exceptionArray.some(arr => arr.includes(obj.name)) && !preparingStepArray.some(arr => arr.includes(obj.name)))
                        .forEach(obj => {
                            obj.visible = true;
                            let clonedObj = obj.clone();
                            groupVisibleObj.add(clonedObj)
                        });
                    //saves the visible objects to use in the visualization bounding box    
                    setVisibleModel(groupVisibleObj)
                }
            }
        }

    }, [currentStepObject, stepName, stepCount])

    useEffect(() => { //activated once there is a stepName
        stepChange()
    }, [currentStepObject, stepName, stepCount])

    const partsNamesArray = []
    const stepTitleArray = []

    //saves the names in the global context 
    const { setProperties } = useContext(ModelContext)
    setProperties(state)

    const { setListOfStep } = useContext(ModelContext)
    setListOfStep(stepNameNavi)


    return <>

        {stepName ? (<>
            < primitive ref={machine}
                object={model.scene}
                scale={1.0001}

                position-y={0.01}
            >
            </primitive >

            < primitive ref={machineAux}
                object={modelAux}
                scale={1}
            /* dispose={null} */
            >
            </primitive >
        </>
        ) : null
        }

    </>

}