import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { json } from 'body-parser'

import { NotFoundError,errorHandler,currentUser } from '@toeic/common'
import { sectionRouter } from './routes/section'
import { skillsRouter } from './routes/skills'
import { partRouter } from './routes/part'
import { part1Router } from './routes/part1'
import { questionRouter } from './routes/question'
import { submitRouter } from './routes/submit'
import { examRouter } from './routes/exam'
import { imageRouter } from './routes/image'
import { audioRouter } from './routes/audio'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}))


app.use(currentUser)

app.use(sectionRouter)
app.use(skillsRouter)
app.use(partRouter)
app.use(part1Router)
app.use(questionRouter)
app.use(submitRouter)
app.use(examRouter)
app.use(imageRouter)
app.use(audioRouter)

app.all('*',  async (req,res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }