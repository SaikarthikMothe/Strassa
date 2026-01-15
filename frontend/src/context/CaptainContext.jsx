import { createContext, useState, useContext, useEffect } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(null);

    // Initialize captain from localStorage on mount
    useEffect(() => {
        console.log("📱 CaptainContext: Initializing from localStorage");
        
        const storedCaptain = localStorage.getItem("captain");
        const token = localStorage.getItem("token");
        
        if (storedCaptain && token) {
            try {
                const parsedCaptain = JSON.parse(storedCaptain);
                console.log("📱 CaptainContext: Found stored captain", parsedCaptain._id);
                setCaptain(parsedCaptain);
            } catch (err) {
                console.error("📱 CaptainContext: Failed to parse stored captain data:", err);
                localStorage.removeItem("captain");
                localStorage.removeItem("token");
            }
        } else {
            console.log("📱 CaptainContext: No stored captain or token found");
        }
        
        setIsLoading(false); // Mark loading as complete
    }, []);

    const updateCaptain = (captainData) => {
        console.log("📱 CaptainContext: Updating captain to", captainData?._id);
        setCaptain(captainData);
        // Also update localStorage
        if (captainData) {
            localStorage.setItem("captain", JSON.stringify(captainData));
        } else {
            localStorage.removeItem("captain");
            localStorage.removeItem("token");
        }
    };

    const value = {
        captain,
        setCaptain: updateCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;