import {Request ,Response, NextFunction} from "express"
import service from "../services/group.service"
const getGroups = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        const result = await service.getGroups(req.headers.authorization)
        if(result.Success && result.Data)
        {
            return res.status(200).json({Status:200, Data:result.Data})
        }
        else if(result.Success && !result.Data)
        {
            return res.status(200).json({Status:200, Message:"Groups get success, but there is no data"})
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

const getStudents = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            const result = await service.getStudents(req.query.groupId, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:'No permission. Cannot view students from this group'})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Group with specifed id doesn't exist`})
            }
            if(result.Success && result.Data)
            {
                return res.status(200).json({Status:200, Data:result.Data})
            }
            else if(result.Success && !result.Data)
            {
                return res.status(200).json({Status:200, Message:"Students get success, but there is no data"})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId not provided'})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const getSubjects = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            const result = await service.getSubjects(req.query.groupId, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission. Cannot view subjects of this group`})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Group with specifed id doesn't exist`})
            }
            if(result.Success && result.Data)
            {
                return res.status(200).json({Status:200, Data:result.Data})
            }
            else if(result.Success && !result.Data)
            {
                return res.status(200).json({Status:200, Message:'Subjects get succesfuly but there is no data'})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId not provided'})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const getStudentMarks = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.studentId)
        {
            const result = await service.getStudentMarks(req.query.studentId, req.headers.authorization)
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Student with specifed id doesn't exist`})
            }
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission. Cannot view student marks `})
            }
            if(result.Success && result.Data)
            {
                return res.status(200).json({Status:200, Data:result.Data})
            }
            else if(result.Succes && !result.Data)
            {
                return res.status(200).json({Status:200, Message:'Student marks get successfuly, but there is no data'})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:"Parameter studentId not provided"})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const addGroup = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.body.group_no || !req.body.study_field || !req.body.term || !req.body.study_form || !req.body.study_degree)
        {
            return res.status(400).json({Status:400, Message:'Fields groupNo, study field, term, study form and study degree are required'})
        }
        else
        {
            const result = await service.addGroup(req.body, req.headers.authorization)
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:result.Message})
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

const addStudent = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            if(!req.body.album_no || !req.body.first_name || !req.body.last_name)
            {
                return res.status(400).json({Status:400, Message:'Fields albumNo, first and last name are required'})
            }
            else
            {
                const result = await service.addStudent(req.query.groupId,req.body, req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:`You aren't owner of this group, you can't add student`})
                }
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:'Group not found, cannot add student'})
                }
                if(result.Email == false)
                {
                    return res.status(400).json({Status:400, Message:'Wrong student email, please correct'})
                }
                if(result.Success)
                {
                    return res.status(201).json({Status:201, Message:result.Message})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId not provided'})
        }
        
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const addSubject = async (req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            {
                if(!req.body.subject_name || !req.body.subject_type)
                {
                    return res.status(400).json({Status:400, Message:'All fields are required'})
                }
                const result = await service.addSubject(req.query.groupId,req.body,req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:`You aren't owner of this group, you can't add subject`})
                }
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:'Group not found, cannot add subject'})
                }
                if(!result.Success && result.Attached)
                {
                    return res.status(400).json({Status:400, Message:result.Message})
                }
                if(result.Success && result.Attached)
                {
                    return res.status(201).json({Status:201, Message:result.Message})
                }
                if(result.Succes)
                {
                    return res.status(201).json({Status:201, Message:result.Message})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
        }
        else
        {

        }
    }   
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const addMark = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.groupId || !req.query.subjectId)
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId or subjectId not provided'})
        }
        else
        {
            if(!req.body.mark_value || !req.body.mark_desc || !req.body.weight || !req.body.studentId)
            {
                return res.status(400).json({Status:400, Message:'All fields are required'})
            }
            
            const result = await service.addMark(req.query.groupId, req.query.subjectId, req.body, req.headers.authorization)
            if(result.SubPermission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission. You aren't owner of this group or subject`})
            }
            if(result.SubExist == false)
            {
                return res.status(404).json({Status:404, Message:`Subject or group not found or subject doesn't belong to this group`})
            }
            if(result.StudExist == false)
            {
                return res.status(404).json({Status:404, Message:`Student not found or doesn't belog to this group`})
            }
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:'Mark sucessfuly added to student'})
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

