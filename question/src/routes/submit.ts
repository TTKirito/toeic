import express, {Request, Response} from 'express'
import {ExamStatus, NotFoundError,requireAuth,validateRequest } from '@toeic/common'
import { Submit } from '../models/submit'
import {body} from 'express-validator'
import mongoose from 'mongoose'
import { Exam } from '../models/exam'

const router = express.Router()


router.post('/api/submit',requireAuth,
[
    body('correct')
        .isFloat({gt:-1})
        .withMessage('correct is required'),
    body('noanswer')
        .isFloat({gt:-1})
        .withMessage('no answer is required'),
    body('incorrect')
        .isFloat({gt:-1})
        .withMessage('incorrect is required'),
    body('examId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('part1 must be provided'),
],validateRequest,async (req: Request, res: Response) =>{
    const { correct,examId,incorrect,noanswer } = req.body
    const exam = await Exam.findById(examId)
    if(!exam){
        throw new NotFoundError()
    }
    const submit = Submit.build({
        correct,
        userId: req.currentUser!.id,
        incorrect,
        exam,
        noanswer
    }).populate('exam')
    await submit.save()

    exam.set({
        status: ExamStatus.Complete
    })

   await exam.save()

    exam.set({
        status: ExamStatus.Complete
    })
    await exam.save()
    res.status(201).send(submit)
   
})
router.get('/api/submit',requireAuth, async (req: Request, res: Response) =>{
    const submit = await Submit.find({}).populate('exam')
    res.send(submit)
})
router.get('/api/submit/:id',requireAuth, async (req: Request, res: Response) =>{
    const submit = await Submit.findById(req.params.id).populate('exam')
    if(!submit){
      throw new NotFoundError()
    }

    res.send(submit)
})

router.delete('/api/submit/:id',requireAuth, async (req: Request, res: Response) =>{
    const submit = await Submit.findById(req.params.id).populate('exam')
    if(!submit){
      throw new NotFoundError()
    }

    res.send(submit)
})


export { router as submitRouter}