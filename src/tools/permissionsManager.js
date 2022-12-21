const {permissions} = require('../resources/permissions')

function getPermissionFromPath(path) {
    const pathPart = path.split('.')
    let parent = undefined

    for (const part of pathPart)
        parent = parent ? parent.children?.find((perm) => perm.name === part) : permissions.find((perm) => perm.name === part)

    return parent
}

function getChildrenList(path) {
    path = path.endsWith(`*`) ? path.substring(0, path.length - 2) : path
    const parent = getPermissionFromPath(path)
    if (!parent)
        return []

    let list = []
    parent.children?.forEach((child) =>
        list = child.children ? list.concat(getChildrenList(`${path}.${child.name}`)) : list.concat(`${path}.${child.name}`))

    return list
}

function handleRolePermissions(permissions) {
    let temp = []
    let perms = []

    // COPY PERMISSIONS AND SPLIT SUPER PERM IN ANOTHER TABLE
    permissions.forEach((perm) => {
        if (perm.includes(`*`))
            temp = temp.concat(perm)
        else
            perms = perms.concat(perm)
    })

    // GET EVERY TEMP PERMS CHILDS
    temp.forEach((perm) => {
        const ls = getChildrenList(perm)
        if (ls.length !== 0)
            perms = perms.concat(ls)
    })

    return perms
}

function hasPermission(rolePermissions, requiredPermissions) {
    const handledPermissions = handleRolePermissions(rolePermissions)
    for (const perm of requiredPermissions)
        if (!handledPermissions.includes(perm))
            return false

    return true
}

function hasTuplePermissions(rolePermissions, requiredPermissions) {
    for (const table of requiredPermissions)
        if (hasPermission(rolePermissions, table))
            return true

    return false
}

function isPermissionValid(permission){

}

function isPermissionsValid(permissions){
    for(let permission of permissions){
        if(!isPermissionValid(permission))
            return false;
    }
    return true;
}

module.exports = {
    getPermissionFromPath, getChildrenList, handleRolePermissions, hasPermission, hasTuplePermissions, isPermissionsValid, isPermissionValid
}
