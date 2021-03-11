import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'



interface Payload{
    examId: string
}


export const expirationQueue = new Queue<Payload>('Exam:expiration',{
    redis:{
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) =>{
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        examId: job.data.examId
    })
})