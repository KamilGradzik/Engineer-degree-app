import client from "../middleware/db-connection"
import Log from "../middleware/logger";
import auth from "../middleware/auth";
const dB = client;

const getEvents = async (month:string,token:string) => {
    try{
        const verifed = await auth(token);
        if(verifed.Success)
        {
            const results = await dB.query(`Select * from events where to_char(event_date, 'Month') like '%${month}%' and userId = ${verifed.Data.userId}`)
            if(results.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get events`)
                return { Success:true, Data: results.rows}
            }
            else{
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get events, but recived no data`)
                return { Success:true, Data: null }
            }
        }
        else{
            return verifed;
        }
    }
    catch(e:any){
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to get month events!')
    }
}

const getEvent = async (id:number, token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`Select * from events where id = ${id}`)
            if(result.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get nonexistent event`)
                return { Exist: false}
            }
            if(result.rows[0].userid != verifed.Data.userId)
            {   
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get not his event`)
                return { Permission: false}
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get event with id: ${id}`)
            return { Success: true, Data:result}
        }
        else{
            return verifed;
        }
    }
    catch(e:any){
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to get specifed event!')
    }
}

const addEvent = async(obj:any, token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly add event`)
            await dB.query(`INSERT INTO EVENTS(TITLE,EVENT_DESC,EVENT_DATE,USERID) VALUES ('${obj.event_title}' , '${obj.event_desc}' , '${obj.event_date}', ${verifed.Data.userId})`)
            return { Success:true }
        }
        else{
            return verifed
        }
        
    }
    catch(e:any){
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to add event!')
    }
}

const updateEvent = async(id:any, obj:any , token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const event = await dB.query(`select * from events where id = ${id}`)
            if(event.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent event`)
                return { Exist:false }
            }
            if(event.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his event`)
                return { Permission:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated event with id: ${id}`)  
            await dB.query(
                `UPDATE EVENTS SET
                    TITLE = '${obj.event_title}',
                    EVENT_DESC = '${obj.event_desc}',
                    EVENT_DATE = '${obj.event_date}'
                WHERE id = ${id} and userid = ${verifed.Data.userId}`
                )
            return { Success: true }
        }else{
            return verifed
        }
    }
    catch(e:any){
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to update event')
    }
}

const deleteEvent = async (id:any, token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const event = await dB.query(`select * from events where id = ${id}`)
            if(event.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent event`)
                return { Exist:false }
            }
            if(event.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his event`)
                return { Permission:false }
            }

            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted event with id: ${id}`)
            await dB.query(`Delete from events where id = ${id} and userid = ${verifed.Data.userId}`)
            return { Success: true } 
        }
        else{
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to delete event')
    }
}

const deleteEvents = async (month:any, token:string) =>{
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const events = await dB.query(`Select * from events where to_char(event_date, 'Month') like '%${month}%' and userId = ${verifed.Data.userId}`)
            if(events.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent events from month: ${month}`)
                return { Exist:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted events from month: ${month}`)
            await dB.query(`delete from events where to_char(event_date, 'Month') like '%${month}%' and userId = ${verifed.Data.userId}`)
            return { Success:true }  
        }
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to delete month events')
    }
}

const deleteAllEvents = async (token:string) =>{
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const events = await dB.query(`Select * from events where userId = ${verifed.Data.userId}`)
            if(events.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent events`)
                return { Exist:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted all events`)
            await dB.query(`delete from events where userId = ${verifed.Data.userId}`)
            return { Success:true }  
        }
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Server error: ${e.message}`)
        throw Error('An error ocured while trying to delete all events')
    }
}

export default{
    getEvents,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteEvents,
    deleteAllEvents
}