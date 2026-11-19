export function parseUtc(value: string): Date {
    if (value.endsWith('Z')) {
        return new Date(value);
    } else {
        return new Date(value + 'Z');
    }
}