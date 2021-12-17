export interface PageProps {
    queryParams: { [key: string]: string|number; }
}

export interface ICreateObject {
    url: string,
    component: ArrowFunction,
    auth: boolean,
    allowedUsers: Array<string>,
}