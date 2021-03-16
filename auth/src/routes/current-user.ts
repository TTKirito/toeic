import express ,{ Request, Response } from 'express'
import { currentUser, isAdmin, NotFoundError, validateRequest } from '@toeic/common'
import { User } from '../models/user'
import {body} from 'express-validator'

const router = express.Router()


router.get('/api/users/currentuser',currentUser, async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null})
})
router.get('/api/users/allUser',currentUser, async (req: Request, res: Response) => {
   const user = await User.find({})
   res.send(user)
})
router.get('/api/users/allUser/:id',currentUser, async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
    if(!user){
        throw new NotFoundError()
    }
    res.send(user)
 })
 
 router.patch('/api/users/allUser/:id',currentUser,isAdmin,[
    body('email').isEmail().withMessage('Email must be valid'),
    body('role').isFloat({gt: -1}).withMessage('Role > -1'),
    body('money').isFloat({gt: -1}).withMessage('money > -1')
  ],validateRequest, async (req: Request, res: Response) => {
    const {email,role,money} = req.body
    
    const user = await User.findById(req.params.id)
    if(!user){
        throw new NotFoundError()
    }

    user.set({
        email,
        role,
        money
    })

    await user.save()
    res.send(user)
 })

 router.delete('/api/users/allUser/:id',currentUser,isAdmin, async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
    if(!user){
        throw new NotFoundError()
    }

    user.remove()
    res.send(user)
 })
 
export { router as currentUserRouter }