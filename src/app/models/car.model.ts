export interface Car {
    id: string;
    brand: string;
    model: string;
    startYear: number;
    endYear?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}