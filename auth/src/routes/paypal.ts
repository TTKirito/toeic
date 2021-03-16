import express, {Request, Response} from 'express'
import { NotFoundError,isAdmin,requireAuth,validateRequest, currentUser, NotAuthorizedError } from '@toeic/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import paypal from 'paypal-rest-sdk'
import { Paypal } from '../models/paypal'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

const router = express.Router()
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ATbDsnCGE2DbZkwW4qL9KmlRaDC1Q7hdvqydRI0See9oYaQa1FxElsGw9iyRjMbSMG4YMNZ4yMZM6bqG',
    'client_secret': 'EAaJTgVxfSAf5R78OR99aYs5ha18pR97AweqbEcU1sweDnpmjdOL6cibzd1dV21AFEXJkugoMCqyT6UZ'
  });
router.post('/api/users/pay',currentUser,[
    body('amout')
        .isFloat({gt: 0})
        .withMessage('amout is required'),
],validateRequest,(req: Request, res: Response) =>{

    const {amout} = req.body
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${req.protocol}://${req.headers.host}/api/users/pay/success`,
            "cancel_url": `${req.protocol}://${req.headers.host}/api/users/pay/cancelled`,
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "exam",
                    "sku": "item",
                    "price": `${amout}`,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": `${amout}`
            },
            "description": "This is the payment description."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
           payment.links?.map((link)=>{
               if(link.rel === 'approval_url'){
                   res.send(link.href)
               }
           })
            
        }
    });
    
})

router.get('/api/users/pay/success',currentUser,async (req: Request, res: Response) =>{
    const payerId: string= req.query.PayerID as string
    const paymentId: string = req.query.paymentId as string
    


    const excute_payment_json = {
        "payer_id": payerId
    }
    paypal.payment.execute(paymentId,excute_payment_json,async function (error, payment) {
        if (error) {
            throw error;
        }else{
            const paypal = Paypal.build({
                userId: req.currentUser!.id,
                paypalId: paymentId,
                amout: parseInt(payment.transactions[0].amount.total)
            })

            await paypal.save()


            const user= await User.findById(req.currentUser!.id)
            if(!user){
                throw new NotFoundError()
            }
            const money = user.money + paypal.amout

            user.set({
                  money: money
            })

            await user.save()
            const userJwt = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  money: user.money,
                 },
                process.env.JWT_KEY!
              );
          
              // Store it on session object
              req.session = {
                jwt: userJwt,
              };
          
            res.redirect('/auth/current-user')
            
        }
    });

    

})

router.get('/api/users/pay/cancelled',currentUser,(req: Request, res: Response) =>{
    res.redirect('/auth/current-user')
})

router.get('/api/users/pay',currentUser,async (req: Request, res: Response) =>{
    const paypals=await Paypal.find({userId: req.currentUser!.id})
    res.send(paypals)


})
router.get('/api/users/pay/:id',currentUser,async (req: Request, res: Response) =>{
    const paypals=await Paypal.findById(req.params.id)
    if(!paypals){
        throw new NotFoundError()
    }
    if(paypals.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    res.send(paypals)

})






export { router as paymentRouter}