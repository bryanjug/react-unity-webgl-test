import './App.css';
import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
    const { unityProvider } = useUnityContext({
        loaderUrl: "build/WebGL.loader.js",
        dataUrl: "build/WebGL.data",
        frameworkUrl: "build/WebGL.framework.js",
        codeUrl: "build/WebGL.wasm",
    });

    return (
        <div className="App">
            <Unity unityProvider={unityProvider} />
        </div>
    );
}

export default App;
