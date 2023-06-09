import Navigation from "./Navigation";
import { Unity, useUnityContext } from "react-unity-webgl";
import {useState, useRef, useEffect} from 'react';
import Countdown, { zeroPad } from "react-countdown";
import API from './API';

function Home() {
    const { unityProvider, isLoaded, sendMessage, unload } = useUnityContext({
        loaderUrl: "build/WebGL.loader.js",
        dataUrl: "build/WebGL.data",
        frameworkUrl: "build/WebGL.framework.js",
        codeUrl: "build/WebGL.wasm",
    });

    const [workTime, setWorkTime] = useState(1500000); //1500000
    const [restTime, setRestTime] = useState(300000); //300000
    const [pomodoro, setPomodoro] = useState(0);
    const [pomodoroLifeTime, setPomodoroLifeTime] = useState(0);
    const [long, setLong] = useState("");
	const [activity, setActivity] = useState("Working Mode");
	const [time, setTime] = useState(workTime);
    const [completedCount, setCompletedCount] = useState(0);
    const [today, setToday] = useState(new Date().getDate());
    const [start, setStart] = useState(false);
    const countdown = useRef(null);
    const nav = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    //load total amount of trees from server
    useEffect(() => {
        if (isLoaded && dataLoaded) {
            sendMessage("lowpoly_earth", "SpawnTrees", pomodoroLifeTime);
        }
    }, [isLoaded, dataLoaded])

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

    //long resting mode checker
	useEffect(() => {
		//checks to see if number is multiple of 5
		var remainder = pomodoro % 5;

		//check pomodoro multiple and set long resting mode
		if (remainder === 0) {
			if (activity === "Resting Mode") {
				setTime(restTime * 3); //15 minutes
				setLong("Long");
			}
			if (activity === "Working Mode") {
				setTime(workTime);
				setLong("");
			}
		}
	}, [pomodoro, activity]);

    //request from server total pomodoro count and set total count at top left of homepage at page load
    useEffect(() => {
        async function FetchInfo() {
            API.get(`/total`)
            .then(function(response) {
                setPomodoroLifeTime(response.data[0].count)
                setDataLoaded(true)
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response)
                }
                if (error.request) {
                    console.log(error.request)
                }
            })
        }
		FetchInfo()
	}, []);

    //once pomodoro completed, request data from server and updates server (total, day, week, month, year)
    useEffect(() => {
        function updateLifeTime() {
            API.get(`/total`)
                .then(function (response) {
                    let getData = response.data[0].count;
                    let count = getData + 1;

                    setPomodoroLifeTime(count);

                    let payload = { count: count };

                    API.patch(`/total/1`, payload);
                    
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response)
                    }
                    if (error.request) {
                        console.log(error.request)
                    }
                });
            API.get(`/day`)
                .then(function (response) {
                    let getData = response.data[0].total;
                    let total = getData + 1;
                    let currentHour = new Date().getHours();

                    let getCurrentHour = response.data[currentHour];
                    let count = getCurrentHour + 1;

                    let payload = { 
                        total: total, 
                        [currentHour]: count
                    };

                    API.patch(`/day/1`, payload);
                    
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response)
                    }
                    if (error.request) {
                        console.log(error.request)
                    }
                });
            API.get(`/week`)
                .then(function (response) {
                    let getData = response.data[0].total;
                    let total = getData + 1;

                    let currentDay = new Date().getDay();
                    let getCurrentDay = response.data[currentDay];
                    let count = getCurrentDay + 1;

                    let payload = { 
                        total: total,
                        [currentDay]: count
                    };

                    API.patch(`/week/1`, payload);
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response)
                    }
                    if (error.request) {
                        console.log(error.request)
                    }
                });
            API.get(`/month`)
                .then(function (response) {
                    let getData = response.data[0].total;
                    let total = getData + 1;

                    let currentDay = new Date().getDate(); //day of month
                    let getCurrentDay = response.data[currentDay];
                    let count = getCurrentDay + 1;

                    let payload = { 
                        total: total,
                        [currentDay]: count
                    };

                    API.patch(`/month/1`, payload);
                    
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response)
                    }
                    if (error.request) {
                        console.log(error.request)
                    }
                });
            API.get(`/year`)
                .then(function (response) {
                    let getData = response.data[0].total;
                    let total = getData + 1;

                    const currentMonth = new Date().getMonth();
                    let getCurrentMonth = response.data[currentMonth];
                    let count = getCurrentMonth + 1;

                    let payload = { 
                        total: total,
                        [currentMonth]: count
                    };

                    API.patch(`/year/1`, payload);
                    
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response)
                    }
                    if (error.request) {
                        console.log(error.request)
                    }
                });
        }
        if (pomodoro !== 0) {
            updateLifeTime()
        }
	}, [pomodoro]);

    //Starts and stops timer
	const startButton = () => {
		setStart(true);
		countdown.current.start();
	};

	const stopButton = () => {
		setStart(false);
		countdown.current.stop();
	};

	const renderButton = () => {
		if (start === false) {
			return (
				//renders start button
				<button
					className="btn btn-circle btn-xl cyanButton text-light"
					onClick={() => startButton()}
				>
					Start
				</button>
			);
		}
		if (start === true) {
			return (
				//renders stop button
				<button
					className="btn btn-circle btn-xl cyanButton text-light"
					onClick={() => stopButton()}
				>
					Stop
				</button>
			);
		}
	};

    //Ran when timer = 00:00
	const Work = () => {
		if (completedCount === 0) {
			return (
				<span>
					{setTime(restTime)}
					{setStart(false)}
					{setActivity("Working Mode")}
				</span>
			);
		}
		if (completedCount === 1) {
			return (
				<span>
					{setTime(restTime)}
					{setStart(false)}
					{setPomodoro(pomodoro + 1)}
					{setActivity("Resting Mode")}
				</span>
			);
		}
		if (completedCount === 2) {
			//finish working mode
			return (
				<span>
					{setTime(restTime)}
					{setStart(false)}
					{setActivity("Resting Mode")}
				</span>
			);
		}
		if (completedCount === 3) {
			return (
				<span>
					{setTime(workTime)}
					{setStart(false)}
					{setActivity("Working Mode")}
				</span>
			);
		}
		if (completedCount === 4) {
			return (
				<span>
					{setTime(workTime)}
					{setStart(false)}
					{setPomodoro(pomodoro + 1)}
					{setActivity("Working Mode")}
				</span>
			);
		}
		if (completedCount === 5) {
			return (
				<span>
					{setTime(restTime)}
					{setStart(false)}
					{setActivity("Resting Mode")}
				</span>
			);
		}
		if (completedCount === 6) {
			return (
				<span>
					{setTime(restTime)}
					{setStart(false)}
					{setActivity("Resting Mode")}
					{setCompletedCount(3)}
				</span>
			);
		}
	};

    //Countdown Renderer
	const Renderer = ({ hours, minutes, seconds, completed }) => {
		if (completed) {
			//Render a completed state
			setCompletedCount(completedCount + 1);

			return Work();
		} else {
			// Render a countdown
			return (
				<span>
					{zeroPad(hours, 2)}:{zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}
				</span>
			);
		}
	};

    return (
        <div>
            <Navigation 
                isLoaded={isLoaded} 
                unload={unload} 
                setTime={setTime}
                setRestTime={setRestTime}
                setWorkTime={setWorkTime}
                workTime={workTime}
                restTime={restTime}
                time={time}
                activity={activity}
            />
            <div className="pomodoroCounterContainer pt-3">
				<p className="text-light pomodoroCounter">{pomodoroLifeTime}</p>
			</div>
			<div className="pomodoroContainer">
				<div className="text-center">
					<div className="text-light activity">
						{long} {activity}
					</div>
					<div className="countdownContainer">
						<p
							style={{ fontSize: "500%", fontWeight: "100" }}
							className="text-light countdown"
						>
							<Countdown
								date={Date.now() + time} //1500000 = 25:00 minutes
								intervalDelay={0}
								autoStart={false}
								ref={countdown}
								renderer={Renderer}
							/>
						</p>
						{renderButton()}
						<br />
					</div>
				</div>
			</div>
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
        </div>
    );
}

export default Home;