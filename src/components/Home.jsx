import { Unity, useUnityContext } from "react-unity-webgl";

function Home() {
    const { unityProvider, isLoaded } = useUnityContext({
        loaderUrl: "build/WebGL.loader.js",
        dataUrl: "build/WebGL.data",
        frameworkUrl: "build/WebGL.framework.js",
        codeUrl: "build/WebGL.wasm",
    });

    return (
        <Unity 
            unityProvider={unityProvider}  
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                margin: "auto",
                visibility: isLoaded ? "visible" : "hidden",
            }}
            devicePixelRatio={2}
        />
    );
}

export default Home;