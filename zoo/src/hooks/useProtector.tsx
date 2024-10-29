import axios from 'axios';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for React Router v5

const useProtector = (): [(link: string) => void] => {
    const history = useHistory();

    const validateToken = async (link: string) => {
        const token = localStorage.getItem("token");

        // Check if the user is online
        const isOnline = navigator.onLine;

        if (token) {
            if (isOnline) {
                axios.post("http://localhost:3000/users/verify", { token }).then(() => {
                    history.push(link);
                }
                ).catch((error) => {
                    if (error.response && error.response.status === 400) {
                        localStorage.removeItem("token");
                        history.push("/login");
                    } else {
                        history.push(link);
                    }
                });
            } else {
                // User is offline
                console.log("User is offline. Checking token validity...");

                // Redirect to home if a token exists
                history.push("/home");
            }
        } else {
            history.push("/login");
        }
    };


    const handleNavigation = useCallback((link: string) => {
        validateToken(link);
    }, [history]);

    return [handleNavigation];
};

export default useProtector;
