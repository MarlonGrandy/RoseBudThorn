// Import necessary modules and components from respective libraries.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserHome.css';
import { useLocation } from 'react-router-dom';

// Setting axios default baseURL for making HTTP requests.
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// Fetching user reflections data from the backend.
const fetchReflections = async (userId) => {
    try {
        const response = await axios.post('/api/reflections', { user_id: userId });
        return response.data;
    } catch (error) {
        console.error("Error fetching reflections:", error);
        return {};
    }
};

// Fetching user summaries data from the backend.
const fetchSummaries = async (userId) => {
    try {
        const response = await axios.post('/api/summaries', { user_id: userId });
        return response.data;
    } catch (error) {
        console.error("Error fetching summaries:", error);
        return {};
    }
};

// Define the UserHome functional component.
const UserHome = () => {
    // React useState hooks for managing the component's local state.
    const [reflections, setReflections] = useState({});
    const [summaries, setSummaries] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Getting user id from the location's state. 
    const location = useLocation();
    const userId = location.state?.userId;

    // useEffect hook to fetch data on component mount.
    useEffect(() => {
        fetchReflections(userId).then(data => {
            setReflections(data);
        });
        fetchSummaries(userId).then(data => {
            setSummaries(data);
        });
    }, [userId]);

    // Utility function to get the number of days in a month.
    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    // Handlers to navigate between months.
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    }

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    }

    // JSX to render the user's home.
    return (
        <div className="userHomeContainer">
            <h1>My Reflections & Summaries</h1>
            
            <div className="monthHeader">
                <button onClick={handlePrevMonth}>&lt;</button>
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
    
            <div className="calendarDetailsContainer">
                <div className="calendarContainer">
                    {[...Array(getDaysInMonth(currentMonth, currentYear))].map((_, i) => {
                        const date = new Date(currentYear, currentMonth, i + 1).toISOString().split('T')[0];
                        const hasReflection = reflections[date];
                        const hasSummary = summaries[date];
                        return (
                            <div
                                key={date}
                                className={`calendarDay ${hasReflection || hasSummary ? 'activeDay' : ''}`}
                                onClick={() => setSelectedDate(date)}
                            >
                                {i + 1}
                            </div>
                        );
                    })}
                </div>
    
                {selectedDate && (
                    <div className="detailsPopup">
                        {reflections[selectedDate] ? (
                            <>
                                <div className="paddingDiv">
                                    <span role="img" aria-label="rose">🌹</span> 
                                    <span>Rose: {reflections[selectedDate].rose}</span>
                                </div>
                                <div className="paddingDiv">
                                    <span role="img" aria-label="bud">🌱</span> 
                                    <span>Bud: {reflections[selectedDate].bud}</span>
                                </div>
                                <div className="paddingDiv">
                                    <span role="img" aria-label="thorn">🌵</span> 
                                    <span>Thorn: {reflections[selectedDate].thorn}</span>
                                </div>
                            </>
                        ) : (
                            <div className="centeredMessage">
                                <p>No reflection for this day.</p>
                            </div>
                        )}
                        {summaries[selectedDate] ? (
                            <>
                                <div className="paddingDiv">
                                    <span role="img" aria-label="rose">🔆</span> 
                                    <span>Weekly Summary: {summaries[selectedDate].summary}</span>
                                </div>
                            </>
                        ) : (
                            <div className="centeredMessage">
                                <p>No summary for this day.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Export the UserHome component.
export default UserHome;
