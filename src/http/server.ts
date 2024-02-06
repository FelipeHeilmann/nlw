import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'


const app = fastify()

const prisma = new PrismaClient()

app.post('/polls', async (request, reply) => {
    const createBody = z.object({
        title: z.string(),
    })

    const { title } = createBody.parse(request.body)

    await prisma.poll.create({
        data: {
            title: title
        }
    })

    return reply.status(201)

})

app.listen({
    port: 3333,
    host: '0.0.0.0'
}).then(() => console.log("HTTP Server Running"))