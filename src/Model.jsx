import React, { useRef, useEffect, useContext, useState } from "react";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import { extend } from "@react-three/fiber";

import {
  Group,
  MeshBasicMaterial,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";
import MouseEvent from "./MouseEvent.jsx";
import { ModelContext } from "./ModelContext.jsx";

extend({ OutlineEffect });

export default function Model({ modelIn, modelOut, modelInCopy }) {
  const machine = useRef();
  const machineAux = useRef();

  let { stepCount, partsInOut, setVisibleModel } = useContext(ModelContext);

  const [stepName, setStepName] = useState(false);
  const [stepNameNavi, setStepNameNavi] = useState(false);
  const [model, setModel] = useState(modelIn);
  const [modelAux, setModelAux] = useState(modelInCopy);

  //find parts names and title and saves in an Array
  const [state, setState] = useState({
    partsNames: [],
    titleName: [model.scene.children[0].name === `${stepName[0]}`],
  });

  useEffect(() => {
    //controls the parts in and out status
    if (partsInOut === true) {
      setModel(modelIn);
    } else if (partsInOut === false) {
      setModel(modelOut);
    }
  }, [partsInOut]);

  useEffect(() => {
    //activated once in the first render
    const stepsNames = [];
    //creates and array with the step titles names
    model.scene.traverse((children) => {
      if (children.isObject3D && !children.isMesh && !children.isGroup) {
        stepsNames.push(children.name);
      }
    });
    //sorts the step titles in the correct order
    stepsNames.sort();
    setStepName(stepsNames);

    //Array of names for navigation menu
    const stepsNamesNavi = [];

    //creates and array with the step titles names
    model.scene.traverse((children) => {
      if (children.isObject3D && !children.isMesh && !children.isGroup) {
        stepsNamesNavi.push(children.userData.name);
      }
    });
    //sorts the step titles in the correct order
    stepsNamesNavi.sort();
    setStepNameNavi(stepsNamesNavi);

    modelAux.traverse((o) => {
      if (o.isMesh) {
        o.material = new MeshBasicMaterial({ color: 0xd9d9d9 });
        o.material.metalness = 0;
        var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
        var mat = new LineBasicMaterial({ color: 0x404040, linewidth: 0.01 });
        var wireframe = new LineSegments(geo, mat);
        o.add(wireframe);
      }
    });
  }, []);

  const exceptionArray = [
    "02-1_Prepare_Left_Panel",
    "02-2_Prepare_Back_Panel",
    "03-1_Prepare_Ball_Screw_Y",
    "03-2_Prepare_Ball_Screw_X",
    "03-3_Prepare_Ball_Screw_Z",
  ];

  const preparingStepArray = [
    [
      "01-1_Electronic_Box_Frame_-_Top_and_Bottom",
      "01-2_Electronic_Box_-_Bottom_Panel",
      "01-3_Electronic_Box_-_Drivers_and_Power_Supply",
      "01-4_Electronic_Box_Frame_-_vertical_profiles",
      "01-5_Electronic_Box_-_PCBs",
      "02-3_Attaching_Sides,_Front_and_Back_Panels",
    ],
    [
      "06-1_Prepare_X-axis_Linear_Guides",
      "06-2_Prepare_X-axis_Carriages",
      "06-3_Attache_X-axis_Left_Shoulder",
      "06-4_Prepare_X-axis_Bearing_Holders",
      "06-5_Prepare_X-axis_Right_Shoulder",
    ],
    [
      "08-1_Prepare_Z-axis_Linear_Guides",
      "08-2_Prepare_Z-axis_Top_Plate",
      "08-3_Prepare_Z-axis_Ball_Screw",
      "08-4_Prepare_Z-axis_Top_Bearing_Cover",
      "08-5_Prepare_Z-axis_Middle_Plate",
    ],
  ];

  const mainMachineBuildArray = [];
  let preparingTempArray = [];
  const isException = exceptionArray.some((arr) =>
    arr.includes(stepName[stepCount])
  ); //boolean
  const isPreparingStep = preparingStepArray.some((arr) =>
    arr.includes(stepName[stepCount])
  ); //boolean

  const currentStepObject = model.scene.getObjectByName(stepName[stepCount]);

  useEffect(() => {
    //activated once there is a stepName

    if (currentStepObject) {
      //updateModel();
      console.log(model.scene, currentStepObject);

      for (let i = 0; i < model.scene.children.length; i++) {
        model.scene.children[i].visible = false;
      }
      for (let i = 0; i < modelAux.children.length; i++) {
        modelAux.children[i].visible = false;
      }

      //If it is listed in the exception Array, show model

      currentStepObject.traverse((o) => {
        if (o.isMesh) {
          o.material = new MeshBasicMaterial({ color: 0xffffff });
          o.material.metalness = 1;
          var geo = new EdgesGeometry(o.geometry, 20); // or WireframeGeometry
          var mat = new LineBasicMaterial({ color: 0x404040, linewidth: 0.01 });
          var wireframe = new LineSegments(geo, mat);

          o.add(wireframe);
          if (o.userData.name === "Curves") {
            o.material = new MeshBasicMaterial({ color: 0xff0000 });
          }
        }
      });

      if (partsInOut === true) {
        if (isException) {
          console.log("exception in");
          currentStepObject.visible = true;
          setVisibleModel(currentStepObject);
        } else if (isPreparingStep) {
          console.log("preparing step in");
          currentStepObject.visible = true;
          for (let k = 0; k < preparingStepArray.length; k++) {
            //separates the individual arrays inside preparingStepArray
            const subArray = preparingStepArray[k];
            for (let j = 0; j < subArray.length; j++) {
              //goes through envery indiviual name inside the array
              const isPreparingStepTemp = subArray.some((arr) =>
                arr.includes(stepName[stepCount])
              ); //boolean - true if the current step name is found in the subarray
              if (isPreparingStepTemp) {
                for (let n = stepCount - 1; n >= 0; n--) {
                  //count down for previous steps
                  for (let m = subArray.length - 1; m >= 0; m--) {
                    // count down the elements from subArray
                    if (stepName[n] === subArray[m]) {
                      //if the current step is the same as in the subArray, retrieves the model and adds to the preparringTemArray
                      let previousStepsModel = modelAux.getObjectByName(
                        `${stepName[n]}`,
                        true
                      );
                      if (isPreparingStepTemp) {
                        preparingTempArray.push(previousStepsModel);
                      }
                    }
                  }
                }
              }
            }
          }

          let groupVisibleObjPrep = new Group();

          //Go through each item of the preparingTempArray and display only what is not in the exception list
          preparingTempArray
            .filter((obj) =>
              preparingStepArray.some((arr) => arr.includes(obj.name))
            )
            .forEach((obj) => {
              obj.visible = true;
              let clonedObj = obj.clone();
              groupVisibleObjPrep.add(clonedObj);
            });

          //saves the visible objects to use in the visualization bounding box
          setVisibleModel(groupVisibleObjPrep);
        } else {
          console.log("main building step in");
          currentStepObject.visible = true;
          //If it is NOT listed in the exception Array or the preparing array, add it to the mainMachineBuildArray to be displayed later
          //counts backwards the models of the previous steps
          for (let n = stepCount - 1; n > 0; n--) {
            let previousStepsModel = modelAux.getObjectByName(
              `${stepName[n]}`,
              true
            );
            mainMachineBuildArray.push(previousStepsModel);
          }

          let groupVisibleObj = new Group();

          //Go through each item of the mainMachineBuildArray and display only what is not in the exception list
          mainMachineBuildArray
            .filter(
              (obj) =>
                !exceptionArray.some((arr) => arr.includes(obj.name)) &&
                !preparingStepArray.some((arr) => arr.includes(obj.name))
            )
            .forEach((obj) => {
              obj.visible = true;
              let clonedObj = obj.clone();
              groupVisibleObj.add(clonedObj);
            });
          //saves the visible objects to use in the visualization bounding box
          setVisibleModel(groupVisibleObj);
        }
      }

      if (partsInOut === false) {
        if (isException) {
          console.log("exception out");
          currentStepObject.visible = true;
          setVisibleModel(currentStepObject);
        } else if (isPreparingStep) {
          console.log("preparing step out");
          currentStepObject.visible = true;
          for (let k = 0; k < preparingStepArray.length; k++) {
            //separates the individual arrays inside preparingStepArray
            const subArray = preparingStepArray[k];
            for (let j = 0; j < subArray.length; j++) {
              //goes through envery indiviual name inside the array
              const isPreparingStepTemp = subArray.some((arr) =>
                arr.includes(stepName[stepCount])
              ); //boolean - true if the current step name is found in the subarray
              if (isPreparingStepTemp) {
                for (let n = stepCount - 1; n >= 0; n--) {
                  //count down for previous steps
                  for (let m = subArray.length - 1; m >= 0; m--) {
                    // count down the elements from subArray
                    if (stepName[n] === subArray[m]) {
                      //if the current step is the same as in the subArray, retrieves the model and adds to the preparringTemArray
                      let previousStepsModel = modelAux.getObjectByName(
                        `${stepName[n]}`,
                        true
                      );
                      if (isPreparingStepTemp) {
                        preparingTempArray.push(previousStepsModel);
                      }
                    }
                  }
                }
              }
            }
          }

          let groupVisibleObjPrep = new Group();

          //Go through each item of the preparingTempArray and display only what is not in the exception list
          preparingTempArray
            .filter((obj) =>
              preparingStepArray.some((arr) => arr.includes(obj.name))
            )
            .forEach((obj) => {
              obj.visible = true;
              let clonedObj = obj.clone();
              groupVisibleObjPrep.add(clonedObj);
            });

          //saves the visible objects to use in the visualization bounding box
          setVisibleModel(groupVisibleObjPrep);
        } else {
          console.log("main building step out");
          currentStepObject.visible = true;
          //If it is NOT listed in the exception Array or the preparing array, add it to the mainMachineBuildArray to be displayed later
          //counts backwards the models of the previous steps
          for (let n = stepCount - 1; n > 0; n--) {
            let previousStepsModel = modelAux.getObjectByName(
              `${stepName[n]}`,
              true
            );
            mainMachineBuildArray.push(previousStepsModel);
          }
          console.log(mainMachineBuildArray);
          let groupVisibleObj = new Group();

          //Go through each item of the mainMachineBuildArray and display only what is not in the exception list
          mainMachineBuildArray
            .filter(
              (obj) =>
                !exceptionArray.some((arr) => arr.includes(obj.name)) &&
                !preparingStepArray.some((arr) => arr.includes(obj.name))
            )
            .forEach((obj) => {
              obj.visible = true;
              let clonedObj = obj.clone();
              groupVisibleObj.add(clonedObj);
            });
          //saves the visible objects to use in the visualization bounding box
          setVisibleModel(groupVisibleObj);
        }
      }
    }
  }, [stepCount, stepName, currentStepObject]);

  const partsNamesArray = [];
  const stepTitleArray = [];

  useEffect(() => {
    //activated once there is a stepName
    let uniqueNames = [];
    let partsCount = [];

    for (let i = 0; i < model.scene.children.length; i++) {
      if (model.scene.children[i].name === `${stepName[stepCount]}`) {
        model.scene.children[i].traverse((children) => {
          //finds the name of the parts in the current step
          if (children.isGroup) {
            partsNamesArray.push(children.userData.name);
          }
          //unifies repeated names
          uniqueNames = [...new Set(partsNamesArray)];
          //counts repeated names in the array
          partsCount = uniqueNames.map((value) => [
            partsNamesArray.filter((str) => str === value).length,
            value,
          ]);

          //finds the name of the step title in the current step
          if (children.isObject3D && !children.isMesh && !children.isGroup) {
            stepTitleArray.push(children.userData.name);
          }
        });
        setState({
          ...state,
          partsNames: partsCount,
          titleName: stepTitleArray,
        });
      }
    }
  }, [stepCount, stepName]);

  //saves the names in the global context
  const { setProperties } = useContext(ModelContext);
  setProperties(state);

  const { setListOfStep } = useContext(ModelContext);
  setListOfStep(stepNameNavi);

  return (
    <>
      {stepName ? (
        <primitive
          ref={machine}
          object={model.scene}
          scale={1}
          onClick={MouseEvent}
          dispose={null}
        ></primitive>
      ) : null}

      {stepName ? (
        <primitive
          ref={machineAux}
          object={modelAux}
          scale={1}
          onClick={MouseEvent}
          dispose={null}
        ></primitive>
      ) : null}
    </>
  );
}

// useGLTF.preload("./SmallCNC_Test6_IN.glb", "SmallCNC_Test6_OUT.glb");
