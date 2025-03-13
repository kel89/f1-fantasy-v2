import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a
    .schema({
        Driver: a.model({
            id: a.id(),
            first_name: a.string(),
            last_name: a.string(),
            abbreviation: a.string(),
            number: a.string(),
            team: a.string(),
            results: a.hasMany("Result", "driver_id"),
        }),

        Race: a.model({
            id: a.id(),
            date: a.datetime().required(),
            country: a.string().required(),
            city: a.string().required(),
            name: a.string().required(),
            result: a.hasMany("Result", "race_id"),
            rosters: a.hasMany("Roster", "race_id"),
        }),

        User: a.model({
            id: a.id(),
            email: a.string().required(),
            givenName: a.string().required(),
            familyName: a.string().required(),
            nickname: a.string().required(),
            total_points: a.integer().required(),
            admin: a.boolean(),
            rosters: a.hasMany("Roster", "user_id"),
        }),

        Roster: a.model({
            id: a.id(),
            driver_order: a.string().array(),
            total_points: a.integer(),
            breakdown: a.integer().array(),
            user_id: a.id(),
            race_id: a.id(),
            user: a.belongsTo("User", "user_id"),
            race: a.belongsTo("Race", "race_id"),
        }),

        Result: a.model({
            id: a.id(),
            points: a.integer(),
            race_id: a.id(),
            driver_id: a.id(),
            race: a.belongsTo("Race", "race_id"),
            driver: a.belongsTo("Driver", "driver_id"),
        }),
    })
    .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "apiKey",
        // API Key is used for a.allow.public() rules
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
