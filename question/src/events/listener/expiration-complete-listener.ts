import { NotFoundError,ExamStatus, Listener,ExpirationCompleteEvent, Subject} from '@toeic/common'
import { Message} from 'node-nats-streaming'
import { Exam } from '../../models/exam'
import { Part1 } from '../../models/part1'
import {QueueGroupName} from './queue-group-name'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete
    queueGroupName = QueueGroupName
    async onMessage(data:ExpirationCompleteEvent['data'], msg: Message){
        const exam = await Exam.findById(data.examId).populate('part1')

        if(!exam){
            throw new NotFoundError()
        }

        if(exam.status === ExamStatus.Cancelled || exam.status === ExamStatus.Complete){
            return msg.ack()
        }

        exam.set({
            status: ExamStatus.Complete
        })
        
        await exam.save()

        const part1 = await Part1.findById(exam.part1.id)
        if(!part1){
            throw new NotFoundError()
        }

        part1.set({
            examId: undefined
        })
        await part1.save()
        msg.ack()
    }
}