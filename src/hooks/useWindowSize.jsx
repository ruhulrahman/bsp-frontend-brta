import { useEffect, useState } from 'react';

// Custom hook to track window size
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
    });

    useEffect(() => {
        // Update the window size when the window is resized
        function handleResize() {
            setWindowSize({
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
            });
        }

        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

export default useWindowSize;
