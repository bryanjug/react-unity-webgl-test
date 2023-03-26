import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function Home() {
    const [pomodoro, setPomodoro] = useState(0);
	const [pomodoroLifeTime, setPomodoroLifeTime] = useState(25);

    const { unityProvider, isLoaded, sendMessage } = useUnityContext({
        loaderUrl: "build/WebGL.loader.js",
        dataUrl: "build/WebGL.data",
        frameworkUrl: "build/WebGL.framework.js",
        codeUrl: "build/WebGL.wasm",
    });

    //load total amount of trees from server
    useEffect(() => {
        if (isLoaded) {
            sendMessage("lowpoly_earth", "SpawnTrees", pomodoroLifeTime);
        }
    }, [isLoaded])
    
    
    //spawn a tree after each pomodoro
    useEffect(()=> {
        if (isLoaded && pomodoro > 0) {
            sendMessage("lowpoly_earth", "SpawnTrees", 1);
        }
    }, [pomodoro])

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