import { NotFoundError,ExamStatus, Listener,ExpirationCompleteEvent, Subject, UserUpdateEvent, BadRequestError} from '@toeic/common'
import { Message} from 'node-nats-streaming'
import { User } from '../../models/user'
import {QueueGroupName} from './queue-group-name'

export class UserUpdatedListener extends Listener<UserUpdateEvent>{
    subject: Subject.UserUpdate = Subject.UserUpdate
    queueGroupName = QueueGroupName
    async onMessage(data:UserUpdateEvent['data'], msg: Message){
        const user = await User.findById(data.userId)

        if(!user){
          throw new NotFoundError()
        }

        user.set({
          money: data.money
        })

        await user.save()

        msg.ack()
    }
}