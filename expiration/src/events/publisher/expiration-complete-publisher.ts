import { ExpirationCompleteEvent, Publisher, Subject } from "@toeic/common";



export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete
}