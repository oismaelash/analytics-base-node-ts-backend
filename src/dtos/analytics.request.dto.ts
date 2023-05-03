export interface IAnalyticsRequestDTO {
    id?: string
    sessionId: string
    action: string
    created_at?: string
    updated_at?: string
    ip: string
    deviceType: string
    country: string
    state: string
    city: string
    business: string
}