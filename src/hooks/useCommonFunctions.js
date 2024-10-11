import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useCommonFunctions = () => {
    const add = useCallback((a, b) => a + b, []);
    const subtract = useCallback((a, b) => a - b, []);
    const multiply = useCallback((a, b) => a * b, []);


    const { permissions } = useSelector((state) => state.auth) || [];

    const hasPermission = (permissionCode) => {
    
        let permissionDisable = false
    
        if (permissionDisable) {
          return true;
        } else if (permissionCode) {
    
          if (permissionCode == "permitted") {
            return true;
          } else {
    
            if (permissions && permissions.length) {
    
                return permissions.includes(permissionCode);
    
            } else {
              return false;
            }
          }
    
        } else return false;
    }


    return {
        add, subtract, multiply,
        hasPermission
    };
};

export default useCommonFunctions;