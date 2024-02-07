import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import { fastifyWebsocket } from '@fastify/websocket'
import { pollResults } from './ws/poll-results'

const app = fastify()

app.register(fastifyWebsocket)
app.register(cookie, {
    secret: 'polls-app-nwl',
    hook: 'onRequest',
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => console.log("HTTP Server Running"))