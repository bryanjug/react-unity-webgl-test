import React, {useState, useEffect} from "react";

function ChangeTimer({setTime, setRestTime, hideNav}) {
    const [workMinutes, setWorkMinutes] = useState(25);
	const [workSeconds, setWorkSeconds] = useState(0);
	const [restMinutes, setRestMinutes] = useState(5);
    const [restSeconds, setRestSeconds] = useState(0);
    const [confirmedText, setConfirmedText] = useState("");

    function submitTimes() {
        var workingMinutes = (workMinutes * 60000);
        var workingSeconds = (workSeconds * 1000);
        var workingTotal = workingMinutes + workingSeconds;

        var restingMinutes = (restMinutes * 60000);
        var restingSeconds = (restSeconds * 1000);
        var restingTotal = restingMinutes + restingSeconds;

        setTime(workingTotal);
        setRestTime(restingTotal);
        hideNav();
        setConfirmedText("Times have been changed!");
    }

    useEffect(() => {
        setTimeout(() => {
            setConfirmedText("")
        }, 6000);
    }, [confirmedText])

    function workMinutesIncrease() {
        setWorkMinutes(workMinutes + 1);
    }
    function workMinutesDecrease() {
        setWorkMinutes(workMinutes - 1);
    }
    function workSecondsIncrease() {
        setWorkSeconds(workSeconds + 1);
    }
    function workSecondsDecrease() {
        setWorkSeconds(workSeconds - 1);
    }

    function restMinutesIncrease() {
        setRestMinutes(restMinutes + 1);
    }
    function restMinutesDecrease() {
        setRestMinutes(restMinutes - 1);
    }
    function restSecondsIncrease() {
        setRestSeconds(restSeconds + 1);
    }
    function restSecondsDecrease() {
        setRestSeconds(restSeconds - 1);
    }

    return (
        <div className="App">
            <div className="changeTimer container">
                <div className="row">
                    <div className="col-12 text-light workingTitle">
                        <i>Working Time</i>
                    </div>
                    <div className="col-6 timerLeftSection">
                        <p className="text-light changeTitle">Minutes</p>
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-up" onClick={() => {workMinutesIncrease()}}></i>
                        </div>
                        <input type="number" placeholder="25" onChange={e => setWorkMinutes(e.target.value)} value={workMinutes} />
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-down" onClick={() => {workMinutesDecrease()}}></i>
                        </div>
                    </div>
                    <div className="col-6 timerRightSection">
                        <p className="text-light changeTitle">Seconds</p>
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-up" onClick={() => {workSecondsIncrease()}}></i>
                        </div>
                        <input type="number" placeholder="00" onChange={e => setWorkSeconds(e.target.value)} value={workSeconds} />
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-down" onClick={() => {workSecondsDecrease()}}></i>
                        </div>
                    </div>
                    <div className="col-12 text-light restingTitle">
                        <i>Resting Time</i>
                    </div>
                    <div className="col-6 timerLeftSection">
                        <p className="text-light changeTitle">Minutes</p>
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-up" onClick={() => {restMinutesIncrease()}}></i>
                        </div>
                        <input type="number" placeholder="5" onChange={e => setRestMinutes(e.target.value)} value={restMinutes} />
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-down" onClick={() => {restMinutesDecrease()}}></i>
                        </div>
                    </div>
                    <div className="col-6 timerRightSection">
                        <p className="text-light changeTitle">Seconds</p>
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-up" onClick={() => {restSecondsIncrease()}}></i>
                        </div>
                        <input type="number" placeholder="00" onChange={e => setRestSeconds(e.target.value)} value={restSeconds} />
                        <div className="upIconContainer">
                            <i className="bi bi-chevron-compact-down" onClick={() => {restSecondsDecrease()}}></i>
                        </div>
                    </div>
                    <div className="col-12">
                        <button className="changeTimerButton setTimerButton" onClick={() => {submitTimes()}}>Set Timer</button>
                    </div>
                </div>
            </div>
            <div className="col-12 confirmedTimeChange">
                {confirmedText}
            </div>
        </div>
    );
}

export default ChangeTimer;