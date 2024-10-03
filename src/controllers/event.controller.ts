import {Request, Response, NextFunction} from "express";
import Log from "../middleware/logger";
import service from "../services/event.service";

const getEvents = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.month)
        {
            const results = await service.getEvents(req.query.month as string, req.headers.authorization )
            if( results.Success && results.Data)
            {
                return res.status(200).json({Status:200, Data:results.Data })
            }
            else if(!results.Data && results.Success){
                return res.status(200).json({Status:200, Message:'Events get successful, but there is no data.'})
            }
            else{
                return res.status(401).json({Status:401, Message:results.Message})
            }
        }
        else{
            return res.status(400).json({Status:400,Message:'Month parameter not provided'})
        }    
    }
    catch(e:any){
        Log.error(e.message);
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const getEvent = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.id)
        {
            const results = await service.getEvent(parseInt(req.query.id as string), req.headers.authorization)
            if(results.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission to this event`})
            }
            if(results.Exist == false)
            {
                return res.status(404).json({Status:404, Data:'Event not found'})
            }
            if(results.Success)
            {
                return res.status(200).json({Status:200, Data:results.Data})
            }
            else
            {
                return res.status(401).json({Status:401, Message:results.Message})
            }
        }
        else{
            return res.status(400).json({Status:400,Message:'Parameter Id not provided'})
        }    
    }
    catch(e:any){
        Log.error(e.message);
        return res.status(500).json({Status:500, Message:e.message})
    }
}


const addEvent = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.body.event_title || !req.body.event_date)
        {
            return res.status(400).json({Status: 400, Message:'Event title and event date are required.'})
        }
        else{
            const results = await service.addEvent(req.body,req.headers.authorization);
            if( results.Success )
            {   
                return res.status(201).json({Status:201, Message:'Event successfuly added'})
            }
            else
            {
                return res.status(401).json({Status:401, Message:results.Message})
            }
        }
    }
    catch(e:any)
    {
        Log.error(e.message);
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const updateEvent = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.id)
        {
            if(!req.body.event_title || !req.body.event_date)
            {
                return res.status(400).json({Status:400, Message:'Fields title and event description are required'})  
            }
            else{
                const results = await service.updateEvent(req.query.id,req.body,req.headers.authorization)
                if(results.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:`No permission to this event`})
                }
                if(results.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:`Specifed event cannot be updated because doesn't exist`})
                }
                if(results.Success)
                {
                    return res.status(201).json({Status:201, Message:'Event successfuly updated'})
                }
                else 
                {
                    return res.status(401).json({Status:401, Message:results.Message})
                }
            }
        }
        else{
            return res.status(400).json({Status:400, Message:'Event ID parameter not provided!'})
        }
    }
    catch(e:any){
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const  deleteEvent = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.id)
        {
            const result = await service.deleteEvent(req.query.id, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission to this event`})
            }
            if(result.Exist == false )
            {
                return res.status(404).json({Status:404, Message:`Event not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Event successfuly deleted`})
            }
            else{
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else{
            return res.status(400).json({Status:400, Nessage:'Parameter ID not provided'})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const deleteEvents = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.month)
        {
            const result = await service.deleteEvents(req.query.month, req.headers.authorization)
            if(result.Exist == false )
            {
                return res.status(404).json({Status:404, Message:`Month events not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:'Month Events successfuly deleted'})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            const result = await service.deleteAllEvents(req.headers.authorization)
            if(result.Exist == false )
            {
                return res.status(404).json({Status:404, Message:`Events not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:'Events successfuly deleted'})
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

export default {
    getEvents,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteEvents,
}
