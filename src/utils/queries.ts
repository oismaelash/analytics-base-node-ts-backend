import { AnalyticsRequestDTO } from "../dto/analytics.request.dto";

export function insertAnalyticsTable({
    id, 
    sessionId,
    action,
    created_at,
    updated_at,
    ip, 
    deviceType, 
    country, 
    state, 
    city}: AnalyticsRequestDTO){
    return `INSERT INTO analytics.sessions VALUES ('${id}', '${sessionId}', '${action}', '${created_at}', '${updated_at}', '${ip}', '${deviceType}', '${country}', '${state}', '${city}')`
}