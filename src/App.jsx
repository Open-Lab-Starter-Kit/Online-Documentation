import { Canvas, useThree } from '@react-three/fiber'
import ButtonNext from './Components/ButtonNext.jsx'
import ButtonPartsOut from './Components/ButtonPartsOut.jsx'
import PartsList from './Containers/PartsList.jsx'
import { ModelProvider, ModelContext } from "./Components/ModelContext.jsx"
import { Suspense, useState, useEffect, useRef, useContext, useMemo, Fragment } from 'react'
import { Bounds, Center, OrbitControls, useBounds, CameraControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Placeholder from './Components/Placeholder.jsx'
import Model from './Components/Model.jsx'
import * as THREE from "three"
import StepTitle from './Containers/StepTitle.jsx'
import StepNavigationMenu from "./Containers/StepNavigationMenu.jsx"
import CenterModel from './Components/CenterModel.jsx'
import StepRemarks from './Containers/StepRemarks.jsx'


export default function App() {

    const modelIn = useGLTF('./Fabulaser_V3_All_In.glb') //Substitute the file name here for ALL IN
    const modelOut = useGLTF('./Fabulaser_V3_All_Out.glb') //Substitute the file name here for ALL OUT
    const modelInCopy = useMemo(() => modelIn.scene.clone(), [modelIn])

    const [modelLoaded, setModelLoaded] = useState(false);

    useGLTF.clear('./Fabulaser_V3_All_In.glb')  //Substitute the file name here for ALL IN
    useGLTF.clear('./Fabulaser_V3_All_Out.glb') //Substitute the file name here for ALL OUT


    return <>

        <ModelProvider>
            <Fragment>
                <aside className="stepNavi">
                    <StepNavigationMenu />
                </aside>
                <section id="currentStepArea">
                    <nav className='currentStepBar' >
                        <h2 id="stepTitleArea">
                            <StepTitle />
                        </h2>
                        <div id="stepControl">
                            <ButtonNext />
                            {/*                             <button id="previousStep" className="btn" type="reset">&#10094; Previous</button>
 */}                        </div>
                    </nav>

                    <div className="infoColumn">
                        <div className="stepPartsArea">
                            <PartsList />
                        </div>
                        <div className="stepRemarksArea">
                            <h4>Remarks</h4> <br />
                            <StepRemarks />
                        </div>
                    </div>
                    <article className="viewArea">

                        <Canvas linear flat
                            frameloop='demand'
                            camera={{
                                fov: 45,
                                near: 0.1,
                                far: 1000,
                                position: [4, 2, 6]
                            }}
                        >
                            <Camera />
                            <color args={['#f5f5f5']} attach="background" />

                            <directionalLight position={[1, 2, 3]} intensity={10} />
                            <ambientLight intensity={10} />

                            <Bounds clip observe damping={2}>
                                {/* <primitive object={new THREE.AxesHelper(50)} /> */}
                                <Suspense>
                                    <Model modelIn={modelIn} modelOut={modelOut} modelInCopy={modelInCopy} />
                                </Suspense>
                                <CenterModel />
                            </Bounds>
                        </Canvas>

                        <ButtonPartsOut />

                    </article>

                </section>
            </Fragment>
        </ModelProvider>
    </>
}
useGLTF.preload('./Fabulaser_V3_All_In.glb') //Substitute the file name here for ALL IN
useGLTF.preload('./Fabulaser_V3_All_Out.glb') //Substitute the file name here for ALL OUT


function Camera() {
    const cameraControlsRef = useRef();

    return <>
        {/*         <CameraControls
            makeDefault
            ref={cameraControlsRef}
            maxZoom={1}
            maxDistance={100}
            enabled={true}
        /> */}
        <OrbitControls
            makeDefault
            enableDamping={false}
            enableRotate={true}
            minAzimuthAngle={Infinity}
            maxAzimuthAngle={Infinity}
            minPolarAngle={0}
            maxPolarAngle={Infinity}
        />
    </>

}


