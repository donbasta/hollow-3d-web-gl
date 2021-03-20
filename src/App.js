import React, {useState, useRef, useEffect} from 'react'
import './App.css'
import {initShaderProgram, initBuffers, drawScene} from './utils'
import Slider from './Slider'

//import model di sini
import modelPrisma from './modelPrisma.json';
import modelSimple from './modelSimple.json';
import hollowCube from './hollowCube.json';

const App = () => {
    const [programState, setProgramState] = useState(null)
    const canvasRef = useRef(null)

    // ganti model di sini
    const model = hollowCube;

    //ganti model disini
    const [currentModel, changeModel] = useState(model);

    //status rotasi, dilatasi dan translasi
    const [rotationAngle, setRotationAngle] = useState({
        x: 0.0,
        y: 0.0,
        z: 0.0
    });
    const [zoom, setZoom] = useState(-6.0);
    const [translate, setTranslate] = useState(0.0);

    //gl attribute
    const [glAttr, setGlAttr] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        const shaderProgram = initShaderProgram(gl);
        
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            }
        };
    
        const buffers = initBuffers(gl, currentModel);

        setGlAttr({
            gl: gl,
            programInfo: programInfo,
            buffers: buffers
        });

        drawScene(gl, programInfo, buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);

    }, []);

    const handleX = (angle) => {
        setRotationAngle({
            x: angle,
            y: rotationAngle.y,
            z: rotationAngle.z
        });
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleY = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: angle,
            z: rotationAngle.z
        });
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleZ = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: rotationAngle.y,
            z: angle
        });
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    };

    const handleZoom = (coef) => {
        setZoom(-coef/10.0);
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    }

    const handleTranslate = (coef) => {
        setTranslate(coef/10);
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate);
    }

    return (
        <div>
            <canvas ref={canvasRef} width="640" height="480"></canvas>
            <p> Rotate x-axis </p>
            <Slider min={0} max={360} value={0} onChange={handleX}/>
            <p> Rotate y-axis </p>
            <Slider min={0} max={360} value={0} onChange={handleY}/>
            <p> Rotate z-axis </p>
            <Slider min={0} max={360} value={0} onChange={handleZ}/>
            <p> Scale </p>
            <Slider min={30} max={200} value={60} onChange={handleZoom}/>
            <p> Translate x </p>
            <Slider min={-50} max={50} value={0} onChange={handleTranslate}/>
        </div>
    )
}

export default App;
