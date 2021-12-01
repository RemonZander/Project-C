const pathLib = require("path");
const fs = require("fs/promises");

class Storage {
  constructor(path = null) {
    this.storagePath =
      path === null ? pathLib.normalize(process.cwd() + "/storage") : path;
  }

  async addCompany(companyName, sync = false) {
    if (!sync) {
      fs.mkdir(
        pathLib.normalize(this.storagePath + `/${companyName}/images`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      fs.mkdir(
        pathLib.normalize(this.storagePath + `/${companyName}/templates`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      fs.mkdir(
        pathLib.normalize(this.storagePath + `/${companyName}/designs`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      await fs.mkdir(
        pathLib.normalize(this.storagePath + `/${companyName}/images`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      await fs.mkdir(
        pathLib.normalize(this.storagePath + `/${companyName}/templates`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      await fs.mkdir(
        pathLib.normalize(this.storagePath + `/${companyName}/designs`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
    }
  }

  removeCompany(companyId) {
    fs.rm(
      pathLib.normalize(this.storagePath + `/${companyId}`),
      { recursive: true, force: true },
      (err) => {
        if (err) throw err;
      }
    );
  }

  addImage(fileName, companyId, dataUrl) {
    fs.appendFile(
      pathLib.normalize(this.storagePath + `/${companyId}/images/${fileName}`),
      Buffer.from(dataUrl.split(",")[1], "base64"),
      (err) => {
        if (err) throw err;
      }
    );
  }

  removeImage(filePath) {
    fs.rm(filePath, {}, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = Storage;
