import {Request ,Response, NextFunction} from "express"
import service from "../services/schedule.service"

const getShedules = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        const result = await service.getSchedules(req.headers.authorization)
        if(result.Success && result.Data)
        {
            return res.status(200).json({Status:200, Data:result.Data})
        }
        else if (result.Success && !result.Data)
        {
            return res.status(200).json({Status:200, Message:`Success but there is no data`})
        }
        else
        {
            return res.status(401).json({Status:401, Message:result.Message})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const getSchedule = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.day || !req.query.begin || !req.query.end)
        {
            
            return res.status(400).json({Status:400, Message:`Parameters day or begin or end not provided`})
        }
        else
        {
            const result = await service.getSchedule(req.query.day, req.query.begin, req.query.end, req.headers.authorization)
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Schedule with specifed parameters not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Data:result.Data})
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

const attachGroup = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.day || !req.query.begin || !req.query.end || !req.body.groupId)
        {
            return res.status(400).json({Status:400, Message:`Parameters day or begin or end or groupId not provided`})
        }
        const result = await service.attachGroup(req.body.groupId, req.query.day, req.query.begin, req.query.end, req.headers.authorization)
        console.log(result)
        if(result.GrPermission == false)
        {
            return res.status(401).json({Status:401, Message:`No permission to group`})
        }
        if(result.GrExist == false)
        {
            return res.status(404).json({Status:404, Message:`Group not found`})
        }
        if(result.ScheExist == false)
        {
            return res.status(404).json({Status:404, Message:`Schedule not found`})
        }
        if(result.SubGroupExist == false)
        {
            return res.status(404).json({Status:404, Message:`Specifed group doesn't attend to this subject`})
        }
        if(result.Attached == true)
        {
            return res.status(400).json({Status:404, Message:`Group already attached to this schedule`})
        }
        if(result.Success)
        {
            return res.status(201).json({Status:201, Message:`Group successfuly attached to this schedule`})
        }
        else
        {
            return res.status(401).json({Status:401, Message:result.Message})
        }
    }
    catch
    {

    }
}

const detachGroup = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.day || !req.query.begin || !req.query.end || !req.body.groupId)
        {
            return res.status(400).json({Status:400, Message:`Parameters day or begin or end or groupId not provided`})
        }
        const result = await service.detachGroup(req.body.groupId, req.query.day, req.query.begin, req.query.end, req.headers.authorization)
        if(result.GrPermission == false)
        {
            return res.status(401).json({Status:401, Message:`No permission to group`})
        }
        if(result.GrExist == false)
        {
            return res.status(404).json({Status:404, Message:`Group not found`})
        }
        if(result.ScheExist == false)
        {
            return res.status(404).json({Status:404, Message:`Schedule not found`})
        }
        if(result.Attached == false)
        {
            return res.status(404).json({Status:404, Message:`This group is not attached to schedudle`})
        }
        if(result.Success)
        {
            return res.status(201).json({Status:201, Message:`Group successfuly detached from this schedule`})
        }
        else
        {
            return res.status(401).json({Status:401, Message:result.Message})
        }
    }
    catch
    {

    }
}

const addSchedule = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.body.day || !req.body.begin || !req.body.end || !req.body.classroom || !req.body.faculty || !req.body.subjectId || !req.body.groups)
        {
            return res.status(400).json({Status:400, Message:`All fields are required`})
        }
        const result = await service.addSchedule(req.body,req.headers.authorization)
        if(result.SubPermission == false)
        {
            return res.status(401).json({Status:401, Message:'No permission to subject'})
        }
        if(result.SubExist == false)
        {
            return res.status(404).json({Status:404, Message:'Subject not found'})
        }
        if(result.GrPermission == false)
        {
            return res.status(401).json({Status:401, Message:'No permission to some groups'})
        }
        if(result.GrExist == false)
        {
            return res.status(404).json({Status:404, Message:'Some of the groups cannot be found'})
        }
        if(result.GrSubExist == false)
        {
            return res.status(404).json({Status:404, Message:`Some of the groups aren't attend to this subject`})
        }
        if(result.TimeCheck == false)
        {
            return res.status(400).json({Status:400, Message:`There are already scheduled class in this day and time`})
        }
        if(result.Success && !result.AllSche)
        {
            return res.status(201).json({Status:201, Message:`Schedule successfuly added`})
        }
        else if(result.Success && result.NotAllSche)
        {
            return res.status(201).json({Status:201, Message:`Schedule successfuly added, but some of the groups already have sheduled class with this subject`})
        }
        else if(!result.Success && !result.AllSche)
        {
            return res.status(400).json({Status:400, Message:`Group or groups already have sheduled class with this subject`})
        }
        else
        {
            return res.status(401).json({Status:401, Message:result.Message})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Stauts:500, Message:e.message})
    }
}

const updateSchedule = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.day || !req.query.begin || !req.query.end)
        {
            return res.status(400).json({Status:400, Message:`Parameters day or begin or end not provided`})
        }
        if(!req.body.day || !req.body.begin || !req.body.end || !req.body.classroom || !req.body.faculty || !req.body.subjectid)
        {
            return res.status(400).json({Status:400, Message:`All fields are required`})
        }

        const result = await service.updateSchedule(req.query.day, req.query.begin, req.query.end, req.body,req.headers.authorization)
        if(result.Exist == false)
        {
            return res.status(404).json({Status:404, Message:'Schedule not found'})
        }
        if(result.SubPermission == false)
        {
            return res.status(401).json({Status:401, Message:'No permission to subject'})
        }
        if(result.SubExist == false)
        {
            return res.status(404).json({Status:404, Message:'Subject not found'})
        }
        if(result.TimeCheck == false)
        {
            return res.status(400).json({Status:400, Message:`There are already scheduled class in this day and time`})
        }
        if(result.Success && result.Some)
        {
            return res.status(201).json({Status:201, Message:`Schedule successfuly updated, but some group or groups had to be unscheduled because doesn't attend to this subject or arleady have scheduled class`})
        }
        else if(!result.Success && !result.Some)
        {
            return res.status(400).json({Status:400, Message:`Schedule not updated, because group or groups doesn't attend to this subject or already scheduled`})
        }
        else if(result.Success)
        {
            return res.status(200).json({Status:200, Message:`Schedule successfuly updated`})
        }
        else
        {
            return res.status(401).json({Status:401, Message:result.Message})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Stauts:500, Message:e.message})
    }
}

const deleteSchedules = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.day)
        {
            if(req.query.begin && req.query.end)
            {
                const result = await service.deleteSchedule(req.query.day, req.query.begin, req.query.end, req.headers.authorization)
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:`Schedule not found`})
                }
                else if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Schedule successfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
            else
            {
                const result = await service.deleteDaySchedules(req.query.day, req.headers.authorization)
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:`Day schedules not found`})
                }
                else if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Day schedules successfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
        }
        else
        {   
            const result = await service.deleteSchedules(req.headers.authorization)
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Schedules not found`})
            }
            else if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Schedules successfuly deleted`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Stauts:500, Message:e.message})
    }
}

export default{
    getShedules,
    getSchedule,
    attachGroup,
    detachGroup,
    addSchedule,
    updateSchedule,
    deleteSchedules,
}