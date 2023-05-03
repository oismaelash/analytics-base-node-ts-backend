/**
 * Questions? 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100
 */
export function handler(code: number, data: string) {
    return {
        statusCode: code,
        body: data
    }
}