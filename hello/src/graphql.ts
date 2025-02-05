const graphqlEndpoint = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

async function fetchGraphQL(query: string) {
    const token = localStorage.getItem('jwt-token');

    const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });

    return response.json();
}

export const basicUserIdentification = async () => {
    const query = `
        {
            user {
                login
                email
                attrs
            }
        }
    `;
    return fetchGraphQL(query);
};

export const auditsRatio = async () => {
    const query = `
        {
            user {
                auditRatio
                totalUp
                totalDown
            }
        }
    `;
    return fetchGraphQL(query);
};

export const xpAmount = async () => {
    const query = `
        {
            transaction_aggregate(
                where: {
                    event: { path: { _eq: "/bahrain/bh-module" } },
                    type: { _eq: "xp" }
                }
            ) {
                aggregate {
                    sum {
                        amount
                    }
                }
            }
        }
    `;
    return fetchGraphQL(query);
};

export const userLevel = async () => {
    const query = `
        query {
            transaction(
                order_by: { amount: desc },
                limit: 1,
                where: {
                    type: { _eq: "level" },
                    path: { _like: "/bahrain/bh-module%" }
                }
            ) {
                amount
            }
        }
    `;
    return fetchGraphQL(query);
};

export const userProjectXp = async () => {
    const query = `
        query {
            transaction(
                where: {
                    type: { _eq: "xp" },
                    object: { type: { _eq: "project" } }
                },
                order_by: { createdAt: asc }
            ) {
                id
                object {
                    name
                }
                amount
                createdAt
            }
        }
    `;
    return fetchGraphQL(query);
};
