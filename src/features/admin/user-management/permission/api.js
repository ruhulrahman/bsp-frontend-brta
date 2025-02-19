
import RestApi from '@/utils/RestApi';

export const fetchPermissions = async () => {
    const { data } = await RestApi.get('api/v1/admin/user-management/permission/list');
    return data;
}

export const createPermission = async (newPermission) => {
    const { data } = await RestApi.post('api/v1/admin/user-management/permission', newPermission);
    return data;
}

export const updateOrCreatePermission = async (updatedData) => {
    if (updatedData.id) {
        const { data } = await RestApi.put(`api/v1/admin/user-management/permission/${updatedData.id}`, updatedData);
    } else {
        const { data } = await RestApi.post('api/v1/admin/user-management/permission', updatedData);
    }
    return data;
}

export const updatePermission = async (updatedData) => {
    const { data } = await RestApi.put(`api/v1/admin/user-management/permission/${updatedData.id}`, updatedData);
    return data;
}

export const deletePermission = async (id) => {
    const { data } = await RestApi.delete(`api/v1/admin/user-management/permission/${id}`);
    return data;
}
