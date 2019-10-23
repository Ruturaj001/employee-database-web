import { IEmployee } from "./Contract";

const baseUrl: string = "http://localhost:3000/api/employees";

export function createEmployee(employee: IEmployee): Promise<any> {
    return fetch(baseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    })
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

export function deleteEmployee(employeeId: string): Promise<any> {
    return fetch("http://localhost:3000/api/employees/" + employeeId, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

export function getAllEmployees(): Promise<IEmployee[]> {
    return fetch(baseUrl)
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

export function getEmployee(id: string): Promise<any> {
    return fetch(baseUrl + "/" + id)
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

export function getFavoriteJoke(): Promise<string> {
    return fetch("http://api.icndb.com/jokes/random")
        .then(res => res.json())
        .then(res => {
            return res.value.joke;
        });
}

export function getFavoriteQuote(): Promise<string> {
    return fetch("https://ron-swanson-quotes.herokuapp.com/v2/quotes")
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

export function updateEmployee(employee: IEmployee): Promise<any> {
    return fetch(baseUrl + "/" + employee.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    })
        .then(res => res.json())
        .then(res => {
            return res;
        });
}
