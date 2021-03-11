import express, {Request, Response} from 'express'
import { NotFoundError,isAdmin,requireAuth,upload,validateRequest } from '@toeic/common'
import { Image } from '../models/image'
import sharp from 'sharp'
import { Question } from '../models/question'
import mongoose from 'mongoose'
import {body} from 'express-validator'

const router = express.Router()


router.post('/api/image',requireAuth,isAdmin,upload.single('image'),
[
    body('questionId').not().isEmpty().custom((input:string)=>mongoose.Types.ObjectId.isValid(input)).withMessage('questionId must be defined')
],
validateRequest, async (req: Request, res: Response) =>{
    const {questionId}  = req.body

    const question = await Question.findById(questionId)
    if(!question){
        throw new NotFoundError()
    }
    
    const buffer = await sharp(req.file.buffer).resize({width: 250,height:250}).png().toBuffer()
    const image = Image.build({
        question:question,
        userId: req.currentUser!.id,
        image:  buffer,
       
    }).populate('question')

    image.set({
         url: req.protocol +"://"+req.headers.host+req.originalUrl+"/"+image.id
    })
    await image.save()

    const ques = question.set({
        imageUrl: image.url
    })
    await ques.save()

    res.status(201).send(image)
})
router.get('/api/image', async (req: Request, res: Response) =>{
    const image = await Image.find({}).populate('question')


    res.send(image)
})
router.get('/api/image/:id', async (req: Request, res: Response) =>{
    const image = await Image.findById(req.params.id).populate('question')
    res.set('Content-Type','image/png')
    res.send(image?.image)
})

router.delete('/api/image/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const image = await Image.findByIdAndDelete(req.params.id).populate('question')
    res.set('Content-Type','image/png')
    res.send(image?.image)
})


export { router as imageRouter}