const updateGroup = async(req:Request, res:Response, next:NextFunction) => {
    try
    {
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            if(!req.body.group_no || !req.body.study_field || !req.body.term || !req.body.study_form || !req.body.study_degree)
            {
                return res.status(400).json({Status:400, Message:`Fields groupNo, study field, term, study form and study degree are required`})
            }
            const result = await service.updateGroup(req.query.groupId,req.body,req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission. You aren't owner of this group`})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Group not found, cannot be updated`})
            }
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:`Group successfuly updated`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId not provided'})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const updateStudent = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.groupId || !req.query.studentId)
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId or studentId not provided'})
        }
        if(!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.album_no)
        {
            return res.status(400).json({Status:400, Message:'All fields are required'})
        }
        const result = await service.updateStudent(req.query.studentId, req.query.groupId, req.body,req.headers.authorization)
        if(result.Permission == false)
        {
            return res.status(401).json({Status:401, Message:`No permission. You can't update student from this group`})
        }
        if(result.Exist == false )
        {
            return res.status(404).json({Status:404, Message:`Group not found. Cannot update student`})
        }
        if(result.Email == false )
        {
            return res.status(400).json({Status:400, Message:`Invalid student email. Please correct`})
        }
        if(result.Student == false)
        {
            return res.status(404).json({Status:404, Message:`Student not found`})
        }
        if(result.Success)
        {
            return res.status(201).json({Status:201, Message:`Student successfuly updated`})
        }
        else
        {
            return res.status(401).json({Status:404, Message:result.Message})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const updateSubject = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.subjectId)
        {
            if(!req.body.subject_name || !req.body.subject_type)
            {
                return res.status(400).json({Status:400, Message:'All fields are required'})
            }
            const result = await service.updateSubject(req.query.subjectId, req.body, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission. Cannot update subject`})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Stauts:404, Message:`Subject not found`})
            }
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:`Subject successfuly updated`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter subjectId not provided'})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const updateMark = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(!req.query.studentId || !req.query.groupId)
        {
            return res.status(400).json({Status:400, Message:'Parameter subjectId or groupId not provided'})
        }
        if(!req.body.mark_value || !req.body.mark_desc || !req.body.weight || !req.body.id)
        {
            return res.status(400).json({Status:400, Message:'All fields are required'})
        }
        else
        {
            const result = await service.updateMark(req.query.studentId, req.query.groupId, req.body, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:'No permission. Cannot update mark of student from this group'})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:'Group not found, cannot update student mark'})
            }
            if(result.StudExist == false)
            {
                return res.status(404).json({Status:404, Message:'Student not found'})
            }
            if(result.MarkExist == false)
            {
                return res.status(404).json({Status:404, Message:'Mark not found'})
            }
            if(result.Success)
            {
                return res.status(201).json({Status:201, Message:'Student mark successfuly updated'})
            }
            else
            {
                return res.status(404).json({Status:404, Message:result.Message})
            }
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const deleteGroups = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            const result = await service.deleteGroup(req.query.groupId, req.headers.authorization)
            console.log(result)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No permission. Cannot remove this group`})
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Group not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Group successfuly deleted`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            const result = await service.deleteGroups(req.headers.authorization)
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Groups not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Groups successfuly deleted`})
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

