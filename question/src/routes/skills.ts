import express, {Request, Response} from 'express'
import { NotFoundError,requireAuth,isAdmin,validateRequest } from '@toeic/common'
import { Section } from '../models/section'
import { Skills } from '../models/skill'
import {body} from 'express-validator'

const router = express.Router()


router.post('/api/skills',requireAuth,isAdmin,
[
    body('title').not().isEmpty().withMessage('answer is required')
],validateRequest,async (req: Request, res: Response) =>{
    const { title } = req.body

    const skills = Skills.build({
        title,
        userId: req.currentUser!.id
    })
    await skills.save()
    res.status(201).send(skills)
})
router.get('/api/skills', async (req: Request, res: Response) =>{
    const skills = await Skills.find({}).populate('part')
    res.send(skills)
})
router.get('/api/skills/:id', async (req: Request, res: Response) =>{
  const skills = await Skills.findById(req.params.id).populate('part')
  if(!skills){
      throw new NotFoundError()
  }

  res.send(skills)
})

router.delete('/api/skills/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const skills = await Skills.findByIdAndDelete(req.params.id).populate('part')
    if(!skills){
        throw new NotFoundError()
    }
  
    res.send(skills)
})


export { router as skillsRouter}