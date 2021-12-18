export class Design {
    Id: number;
    Name: string;
    Template_id: number;
    Created_at: Date;
    Updated_at: Date;
    Filepath: string;
    Downloads: number;
    Verified: boolean;
   
    public constructor(design: { Created_at: string, Downloads: string, Filepath: string, Id: number, Name: string, Template_id: number, Updated_at: string, Verified: number }) {
        this.Id = design.Id;
        this.Name = design.Name;
        this.Template_id = design.Template_id;
        this.Created_at = new Date(design.Created_at);
        this.Updated_at = new Date(design.Updated_at);
        this.Filepath = design.Filepath;
        this.Downloads = parseInt(design.Downloads === "" ? '0' : design.Downloads);
        this.Verified = design.Verified === 0 ? false : true;
    }

/*    public constructor(...args: Array<any>) {

    }*/

    public static makeDesignArray(designs: [design: { Created_at: string; Downloads: string, Filepath: string, Id: number, Name: string, Template_id: number, Updated_at: string, Verified: number }]) {
        const tempArray = new Array<Design>();
        for (var a = 0; a < designs.length; a++) {
            tempArray.push(new Design({
                Created_at: designs[a].Created_at,
                Downloads: designs[a].Downloads,
                Filepath: designs[a].Filepath,
                Id: designs[a].Id,
                Name: designs[a].Name,
                Template_id: designs[a].Template_id,
                Updated_at: designs[a].Updated_at,
                Verified: designs[a].Verified
            }));
        }
        return tempArray;
    }
}

export class Template {
    Id: number;
    Name: string;
    Company_id: number;
    Filepath: string;

    public constructor(template: { Company_id: number, Filepath: string, Id: number, Name: string}) {
        this.Id = template.Id;
        this.Name = template.Name;
        this.Company_id = template.Company_id;
        this.Filepath = template.Filepath;
    }

    public static makeTemplateArray(templates: [template: { Company_id: number, Filepath: string, Id: number, Name: string }]) {
        const tempArray = new Array<Template>();
        for (var a = 0; a < templates.length; a++) {
            tempArray.push(new Template({
                Company_id: templates[a].Company_id,
                Filepath: templates[a].Filepath,
                Id: templates[a].Id,
                Name: templates[a].Name,
            }));
        }
        return tempArray;
    }
}

export class User {
    Id: number;
    Name: string;
    Email: string;
    Password: string;
    Company_Id: number;
    Role_Id: number;

    public constructor(User: { Company_Id: number, Email: string, Id: number, Name: string, Password: string, Role_Id: number }) {
        this.Id = User.Id;
        this.Name = User.Name;
        this.Email = User.Email;
        this.Password = User.Password;
        this.Company_Id = User.Company_Id;
        this.Role_Id = User.Role_Id;
    }

    public static makeUserArray(Users: [User: { Company_Id: number, Email: string, Id: number, Name: string, Password: string, Role_Id: number }]) {
        const tempArray = new Array<User>();
        for (var a = 0; a < Users.length; a++) {
            tempArray.push(new User({
                Company_Id: Users[a].Company_Id,
                Email: Users[a].Email,
                Id: Users[a].Id,
                Name: Users[a].Name,
                Password: Users[a].Password,
                Role_Id: Users[a].Role_Id,
            }));
        }
        return tempArray;
    }
}