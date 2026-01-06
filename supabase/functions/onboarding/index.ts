import { Hono } from "hono"

const functionName = "onboarding"
const endpointVersion = "v1"
const app = new Hono().basePath(`/${functionName}/${endpointVersion}`)

app.get('/', (c) => {
    return c.text("Hello World!")
})

app.post('/', async (c) => {
    const { name } = await c.req.json()

    return c.text(`Hello ${name}!`)
})

Deno.serve(app.fetch)
