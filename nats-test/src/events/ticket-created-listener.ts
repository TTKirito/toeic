import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subject } from "./subject";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subject.TicketCreated = Subject.TicketCreated
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log('Event data', data)

        msg.ack()
    }
}