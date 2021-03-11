import { Subject } from "./subject";
import { ExamStatus } from "./types/exam-status";

export interface ExamCreatedEvent{
    subject: Subject.ExamCreated,
    data:{
        id: string,
        expiresAt: string,
        version: number,
        userId: string;
        status: ExamStatus
        part1:{
            id: string
        }
    }
}