import express, {Request, Response} from 'express'
import { NotFoundError ,isAdmin,requireAuth,validateRequest} from '@toeic/common'
import { Part } from '../models/part'
import { Part1 } from '../models/part1'
import {body} from 'express-validator'
import mongoose from 'mongoose'


const router = express.Router()


router.post('/api/part1',requireAuth,isAdmin,
[
    body('title').not().isEmpty().withMessage('title is required'),
    body('money').not().isEmpty().withMessage('money is required'),
    body('part').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('part must be provided'),
],
validateRequest,async (req: Request, res: Response) =>{
    const { title, part,money} = req.body

    const parts = await Part.findById(part)
    if(!parts){
        throw new NotFoundError()
    }

    const part1 = Part1.build({
        title,
        userId: req.currentUser!.id,
        part: parts,
        money
    }).populate('part')
    await part1.save()
    res.status(201).send(part1)
})
router.get('/api/part1', async (req: Request, res: Response) =>{
    const part1 = await Part1.find({}).populate('part').populate('question')
   
    res.send(part1)

})


router.get('/api/part1/:id', async (req: Request, res: Response) =>{
  const part1 = await Part1.findById(req.params.id).populate('part').populate('question')
  if(!part1){
      throw new NotFoundError()
  }
  

  

  res.send(part1)
})

router.delete('/api/part1/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const part1 = await Part1.findByIdAndDelete(req.params.id).populate('part').populate('question')
    if(!part1){
        throw new NotFoundError()
    }
  
    res.send(part1)
})


export { router as part1Router}