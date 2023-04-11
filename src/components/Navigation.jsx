import {useRef} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Navigation ({isLoaded, unload, setTime, setRestTime}) {
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
                </ul>
            </div>
            
        </div>
    );
}