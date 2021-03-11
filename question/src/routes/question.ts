import express, {Request, Response} from 'express'
import { NotFoundError,isAdmin,requireAuth,validateRequest} from '@toeic/common'
import { Question } from '../models/question'
import { Part1 } from '../models/part1'
import {body} from 'express-validator'
import mongoose from 'mongoose'

const router = express.Router()


router.post('/api/question',requireAuth,isAdmin,
[
    body('title').not().isEmpty().withMessage('title is required'),
    body('description').not().isEmpty().withMessage('description is required'),
    body('giaithich').not().isEmpty().withMessage('giai thich is required'),
    body('dich').not().isEmpty().withMessage('dich is required'),
    body('A').not().isEmpty().withMessage('A is required'),
    body('B').not().isEmpty().withMessage('C is required'),
    body('C').not().isEmpty().withMessage('D is required'),
    body('D').not().isEmpty().withMessage('D is required'),
    body('answer').not().isEmpty().withMessage('answer is required'),
    body('part1').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('part1 must be provided'),
],
validateRequest,async (req: Request, res: Response) =>{
    const { title, description, part1,dich,giaithich,A,B,C,D,answer,part,section,skills} = req.body

    const p = await Part1.findById(part1)
    if(!p){
        throw new NotFoundError()
    }

    const questions = Question.build({
        title,
        userId: req.currentUser!.id,
        description,
        part1:p,
        A,
        B,
        C,
        D,
        dich,
        giaithich,
        part,
        section,
        skills,
        answer
    }).populate('part1')
    await questions.save()
    

    
    res.status(201).send(questions)
})
router.get('/api/question', async (req: Request, res: Response) =>{
    const questions = await Question.find({}).populate('part1').populate('image').populate('audio').populate('part').populate('section').populate('skills')
    res.send(questions)
})
router.get('/api/question/:id', async (req: Request, res: Response) =>{
  const questions = await Question.findById(req.params.id).populate('part1').populate('image').populate('audio').populate('part1').populate('image').populate('audio').populate('part').populate('section').populate('skills')
  if(!questions){
      throw new NotFoundError()
  }

  res.send(questions)
})

router.delete('/api/question/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const questions = await Question.findByIdAndDelete(req.params.id).populate('part1').populate('image').populate('audio').populate('part1').populate('image').populate('audio').populate('part').populate('section').populate('skills')
    if(!questions){
        throw new NotFoundError()
    }

    
  
    res.send(questions)
})


export { router as questionRouter}