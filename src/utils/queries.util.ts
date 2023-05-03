import { IAnalyticsRequestDTO } from "../dtos/analytics.request.dto";

const DATABASE_NAME = process.env.DATABASE_NAME
const ANALYTICS_TABLE_NAME = process.env.ANALYTICS_TABLE_NAME

export function createSessionTable({
    id,
    sessionId,
    action,
    created_at,
    updated_at,
    ip,
    deviceType,
    country,
    state,
    city,
    business }: IAnalyticsRequestDTO): string {
    const QUERY: string = `
        INSERT INTO ${DATABASE_NAME}.${ANALYTICS_TABLE_NAME}
        VALUES 
            ('${id}', 
            '${sessionId}', 
            '${action}', 
            '${created_at}', 
            '${updated_at}', 
            '${ip}', 
            '${deviceType}', 
            '${country}', 
            '${state}', 
            '${city}', 
            '${business}')`
    return QUERY;
}

export function getTotalViews(
    businessSlug: string,
    range: string): string {
    const QUERY: string = `
        WITH RECURSIVE RangeData as (
        select (DATE(NOW())- INTERVAL ${range} DAY) as label
        UNION ALL
        SELECT DATE_ADD(label, INTERVAL 1 DAY) as ListDatesOrder FROM RangeData
        WHERE label < DATE(NOW()) - 1
        ),
        TotalViewPerDay as (select * from ${DATABASE_NAME}.${ANALYTICS_TABLE_NAME} where business = '${businessSlug}')
        select label, Count(A.id) as data
        from RangeData RD
        left join TotalViewPerDay A on RD.label = A.created_at
        group by RD.label;
        `
    return QUERY;
}