import { IEmployee } from "./Contract";

const baseUrl: string = "http://localhost:3000/api/employees";

export function createEmployee(employee: IEmployee): Promise<IEmployee> {
    return fetch(baseUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(employee)
    })
        .then(res => res.json())
        .then(res => {
            return res;
        });
}

export function deleteEmployee(employeeId: string): Promise<boolean> {
    return fetch("http://localhost:3000/api/employees/" + employeeId, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrer: "no-referrer"
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

export function getEmployee(id: string): Promise<IEmployee> {
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

export function updateEmployee(employee: IEmployee): Promise<IEmployee> {
    return fetch(baseUrl + "/" + employee.id, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(employee)
    })
        .then(res => res.json())
        .then(res => {
            return res;
        });
}
