// hooks/useMath.js
import { useCallback } from 'react';

const useMath = () => {
    const add = useCallback((a, b) => a + b, []);
    const subtract = useCallback((a, b) => a - b, []);
    const multiply = useCallback((a, b) => a * b, []);

    return { add, subtract, multiply };
};

export default useMath;
