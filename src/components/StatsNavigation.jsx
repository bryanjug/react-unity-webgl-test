import {useNavigate} from 'react-router-dom'; 

const StatsNavigation = () => {
    const navigate = useNavigate();

    function LinkToDay() {
        navigate("/stats/day");
    }

    function LinkToWeek() {
        navigate("/stats/week");
    }
    
    return (
        <div className="text-center pt-4 pb-4 statsNavContainer">
            
                <button type="button" className="btn btn-secondary statsNavigation statsNavigationLeft" onClick={LinkToDay}>Day</button>


                <button type="button" className="btn btn-secondary statsNavigation" onClick={LinkToWeek}>Week</button>


                <button type="button" className="btn btn-secondary statsNavigation">Month</button>


                <button type="button" className="btn btn-secondary statsNavigation statsNavigationRight">Year</button>

        </div>
    );
}

export default StatsNavigation;
