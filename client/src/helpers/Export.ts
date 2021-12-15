export const CreateExport = (url, component, auth = true, allowedUsers = ["Admin", "Moderator", "Employee"]) => {
    return {
        url: url,
        component: component,
        auth: auth,
        allowedUsers: allowedUsers
    }
}