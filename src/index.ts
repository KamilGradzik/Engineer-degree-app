import express from 'express'
import eventRouter from './routes/event.routes'
import userRouter from './routes/user.routes'
import noteRouter from './routes/note.routes';
import groupRouter from './routes/group.routes';
import scheduleRouter from './routes/schedule.routes';
import Log from './middleware/logger';
import dotenv from 'dotenv'

const app = express();
dotenv.config({path:'./src/config/.env'});



app.use(express.json());

app.use(express.urlencoded({extended: true}))

app.use(userRouter)

app.use('/callendar',eventRouter)

app.use('/notes',noteRouter)

app.use('/groups',groupRouter)

app.use('/schedules',scheduleRouter)

app.listen(process.env.APP_PORT, () =>{
    Log.info(`Server running and listetning on port: ${process.env.APP_PORT}`)
})