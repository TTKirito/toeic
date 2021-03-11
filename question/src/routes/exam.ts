import express, {Request, Response} from 'express'
import { BadRequestError, NotFoundError,ExamStatus,requireAuth, validateRequest, isAdmin} from '@toeic/common'
import { Exam } from '../models/exam'
import { Part1 } from '../models/part1'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { ExamCreatedPublisher } from '../events/publisher/exam-created-publisher'
import { natsWrapper } from '../nats-wrapper'
import jwt from 'jsonwebtoken'
import { UserUpdatedPublisher } from '../events/publisher/user-updated-publisher'

const router = express.Router()


router.post('/api/exams',requireAuth, isAdmin,
[
  body('part1Id').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('partId must be provided'),
],
validateRequest,async (req: Request, res: Response) =>{
    const {part1Id} = req.body

    const part1 = await Part1.findById(part1Id).populate('part')

    if(!part1){
      throw new NotFoundError()
  }

    if(req.currentUser!.money < part1!.money){
      throw new BadRequestError('Nomoney') 
    }


    const existingExam = await Exam.findOne({
      part1,
      status:{
        $in: [
          ExamStatus.Created
        ]
      }
    })

    if(existingExam){
        throw new BadRequestError('Exam is already reserved')
    }
    


    const money = req.currentUser!.money - part1!.money

 
    new UserUpdatedPublisher(natsWrapper.client).publish({
      userId: req.currentUser!.id,
      money: money
    })


    const userJwt = jwt.sign(
      {
          id: req.currentUser!.id,
          email: req.currentUser!.email,
          role: req.currentUser!.role,
          money: money
      },
      process.env.JWT_KEY!
  )

  req.session = {
      jwt: userJwt
  }
    // Store it on session object
    
    
    
    
    if(part1.part.expiresAt !== 0){
      const EXPIRATION_WINDOW_SECONDS = (part1.part.expiresAt) * 60

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const exam = Exam.build({
        userId: req.currentUser!.id,
        status: ExamStatus.Created,
        part1,
        expiresAt: expiration
    })

    
    
    await exam.save()
    new ExamCreatedPublisher(natsWrapper.client).publish({
      id: exam.id,
      expiresAt: expiration.toISOString(),
      userId: exam.userId,
      version: exam.version,
      status: exam.status,
      part1:{
        id: exam.part1.id
      }
    })
    res.status(201).send(exam)
    }else{
      const exam = Exam.build({
        userId: req.currentUser!.id,
        status: ExamStatus.Created,
        part1,
    })
    new ExamCreatedPublisher(natsWrapper.client).publish({
      id: exam.id,
      userId: exam.userId,
      version: exam.version,
      status: exam.status,
      part1:{
        id: exam.part1.id
      }
    })
      await exam.save()
      res.status(201).send(exam)
    }

    
})
router.delete('/api/exams/:id',requireAuth,async (req: Request, res: Response) => {
  
      const exam = await Exam.findById(req.params.id).populate('part1').populate('part');
  
      if (!exam) {
        throw new NotFoundError();
      }
     
      exam.status = ExamStatus.Cancelled;
      await exam.save();
  
      // publishing an event saying this was cancelled!
     
      res.status(204).send(exam);
    }
  );
router.get('/api/exams/:id',requireAuth,async (req: Request, res: Response) => {
    

    const exam = await Exam.findById(req.params.id).populate('part1');

    if (!exam) {
      throw new NotFoundError();
    }


    // publishing an event saying this was cancelled!
   
    res.send(exam);
  }
);
router.get('/api/exams',requireAuth,async (req: Request, res: Response) => {
   
    const exam = await Exam.find({}).populate('part1');

   
    // publishing an event saying this was cancelled!
   
    res.send(exam);
  }
);

export { router as examRouter}