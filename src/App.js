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

    const [shading, setShading] = useState(false)

    // ganti model di sini
    const model = modelPrisma;

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

    //status projection type
    const [proj, setProjectionType] = useState("perspective");

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

        drawScene(gl, programInfo, buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);

    }, [currentModel]);

    const handleX = (angle) => {
        setRotationAngle({
            x: angle,
            y: rotationAngle.y,
            z: rotationAngle.z
        });
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);
    };

    const handleY = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: angle,
            z: rotationAngle.z
        });
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);
    };

    const handleZ = (angle) => {
        setRotationAngle({
            x: rotationAngle.x,
            y: rotationAngle.y,
            z: angle
        });
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);
    };

    const handleZoom = (coef) => {
        setZoom(-coef/10.0);
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);
    }

    const handleTranslate = (coef) => {
        setTranslate(coef/10);
        // draw();
        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);
    }

    const handleReset = () => {
        console.log("HALO")
        setRotationAngle({
            x: 0,
            y: 0,
            z: 0
        })
        setProjectionType("perspective")
        setZoom(-6.0)
        setTranslate(0.0)

        drawScene(glAttr.gl, glAttr.programInfo, glAttr.buffers, currentModel.positions.length / 3, rotationAngle, zoom, translate, proj);
    };

    const handleFileChange = (e) => {
        let files = e.target.files[0]

        console.log(files)


        const reader = new FileReader();

        reader.onload = () => {
            try {
                changeModel(JSON.parse(reader.result))
            } catch (ex) {
                console.log(ex)
            }
        }
        reader.readAsText(files)

        
    }   

    return (
        <div>
            <canvas ref={canvasRef} width="640" height="480"></canvas>
            <p> Rotate x-axis </p>
            <Slider min={0} max={360} value={rotationAngle.x} onChange={handleX}/>
            <p> Rotate y-axis </p>
            <Slider min={0} max={360} value={rotationAngle.y} onChange={handleY}/>
            <p> Rotate z-axis </p>
            <Slider min={0} max={360} value={rotationAngle.z} onChange={handleZ}/>
            <p> Scale </p>
            <Slider min={30} max={600} value={-10 * zoom} onChange={handleZoom}/>
            <p> Translate x </p>
            <Slider min={-50} max={50} value={0} onChange={handleTranslate}/>
            <button onClick={handleReset} className="btn">Reset Default View</button>
            <button className="btn">{
                shading ? 'Turn Off Shading' : 'Turn On Shading'
            }</button>
            <input onChange={handleFileChange} type="file" id="files" name="files[]"/>
        </div>
    )
}

export default App;
