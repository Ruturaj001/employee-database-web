export interface IEmployee {
    /**
     * Keep track of updates
     */
    etag?: number;

    favoriteJoke: string;

    favoriteQuote: string;

    firstName: string;

    hireDate: string;

    id?: string;

    lastName: string;

    role: string;
}