const deleteStudents = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.groupId)
        {
            if(req.query.studentId)
            {
                const result = await service.deleteStudent(req.query.groupId, req.query.studentId, req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:'No permission. Cannot delete student from this group'})
                }
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:'Group not found, cannot delete student'})
                }
                if(result.Student == false)
                {
                    return res.status(404).json({Status:404, Message:'Student not found'})
                }
                if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Student successfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
            else
            {
                const result = await service.deleteStudents(req.query.groupId, req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:'No permission. Cannot delete students from this group'})
                }
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:'Group not found, cannot delete students'})
                }
                if(result.Students == false)
                {
                    return res.status(404).json({Status:404, Message:'Students not found'})
                }
                if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Students successfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:'Parameter groupId not provided'})
        }
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const deleteDetachSubjects = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.subjectId)
        {
            if(req.query.groupId)
            {
                const result = await service.detachSubject(req.query.groupId, req.query.subjectId, req.headers.authorization)
                if(result.GrPermission == false || result.SubPermission==false)
                {
                    return res.status(401).json({Status:401, Message:`No Permission to group or subject`})
                }
                if(result.GrExist == false || result.SubExist == false)
                {
                    return res.status(404).json({Status:404, Message:`Group or subject not found`})
                }
                if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Subject successfuly detached from group`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
            else
            {
                const result = await service.deleteSubject(req.query.subjectId, req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:`No Permission to this subject`}) 
                }
                if(result.Exist == false)
                {
                    return res.status(404).json({Status:404, Message:`Subject not found`})
                }
                if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Subject successfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
        }
        else if(req.query.groupId)
        {
            const result = await service.detachSubjects(req.query.groupId, req.headers.authorization)
            if(result.Permission == false)
            {
                return res.status(401).json({Status:401, Message:`No Permission to this group`}) 
            }
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Group not found`})
            }
            if(result.Detach == false)
            {
                return res.status(400).json({Status:400, Message:`No subjects to detach`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Subjects successfuly detached from group`})
            }
            else
            {
                return res.status(401).json({Status:401, Message:result.Message})
            }
        }
        else
        {
            const result = await service.deleteSubjects(req.headers.authorization)
            if(result.Exist == false)
            {
                return res.status(404).json({Status:404, Message:`Subjects not found`})
            }
            if(result.Success)
            {
                return res.status(200).json({Status:200, Message:`Subjects successfuly deleted`})
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

const deleteMarks = async(req:Request, res:Response, next:NextFunction) => {
    try
    {   
        if(!req.headers.authorization)
        {
            return res.status(401).json({Status:401, Message:'No permission. Please login.'})
        }
        if(req.query.studentId)
        {
            if(req.query.markId)
            {
                const result = await service.deleteMark(req.query.markId, req.query.studentId, req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:`No perrmision to delete this student mark`})
                }
                if(result.StudExist == false || result.MarkExist == false)
                {
                    return res.status(404).json({Status:404, Message:`Student or mark not found`})
                }
                if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Student mark succesfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
            else
            {
                const result = await service.deleteMarks(req.query.studentId, req.headers.authorization)
                if(result.Permission == false)
                {
                    return res.status(401).json({Status:401, Message:`No perrmision to delete this student marks`})
                }
                if(result.StudExist == false || result.MarkExist == false)
                {
                    return res.status(404).json({Status:404, Message:`Student or marks not found`})
                }
                if(result.Success)
                {
                    return res.status(200).json({Status:200, Message:`Student marks succesfuly deleted`})
                }
                else
                {
                    return res.status(401).json({Status:401, Message:result.Message})
                }
            }
        }
        else
        {
            return res.status(400).json({Status:400, Message:`Parameter studentId not provided`})
        }
        
    }
    catch(e:any)
    {
        return res.status(500).json({Status:500, Message:e.message})
    }
}

export default{
    getGroups,
    getStudents,
    getSubjects,
    getStudentMarks,
    addGroup,
    addStudent,
    addSubject,
    addMark,
    updateGroup,
    updateStudent,
    updateSubject,
    updateMark,
    deleteGroups,
    deleteStudents,
    deleteDetachSubjects,
    deleteMarks,
}