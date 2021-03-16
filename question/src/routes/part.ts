import express, {Request, Response} from 'express'
import { NotFoundError,isAdmin,requireAuth,validateRequest } from '@toeic/common'
import { Part } from '../models/part'
import { Section } from '../models/section'
import { Skills } from '../models/skill'
import { body } from 'express-validator'
import mongoose from 'mongoose'

const router = express.Router()

router.post('/api/part',requireAuth,isAdmin,
[
    body('title').not().isEmpty().withMessage('title is required'),
    body('description').not().isEmpty().withMessage('description is required'),
    body('expiresAt')
    .isFloat({ gt: -1 })
    .withMessage('expiresAt must be greater than 0'),
    body('section').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('section must be provided'),
    body('skills').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('skills must be provided'),
]
,validateRequest ,async (req: Request, res: Response) =>{
    const { title,description,expiresAt,section,skills } = req.body
    
    
   
    const skill = await Skills.findById(skills)

    if(!skill){
        throw new NotFoundError()
    }

    const sections = await Section.findById(section)

    if(!sections){
        throw new NotFoundError()
    }
    
    const part = Part.build({
        title,
        userId: req.currentUser!.id,
        description,
        expiresAt,
        section: sections,
        skills: skill
    }).populate('skills').populate('section')
    await part.save()
    res.status(201).send(part)
})

router.patch('/api/part/:id',requireAuth,isAdmin,
[
    body('title').not().isEmpty().withMessage('title is required'),
    body('description').not().isEmpty().withMessage('description is required'),
    body('expiresAt')
    .isFloat({ gt: -1 })
    .withMessage('expiresAt must be greater than 0'),
    body('section').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('section must be provided'),
    body('skills').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('skills must be provided'),
]
,validateRequest ,async (req: Request, res: Response) =>{
    const { title,description,expiresAt,section,skills } = req.body
    
    
   
    const skill = await Skills.findById(skills)

    if(!skill){
        throw new NotFoundError()
    }

    const sections = await Section.findById(section)

    if(!sections){
        throw new NotFoundError()
    }
    
    const part = await Part.findById(req.params.id)
    if(!part){
        throw new NotFoundError()
    }

    part.set({
        title,
        description,
        expiresAt,
        section,
        skills
    })

    await part.save()
    res.send(part)
})
router.get('/api/part', async (req: Request, res: Response) =>{
    const part = await Part.find({}).populate('section').populate('skills').populate('part1')
    res.send(part)
})
router.get('/api/part/:id', async (req: Request, res: Response) =>{
  const part = await Part.findById(req.params.id).populate('section').populate('skills').populate('part1')
  if(!part){
      throw new NotFoundError()
  }

  res.send(part)
})

router.delete('/api/part/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const part = await Part.findById(req.params.id).populate('section').populate('skills').populate('part1')
    if(!part){
        throw new NotFoundError()
    }
    await part.remove()
    res.send(part)
})


export { router as partRouter}