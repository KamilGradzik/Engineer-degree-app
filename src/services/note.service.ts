import auth from "../middleware/auth"
import Log from "../middleware/logger"
import client from "../middleware/db-connection"
const dB = client

const getNotes = async(token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const results = await dB.query(`Select * from notes where userid = ${verifed.Data.userId}`)
            if(results.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get notes`)
                return { Success:true, Data: results.rows}
            }
            else{
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get notes, but recived no data`)
                return { Success:true, Data: null }
            }
        }
        else
        {
            return verifed
        }

    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error('An error ocured while trying to get notes')
    }
}

const getNote = async(id:any, token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const results = await dB.query(`Select * from notes where id =${id}`)
            if(results.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get nonexistent note`)
                return { Exist:false }
            }
            if(results.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get not his note`)
                return { Permission:false }
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get note with id: ${id}`)
                return { Success:true, Data: results.rows }
            }
        }
        else
        {
            return verifed
        }

    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error('An error ocured while trying to get note')  
    }
}

const addNote = async (obj:any, token:string ) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly add note`)
            await dB.query(`Insert into notes(note_content,creation_date,userid) values('${obj.note_content}', '${obj.note_date}',${verifed.Data.userId})`)
            return { Success:true }
        }   
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error('An error ocured while trying to add new note')
    }
}

const updateNote = async (id:any, obj:any, token:string ) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`Select * from notes where id=${id}`)
            if(result.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent note`)
                return { Exist:false }
            }
            if(result.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his note`)
                return { Permission:false }
            }
            
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly update note with id: ${id}`)
            await dB.query(`Update notes set note_content = '${obj.note_content}', creation_date = '${obj.note_date}' where id = ${id} and userid = ${verifed.Data.userId}`)
            return { Success:true }
        }   
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error('An error ocured while trying to update note')
    }
}

const deleteNote = async (id:any, token:string ) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`Select * from notes where id=${id}`)
            if(result.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent note`)
                return { Exist:false }
            }
            if(result.rows[0].userid != verifed.Data.userId)
            {   
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his note`)
                return { Permission:false }
            }
            
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted note with id: ${id}`)
            await dB.query(`delete from notes where id = ${id} and userid = ${verifed.Data.userId}`)
            return { Success:true }
        }
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error('An error ocured while trying to update note')
    }
}

const deleteNotes = async (token:string ) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`Select * from notes where userid = ${verifed.Data.userId}`)
            if(result.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent notes`)
                return { Exist:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted all his notes`)
            await dB.query(`delete from notes where userid = ${verifed.Data.userId}`)
            return { Success:true, Deleted:true }
        }   
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error('An error ocured while trying to update note')
    }
}


export default {
    getNote,
    getNotes,
    addNote,
    updateNote,
    deleteNotes,
    deleteNote
}