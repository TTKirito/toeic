import express, {Request, Response} from 'express'
import { NotFoundError,isAdmin,requireAuth,validateRequest } from '@toeic/common'
import { Section } from '../models/section'
import {body} from 'express-validator'


const router = express.Router()


router.post('/api/section',requireAuth,isAdmin,
[
    body('title').not().isEmpty().withMessage('title is required')
],validateRequest,async (req: Request, res: Response) =>{
    const { title } = req.body

    const section = Section.build({
        title,
        userId: req.currentUser!.id
    })
    await section.save()
    res.status(201).send(section)
})
router.get('/api/section', async (req: Request, res: Response) =>{
    const section = await Section.find({}).populate('part')
    res.send(section)
})
router.get('/api/section/:id', async (req: Request, res: Response) =>{
  const section = await Section.findById(req.params.id).populate('part')
  if(!section){
      throw new NotFoundError()
  }

  res.send(section)
})

router.delete('/api/section/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const section = await Section.findByIdAndDelete(req.params.id).populate('part')
    if(!section){
        throw new NotFoundError()
    }
  
    res.send(section)
})


export { router as sectionRouter}