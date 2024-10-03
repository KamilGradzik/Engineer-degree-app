import {Request, Response, NextFunction} from "express"
import service from "../services/note.service"

const getNotes = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.id)
        {
            const result = await service.getNote(req.query.id, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission to this note`}) 
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:'Note not found'})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Data:result.Data })
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            const results = await service.getNotes(req.headers.authorization)
            if(results.Data && results.Success)
            {
                return res.status(200).json({Status:200, Data:results.Data })
            }
            else if(!results.Data && results.Success)
            {
                return res.status(200).json({Status:200, Message:'Notes get successful, but there is no data.'})
            }
            else
            {
                return res.status(401).json({Status:401, Message:results.Message})
            }
        }   
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const addNote = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.body.note_content || !req.body.note_date)
        {
            return res.status(400).json({Status: 400, Message:'Note content and note date are required'})
        }
        else
        {
            const result = await service.addNote(req.body, req.headers.authorization)
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:'Note successfuly added'})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }

    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const updateNote = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.id)
        {
            const result = await service.updateNote(req.query.id, req.body, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:'No permission to this note'})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Note not found`})
            }
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:`Note successfuly updated`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter ID not provided'})
        }

    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const deleteNotes = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.id)
        {
            const result = await service.deleteNote(req.query.id, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:'No permission to this note'})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Note not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Note successfuly deleted`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            const results = await service.deleteNotes(req.headers.authorization)
            if(results.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Notes not found`})
            }
            if(results.Success)
            {
                return res.status(200).json({Status:200, Message:`Notes successfuly deleted`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:results.Message})
            }
        }   
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

export default {
    getNotes,
    updateNote,
    addNote,
    deleteNotes,
}