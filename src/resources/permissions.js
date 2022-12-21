class Permission{
    constructor(name, children){
        this.name = name;
        this.children = children;
    }
}

const permissions = [
    new Permission("admin", [])
]

module.exports = {
    Permission, permissions
}
