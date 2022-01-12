export interface Payload {
    sub: number,
    email: string,
    naam: string,
    company: number,
    type: "Admin" | "Moderator" | "Employee" | string,
}
