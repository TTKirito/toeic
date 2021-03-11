import {Publisher,Subject,ExamCreatedEvent} from '@toeic/common'

export class ExamCreatedPublisher extends Publisher<ExamCreatedEvent>{
    subject: Subject.ExamCreated = Subject.ExamCreated
}