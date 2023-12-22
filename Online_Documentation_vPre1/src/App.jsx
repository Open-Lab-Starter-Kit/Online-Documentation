import { Canvas, useThree } from '@react-three/fiber'
import ButtonNext from './ButtonNext.jsx'
import ButtonPartsOut from './ButtonPartsOut.jsx'
import PartsList from './PartsList'
import { ModelProvider, ModelContext } from "./ModelContext.jsx"
import { Suspense, useState, useEffect, useRef, useContext, useMemo } from 'react'
import { Bounds, Center, OrbitControls, useBounds, CameraControls, PerspectiveCamera, useGLTF } from '@react-three/drei'

import Model from './Model.jsx'
import * as THREE from "three"
import StepTitle from './StepTitle.jsx'
import StepNavigationMenu from "./StepNavigationMenu.jsx"
import CenterModel from './CenterModel.jsx'


export default function App() {

    const modelIn = useGLTF('./SmallCNC_Test6_IN.glb')
    const modelOut = useGLTF('./SmallCNC_Test6_OUT.glb')
    const modelInCopy = useMemo(() => modelIn.scene.clone(), [modelIn])

    const [modelLoaded, setModelLoaded] = useState(false);
    const canvas = document.querySelector('canvas.viewArea')

    return <>

        <ModelProvider>
            <aside id="stepNavi">
                <StepNavigationMenu />
            </aside>
            <section id="currentStepArea">
                <nav >
                    <h2 id="stepTitleArea">
                        <StepTitle />
                    </h2>
                    <div id="stepControl">
                        <ButtonNext />
                        <button id="previousStep" className="btn" type="reset">&#10094; Previous</button>
                    </div>
                </nav>
                <br />
                <br />
                <section>
                    <div className="infoColumn">
                        <div id="stepPartsArea">
                            <PartsList />
                        </div>
                    </div>

                    <article className="viewArea">
                        <Canvas linear flat
                            camera={{
                                fov: 45,
                                near: 0.1,
                                far: 1000,
                                position: [4, 2, 6]
                            }}
                            style={{
                                position: 'relative',
                                float: 'right'
                            }}
                        >
                            <Camera />
                            <color args={['#f2f2f2']} attach="background" />
                            <directionalLight position={[1, 2, 3]} intensity={10} />
                            <ambientLight intensity={10} />
                            <Bounds clip observe damping={2}>
                                <primitive object={new THREE.AxesHelper(50)} />
                                <Model modelIn={modelIn} modelOut={modelOut} modelInCopy={modelInCopy} />
                                <CenterModel />
                            </Bounds>
                        </Canvas>
                        <ButtonPartsOut />


                    </article>
                </section>
            </section>
        </ModelProvider>
    </>
}
useGLTF.preload('./SmallCNC_Test6_IN.glb', './SmallCNC_Test6_OUT.glb')


function Camera() {
    const cameraControlsRef = useRef();

    return <>

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


