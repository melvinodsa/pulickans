export interface Person {
    id: number;
    name: string;
    label?: string;
    mother?: Person;
    father?: Person;
}