export type Event = {
    requestContext?: {
        authorizer?: {
            id: string
        }
    };
    body?: string;
    pathParameters?;
};
