const pathLib = require("path");
const fsPromises = require("fs/promises");
const fs = require("fs");

class Storage {
  constructor() {
    this.storagePathAbsolute = pathLib.normalize(process.cwd() + "/storage");
    this.storagePathRelative = pathLib.normalize("/storage");
    this.imageDirName = "images";
    this.designDirName = "designs";
    this.templateDirName = "templates";
  }
  
  async addFileToStorage(path, data, force = false) {
    try {
      const normalizedPath = pathLib.normalize(path);
      const parsedPath = pathLib.parse(normalizedPath);

      if (!fs.existsSync(parsedPath.dir)) {
        await fsPromises.mkdir(parsedPath.dir, { recursive: true }, (err) => { if (err) throw err; });
      }

      if (fs.existsSync(normalizedPath) && force) {
        await fsPromises.rm(normalizedPath);
      }

      fsPromises.appendFile(normalizedPath, data, (err) => { if (err) throw err; })

      return null;
    } catch (error) {
      return error;
    }
  }

  async removeFile(filePath) {
    fsPromises.rm(pathLib.normalize(filePath), {}, (err) => { if (err) throw err; });
  }

  async addCompany(companyId, sync = false) {
    if (!sync) {
      fsPromises.mkdir(
        pathLib.normalize(this.storagePathAbsolute + `/${companyId}/${this.imageDirName}`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      fsPromises.mkdir(
        pathLib.normalize(
          this.storagePathAbsolute + `/${companyId}/${this.templateDirName}`
        ),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      fsPromises.mkdir(
        pathLib.normalize(this.storagePathAbsolute + `/${companyId}/${this.designDirName}`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      await fsPromises.mkdir(
        pathLib.normalize(this.storagePathAbsolute + `/${companyId}/${this.imageDirName}`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      await fsPromises.mkdir(
        pathLib.normalize(
          this.storagePathAbsolute + `/${companyId}/${this.templateDirName}`
        ),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );

      await fsPromises.mkdir(
        pathLib.normalize(this.storagePathAbsolute + `/${companyId}/${this.designDirName}`),
        { recursive: true },
        (err) => {
          if (err) throw err;
        }
      );
    }
  }

    async removeCompany(companyId) {
        try {
            fsPromises.rm(
                pathLib.normalize(this.storagePathAbsolute + `/${companyId}`),
                { recursive: true, force: true },
            );
        } catch (e) {
            console.log(e);
        }

  }

  async addImage(fileName, companyId, dataUrl, force = false) {
    return this.addFileToStorage(`${this.storagePathAbsolute}/${companyId}/${this.imageDirName}/${fileName}`, Buffer.from(dataUrl.split(",")[1], "base64"), force);
  }

  async removeImage(filepath) {
    this.removeFile(pathLib.normalize(process.cwd() + filepath))
  }

  async addTemplate(templateName, companyId, data, force = false) {
    return this.addFileToStorage(`${this.storagePathAbsolute}/${companyId}/${this.templateDirName}/${templateName}.html`, data, force);
  }

  async removeTemplate(companyId, templateName) {
    this.removeFile(`${this.storagePathAbsolute}/${companyId}/${this.templateDirName}/${templateName}.html`)
  }

  async addDesign(designName, companyId, templateId, data, force = false) {
    return this.addFileToStorage(`${this.storagePathAbsolute}/${companyId}/${this.designDirName}/${templateId}/${designName}.html`, data, force);
  }

  async removeDesign(designName, companyId, templateId) {
    this.removeFile(`${this.storagePathAbsolute}/${companyId}/${this.designDirName}/${templateId}/${designName}.html`)
  }
}

module.exports = Storage;
