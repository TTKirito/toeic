import { Publisher, Subject, UserUpdateEvent } from "@toeic/common";

export class UserUpdatedPublisher extends Publisher<UserUpdateEvent>{
    subject: Subject.UserUpdate = Subject.UserUpdate
}