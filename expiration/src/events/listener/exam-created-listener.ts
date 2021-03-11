import { Listener, ExamCreatedEvent, Subject} from '@toeic/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class ExamCreatedListener extends Listener<ExamCreatedEvent>{
    subject: Subject.ExamCreated = Subject.ExamCreated
    queueGroupName = queueGroupName
    async onMessage(data: ExamCreatedEvent['data'], msg: Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the job:', delay);
        await expirationQueue.add(
            {
                examId: data.id
            },{
                delay,
            }
        )
        msg.ack()
    }
}