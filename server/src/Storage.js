const pathLib = require('path');
const fs = require('fs');

class Storage {
    constructor(path = null) {
        this.storagePath = path === null ? pathLib.normalize(process.cwd() + "/storage") : path;
    }

    addCompany(companyName) {
        fs.mkdir(pathLib.normalize(this.storagePath + `/${companyName}/images`), {recursive: true}, (err) => {
            if (err) throw err;
        })

        fs.mkdir(pathLib.normalize(this.storagePath + `/${companyName}/templates`), { recursive: true }, (err) => {
            if (err) throw err;
        })

        fs.mkdir(pathLib.normalize(this.storagePath + `/${companyName}/designs`), { recursive: true }, (err) => {
            if (err) throw err;
        })
    }
}

module.exports = Storage;