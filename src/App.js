import './css/style.css';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './components/Home';
import DayStats from './components/DayStats';
import ChangeTimer from './components/ChangeTimer';
import {useRef, useEffect, useState} from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
    const { unityProvider, isLoaded, sendMessage, unload } = useUnityContext({
        loaderUrl: "build/WebGL.loader.js",
        dataUrl: "build/WebGL.data",
        frameworkUrl: "build/WebGL.framework.js",
        codeUrl: "build/WebGL.wasm",
    });

    const navigate = useNavigate();
    const nav = useRef(null);
    const [pomodoro, setPomodoro] = useState(0);
	const [pomodoroLifeTime, setPomodoroLifeTime] = useState(0);

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

    //hides nav when clicked outside of div
	function useOutsideAlerter(ref) {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target) && nav.current.style.right === "0px") {
					nav.current.style.right = "-60%";
				}
			}
	
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);

			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};

		}, [ref]);
	}

    useOutsideAlerter(nav);

    function showNav() {
		nav.current.style.right = "0px";
	}

	function hideNav() {
		nav.current.style.right = "-60%";
	}

    async function LinkToHome () {
        nav.current.style.right = "-60%";
        navigate("/");
    }

    async function LinkToStats () {
        nav.current.style.right = "-60%";
        //closes unity and links to page
        await unload();
        navigate("/stats/day");
    }

    async function LinkToChangeTimer () {
        nav.current.style.right = "-60%";
        await unload();
        navigate("/changetimer");
    }

    return (
        <div className="App">
            <Routes>
                <Route 
                    exact path="/" 
                    element={
                        <Home 
                        Unity={Unity}
                            unityProvider={unityProvider} 
                            isLoaded={isLoaded}
                            sendMessage={sendMessage}
                        />
                    }
                />
                <Route 
                    path="/stats/day" 
                    element={
                        <DayStats />
                    }
                />
                <Route 
                    path="/changetimer" 
                    element={
                        <ChangeTimer />
                    }
                />
            </Routes>
            <div className="mhead">
                <img className="menu-ham" src="/img/hamburger.png" onClick={showNav} alt="" />
            </div>
            <div className="menu" ref={nav}>
                <div className="close-menu">
                    <img src="/img/exit.png" onClick={hideNav} className="menu-exit" alt="" />
                </div>
                <ul>
                    <button onClick={LinkToHome}>
                        <li>Pomodoro</li>
                    </button>
                    <button onClick={LinkToStats}>
                        <li>Statistics</li>
                    </button>
                    <button onClick={LinkToChangeTimer}>
                        <li>Change Timer</li>
                    </button>
                </ul>
            </div>
        </div>
    );
}

export default App;
