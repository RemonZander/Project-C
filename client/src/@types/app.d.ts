export interface PageProps {
    queryParams: { [key: string]: string|number; }
}

export interface ICreateObject {
    url: string,
    component: any,
    auth: boolean,
    allowedUsers: Array<string>,
}