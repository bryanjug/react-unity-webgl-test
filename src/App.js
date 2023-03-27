import './css/style.css';
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './components/Home';
import DayStats from './components/DayStats';
import MonthStats from './components/MonthStats';
import WeekStats from './components/WeekStats';
import YearStats from './components/YearStats';
import ChangeTimer from './components/ChangeTimer';
import {useRef, useEffect, useState} from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import API from './components/API';
import Countdown, { zeroPad } from "react-countdown";

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
    const [workTime, setWorkTime] = useState(1500000); //1500000
	const [restTime, setRestTime] = useState(300000); //300000
    const [start, setStart] = useState(false);
	const [activity, setActivity] = useState("Working Mode");
	const [time, setTime] = useState(workTime);
	const [completedCount, setCompletedCount] = useState(0);
	const [long, setLong] = useState("");
    const [today, setToday] = useState(new Date().getDate());
	const countdown = useRef(null);

    //ask user permission for notifications
	useEffect(() => {
		if (!("Notification" in window)) {
			console.log("This browser does not support desktop notifications");
		} else {
			Notification.requestPermission();
		}
		//resets state every hour in case user is still in app once day changes
		let resetDay = setInterval(() => {
			setToday(new Date().getDate());
		}, 3600000);

		return () => {
			clearInterval(resetDay);
		}
	}, []);

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
        if (isLoaded === true) {
            await unload();
            navigate("/stats/day");
        } else {
            navigate("/stats/day");
        }
        
    }

    async function LinkToChangeTimer () {
        nav.current.style.right = "-60%";
        if (isLoaded === true) {
            await unload();
            navigate("/changetimer");
        } else {
            navigate("/changetimer");
        }
    }

    	//show notification once timer is done
	useEffect(() => {
		if (activity === "Resting Mode") {
			new Notification("It's time to take a break!");
		}
		if (activity === "Working Mode") {
			new Notification("It's time to start working!");
		}
	}, [activity]);

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
                    console.log("test")
                    let currentHour = new Date().getHours();
                    console.log(currentHour)

                    let getCurrentHour = response.data[currentHour];
                    console.log(getCurrentHour)
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
    
    //gets api data and updates all server data back to 0 once the day changes
    useEffect(() => {
        function resetDay() {
            API.get(`/day`)
                .then(function (response) {
                    let date =
                        new Date().getMonth() + 1 
                        + "-" +
                        new Date().getDate() +
                        "-" +
                        new Date().getFullYear();
    
                    let getData = response.data[0].date;
    
                    //if date has changed, reset all data to 0
                    if (date !== getData) {
                        let payload = {
                            total: 0, 
                            date: date, 
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            16: 0,
                            17: 0,
                            18: 0,
                            19: 0,
                            20: 0,
                            21: 0,
                            22: 0,
                            23: 0
                        };
                        API.patch(`/day/1`, payload);
                    }
                });
        }
        resetDay()

        //resets data back to 0 once week has ended
        function resetWeek() {
            API.get(`/week`)
                .then(function (response) {
                    let currentDay = new Date().getDay();

                    let getCurrentDay = response.data[0].currentDay;

                    // if the current day is 0 and is not the same date on the server, reset data to 0
                    if (currentDay === 0 && currentDay !== getCurrentDay) {
                        let payload = {
                            total: 0, 
                            currentDay: currentDay,
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0
                        };
                        API.patch(`/week/1`, payload);
                    }
                });
        }
        resetWeek()

        //resets data back to 0 once month has ended
        function resetMonth() {
            API.get(`/month`)
                .then(function (response) {
                    let currentDay = new Date().getDate(); //day of month
                    let getCurrentDay = response.data[0].currentDay;

                    //if current day has changed to 1 and is not the same date as previously saved, reset data to 0
                    if (currentDay === 1 && currentDay !== getCurrentDay) {
                        let payload = {
                            total: 0, 
                            currentDay: currentDay,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            16: 0,
                            17: 0,
                            18: 0,
                            19: 0,
                            20: 0,
                            21: 0,
                            22: 0,
                            23: 0,
                            24: 0,
                            25: 0,
                            26: 0,
                            27: 0,
                            28: 0,
                            29: 0,
                            30: 0,
                            31: 0
                        };
                        API.patch(`/month/1`, payload);
                    }
                });
        }
        resetMonth()

        function resetYear() {
            API.get(`/year`)
                .then(function (response) {
                    const currentMonth = new Date().getMonth();

                    let getCurrentMonth = response.data[0].currentMonth;

                    //if current month has changed to 0 and is not the same date as previously saved, reset data to 0
                    if (currentMonth === 0 && currentMonth !== getCurrentMonth) {
                        let payload = { 
                            total: 0, 
                            currentMonth: currentMonth,
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0
                        };
                        API.patch(`/year/1`, payload);
                    }
                });
        }
        resetYear()
    }, [])

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
        <div className="App">
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
