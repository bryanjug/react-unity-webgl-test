import {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Navigation ({isLoaded, unload, setTime, setRestTime, setWorkTime, restTime, workTime, time, activity}) {
    const nav = useRef(null);
    const navigate = useNavigate();
    
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
            window.location.href = "https://planet-pomodoro.netlify.app/stats/day";
        } else {
            window.location.href = "https://planet-pomodoro.netlify.app/stats/day";
        }
    }

    const handleChange = event => {
        setTime(event.target.value * 60000)
    }

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
                    <hr className='line'/>
                    <button onClick={LinkToStats}>
                        <li>Statistics</li>
                    </button>
                    <hr className='line'/>
                </ul>
                <div className='setTimer'>
                    {
                        activity === "Working Mode" ?
                        <p className='setTimerTitle'>SET WORK TIME</p>
                        :
                        <p className='setTimerTitle'>SET REST TIME</p>
                    }
                    <input type="range" className="form-range" min=".1" max="25" step=".1" id="customRange3" value={time / 60000} onChange={handleChange}/>
                    <div className='setTimerNumber'>
                        {time / 60000}
                    </div>
                    <p className='minutes'>Minutes</p>
                </div>
                
            </div>
            
        </div>
    );
}