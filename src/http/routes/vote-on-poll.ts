import z from 'zod'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { prisma } from '../../lib/prisma'

export async function voteOnPoll(app: FastifyInstance) {
    app.post('/polls/:id/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        })

        const voteOnPollParams = z.object({
            id: z.string().uuid(),
        })

        const { pollOptionId } = voteOnPollBody.parse(request.body)
        const { id } = voteOnPollParams.parse(request.params)

        let { sessionId } = request.cookies

        if (sessionId) {
            const userPreviousVoteOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        pollId: id,
                        sessionId
                    }
                }
            })

            if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
                await prisma.vote.delete({
                    where: {
                        id: userPreviousVoteOnPoll.id
                    }
                })
            } else if (userPreviousVoteOnPoll) {
                return reply.status(400).send({ message: 'You aready voted in this poll.' })
            }
        }


        if (!sessionId) {
            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, //days,
                signed: true,
                httpOnly: true
            })
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId: id,
                pollOptionId
            }
        })

        return reply.status(201).send()
    })
}