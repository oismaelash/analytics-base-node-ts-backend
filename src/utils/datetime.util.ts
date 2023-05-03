export function getDatetimeIso() {
    const datetime = new Date().toISOString().replace('T', ' ')
    return datetime
}