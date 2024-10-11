// hooks/usePermission.js
import { useSelector } from 'react-redux';

export const usePermission = (permissionCode) => {
    const { permissions } = useSelector((state) => state.auth) || [];
    // return permissions.includes(permission);

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
};
