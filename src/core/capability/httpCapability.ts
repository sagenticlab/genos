import { Capability } from "./capability";

export class HttpCapability implements Capability {
    name: string;
    description: string;
    schema = {
        properties: [
            {
                name: "url",
                type: "string",
                required: true,
                description: "Endpoint URL"
            },
            {
                name: "method",
                type: "enum",
                values: ["GET", "POST", "PUT", "DELETE"],
                default: "GET",
                description: "HTTP method"
            },
            {
                name: "query",
                type: "map",
                required: false,
                description: "Query parameters"
            },
            {
                name: "headers",
                type: "map",
                required: false,
                description: "Request headers"
            },
            {
                name: "body",
                type: "object",
                required: false,
                description: "Request body for POST/PUT requests"
            }
        ]
    };

    constructor() {
        this.name = 'http';
        this.description = 'Capability to make HTTP requests';
    }

    getSchema() {
        return this.schema;
    }

    validateParameters(parameters: Record<string, any>): { status: boolean; message?: string } {
        if (!parameters.url || typeof parameters.url !== "string") {
            return { status: false, message: "Invalid or missing 'url' parameter" };
        }
        if (parameters.url && typeof parameters.url === "string") {
            const urlPattern = /^(http|https):\/\/[^ "]+$/;
            if (!urlPattern.test(parameters.url)) {
                return { status: false, message: "Invalid 'url' parameter" };
            }
        } else {
            return { status: false, message: "Invalid or missing 'url' parameter" };
        }
        if (parameters.method && !["GET", "POST", "PUT", "DELETE"].includes(parameters.method)) {
            return { status: false, message: "Invalid 'method' parameter" };
        }
        return { status: true };
    }

    async execute(parameters: Record<string, any>, trace: boolean): Promise<Record<string, any>> {
        // Implementation for HTTP capability
        const query = parameters.query || {};

        let url = parameters.url;

        if (parameters.method === "GET" && Object.keys(query).length) {
            const queryString = this.buildQueryString(query);
            url = `${url}?${queryString}`;
        }

        const response = await fetch(url, {
            method: parameters.method || "GET"
        });

        if (!response.ok) {
            throw new Error(`Tool HTTP request failed: ${response.statusText}`);
        }
        return response.json();
    }

    private buildQueryString(params: Record<string, any>) {
        const query = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            query.append(key, String(value));
        }

        return query.toString();
    }
}