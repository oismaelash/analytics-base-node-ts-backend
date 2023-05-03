import { mysqlService } from "../services/mysql.service";
import * as Query from "./queries.util";

export async function totalViews(clientSlug: string, range: string) {
    console.log("processGraphicTotalViews");
    let graphic = {
        labels: [] as string[],
        series: [
            {
                name: "graphicTotalViews",
                data: [] as any[],
            },
        ],
    };
    const QUERY_TOTAL_VIEWS = Query.getTotalViews(clientSlug, range)
    let totalViews = await mysqlService(QUERY_TOTAL_VIEWS);

    console.log("totalViews", totalViews);
    totalViews.forEach((row: any) => {
        let labelFormatted = `
        ${new Date(row.label.toString()).getDate()}/
        ${new Date(row.label.toString()).getMonth() + 1}/
        ${new Date(row.label.toString()).getFullYear()}`;

        graphic.labels.push(labelFormatted);
        graphic.series[0].data.push(row.data);
    });

    return graphic;
}