import express, {Request, Response} from 'express'
import { NotFoundError,isAdmin,requireAuth,upload,validateRequest } from '@toeic/common'
import { Audio } from '../models/audio'
import { Question } from '../models/question'
import {body} from 'express-validator'
import mongoose from 'mongoose'


const router = express.Router()


router.post('/api/audio',requireAuth,isAdmin,upload.single('audio'),
[
    body('questionId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('questionId must be provided'),
],
validateRequest
,async (req: Request, res: Response) =>{
    const {questionId}  = req.body
    const question = await Question.findById(questionId)
    if(!question){
        throw new NotFoundError()
    }
    const audio = Audio.build({
        question,
        userId: req.currentUser!.id,
        audio:  req.file.buffer,
       
    }).populate('question')


    audio.set({
         url: req.protocol +"://"+req.headers.host+"/api/audio/"+audio.id
    })
    await audio.save()

    const ques = question.set({
        audioUrl: audio.url
    })
    await ques.save()

    res.status(201).send(audio)
})
router.get('/api/audio', async (req: Request, res: Response) =>{
    const audio = await Audio.find({}).populate('question')


    res.send(audio)
})
router.get('/api/audio/:id', async (req: Request, res: Response) =>{
    const audio = await Audio.findById(req.params.id).populate('question')
    res.set('Content-Type','audio/mpeg')
    res.send(audio?.audio)
})

router.delete('/api/audio/:id',requireAuth,isAdmin, async (req: Request, res: Response) =>{
    const audio = await Audio.findByIdAndDelete(req.params.id).populate('question')
    res.set('Content-Type','audio/mpeg')
    res.send(audio?.audio)
})


export { router as audioRouter}