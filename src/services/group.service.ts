import auth from "../middleware/auth"
import Log from "../middleware/logger"
import client from "../middleware/db-connection"
import { group } from "console"
const dB = client

const getGroups = async(token:string) => {
    try{
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`select * from groups where userid = ${verifed.Data.userId}`)
            if(result.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get groups`)
                return { Success:true, Data:result.rows }
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get groups, but recived no Data`)
                return { Success:true, Data:null }
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
        throw Error("An error ocured while trying to get groups")
    }

}

const getStudents = async(groupId:any,token:string) => { 
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkPerm = await dB.query(`Select * from groups where id = ${groupId}`)
            if(checkPerm.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get students from notexistent group`)
                return { Exist:false }
            }
            if(checkPerm.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get students from not his group`)
                return { Permission:false }
            }
            const results = await dB.query(`Select * from students where groupid = ${groupId}`)
            if(results.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get students from group with id: ${groupId}`)
                return { Success:true, Data:results.rows}
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get students from group with id: ${groupId}, but recived no Data`)
                return { Success:true, Data:null}
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
        throw Error("An error ocured while trying to get students")
    }
}

const getSubjects = async(groupId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkAuth = await dB.query(`select * from groups where id = ${groupId}`)
            if(checkAuth.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get subjects from notexistent group`)
                return { Exist:false }
            }
            if(checkAuth.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get subjects from not his group`)
                return { Permission:false }
            }
            const result = await dB.query(`select subjectid,subject_name,subject_type
                    from groups_subjects inner join groups on (groups.id = groups_subjects.groupid) 
                    inner join subjects on (subjects.id = groups_subjects.subjectid) where groups.id = ${groupId}`)
            if(result.rowCount > 0 )
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get subjects from group with id: ${groupId}`)
                return { Success:true, Data:result.rows } 
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get subject from group with id: ${groupId}, but recived no Data`)
                return { Success:true, Data:null } 
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
        throw Error("An error ocured while trying to get subjects")
    }
}

const getStudentMarks = async (studentId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkAuth = await dB.query(`select * from students join groups on(students.groupid = groups.id) where students.id = ${studentId}`)
            if(checkAuth.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get marks of nonexistent student`)
                return { Exist:false }  
            }
            if(checkAuth.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get marks of not his student`)
                return { Permission:false}
            }
            const result = await dB.query(`select * from marks join subjects on(marks.subjectid = subjects.id) where studentid = ${studentId}`)
            if(result.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get marks of student with id: ${studentId}`)
                return { Success:true, Data:result.rows}
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get marks of student with id: ${studentId}, but recived no Data`)
                return { Success:true, Data:null}
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
        throw Error("An error ocured while trying to get student marks")
    }
}

const addGroup = async (obj:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly add group`)
            await dB.query(`Insert into groups(group_no, study_field, term, study_form, study_degree, spec, userid) 
                            values(${obj.group_no},'${obj.study_field}', ${obj.term}, '${obj.study_form}','${obj.study_degree}', '${obj.spec}',${verifed.Data.userId})`)
       
            return { Success:true, Message:'Group successfuly added'}
        }
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error("An error ocured while trying to add group")
    }
}

const addStudent = async(groupId:any, obj:any, token:string) => {
    try
    {
        let regexpEmail :RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkPerm = await dB.query(`Select * from groups where id = ${groupId}`)
            if(checkPerm.rowCount < 1)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add student to nonexistent group`)
                return { Exist:false }
            }
            else if(checkPerm.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add student to not his group`)
                return { Permission:false }
            }
            if(!regexpEmail.test(obj.email) && obj.email)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add student with invalid email: ${obj.email}`)
                return { Email:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly added student to group with id: ${groupId}`)
            await dB.query(`Insert into students(album_no, first_name, last_name, email, groupid)
                        values(${obj.album_no}, '${obj.first_name}', '${obj.last_name}', '${obj.email.toLowerCase()}', ${groupId})`)
            
            return { Success:true, Message:'Student successfuly added to group' }
        }
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error("An error ocured while trying to add student to group")
    }
}

const addSubject = async (groupId:any, obj:any, token:string) => {
    try
    {   
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkAuth = await dB.query(`select * from groups where id=${groupId}`)
            if(checkAuth.rowCount = 0)
            {   
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add subject to nonexistent group`)
                return { Exist:false }
            }
            if(checkAuth.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add subject to not his group`)
                return { Permission:false }
            }
            const exist = await dB.query(`select * from subjects 
                where lower(subject_name) like '%${obj.subject_name.toLowerCase()}%' 
                and lower(subject_type) like '%${obj.subject_type.toLowerCase()}%' 
                and userid=${verifed.Data.userId}`)
            if(exist.rowCount > 0 )
            {
                const attached = await dB.query(`select * from groups_subjects where groupid = ${groupId} and subjectid = ${exist.rows[0].id}`)
                if(attached.rowCount > 0 )
                {
                    Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add subject that already exist and it's attached to this group`)
                    return { Success:false, Attached:true, Message:'Subject already exist and is attached to this group'}
                }
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User tried to add subject group with id:${groupId}, but it was only attached to this group`)
                await dB.query(`Insert into groups_subjects values(${groupId},${exist.rows[0].id})`)
                return { Success:true, Attached:true, Message:'Subject exist, but was attached to group'}
            }
            else
            {
                await dB.query(`Insert into subjects(subject_name, subject_type, userid) 
                    values('${obj.subject_name}','${obj.subject_type}',${verifed.Data.userId})`)
                
                const id = await dB.query(`select id from subjects 
                    where lower(subject_name) like '%${obj.subject_name.toLowerCase()}%' 
                    and lower(subject_type) like '%${obj.subject_type.toLowerCase()}%' 
                    and userid=${verifed.Data.userId}`)

                Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly added subject to group with id: ${groupId}, and subject successfuly attached to this group`)

                await dB.query(`Insert into groups_subjects values(${groupId},${id.rows[0].id})`)

                return { Success:true, Message:'Subject sucessfuly added and attached to group'}
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
        throw Error("An error ocured while trying to add subject")
    }
}

const addMark = async(groupId:any, subjectId:any, obj:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkSub = await dB.query(`select * from groups_subjects inner join 
                    groups on(groups.id = groups_subjects.groupid) where groupid=${groupId} and subjectid = ${subjectId} `)
            if(checkSub.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add mark of nonexistent subject`)
                return { SubExist:false }
            }
            if(checkSub.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add mark of not his subject`)
                return { SubPermission:false }
            }
            const checkStud = await dB.query(`select * from students where id=${obj.studentId} and groupid = ${groupId}`)
            if(checkStud.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add mark for nonexistent student`)
                return { StudExist:false}
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User succesfuly added mark of subject with id: ${subjectId}, for student with id: ${obj.studentId}`)
                await dB.query(`Insert into marks(mark_value, mark_desc, weight, studentid, subjectid)
                    values(${obj.mark_value}, '${obj.mark_desc}',${obj.weight}, ${obj.studentId}, ${subjectId})`)
                
                return { Success:true }
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
        throw Error("An error ocured while trying to add mark to student")
    }
}

const updateGroup = async(groupId:any, obj:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`Select * from groups where id = ${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent group`)
                return { Exist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his group`)
                return { Permission:false }
            }
            
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated group with id: ${groupId}`)
            await dB.query(`Update groups set
                    group_no = ${obj.group_no},
                    study_field = '${obj.study_field}',
                    term = '${obj.term}',
                    study_form = '${obj.study_form}',
                    study_degree = '${obj.study_degree}'
                where id = ${groupId}`)
            
            return { Success:true}
        }
        else
        {
            return verifed
        }
    }
    catch(e:any)
    {
        Log.error(`Type:Server error -- Message: ${e.message}`)
        throw Error("An error ocured while trying to update group")
    }
}

const updateStudent = async(studentId:any, groupId:any, obj:any,token:string) => {
    try
    {
        let regexpEmail :RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`select * from groups where id = ${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update student from nonexistent group`)
                return { Exist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update student from not his group`)
                return { Permission:false }
            }
            const checkStud = await dB.query(`select * from students join groups on (groups.id = students.groupid)
                                            where groupid = ${groupId} and students.id=${studentId}`)
            
            if(checkStud.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent student in group`)
                return { Student:false }
            }
            if(!regexpEmail.test(obj.email))
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update student with invalid email`)
                return { Email:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated student with id: ${studentId} from group with id: ${groupId}`)
            await dB.query(`Update students set
                album_no = ${obj.album_no},
                first_name = '${obj.first_name}',
                last_name = '${obj.last_name}',
                email = '${obj.email}'
                where id = ${studentId}`)
            
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
        throw Error("An error ocured while trying to update student")
    }
}

const updateSubject = async(subjectId:any,obj:any,token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkSub = await dB.query(`Select * from subjects where id=${subjectId}`)
            if(checkSub.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent subject`)
                return { Exist:false }
            }
            if(checkSub.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update not his subject`)
                return { Permission:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated subject with id: ${subjectId}`)
            await dB.query(`Update subjects set
                    subject_name = '${obj.subject_name}',
                    subject_type = '${obj.subject_type}'
                where id = ${subjectId}`)

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
        throw Error("An error ocured while trying to update subject")
    }
}

const updateMark = async(studentId:any, groupId:any, obj:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {  
            const checkGroups = await dB.query(`select * from groups where id = ${groupId}`)
            if(checkGroups.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update mark of student from nonexistent group`)
                return { Exist:false }
            }
            if(checkGroups.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update mark of student from not his group`)
                return { Permission:false }
            }
            const checkStud = await dB.query(`select * from students where id = ${studentId}`)
            if(checkStud.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update mark of nonexistent student`)
                return { StudExist:false }
            }
            const checkMark = await dB.query(`select * from marks where studentid=${studentId} and id=${obj.id}`)
            if(checkMark.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly updated mark with id: ${obj.id} of student with id: ${studentId}`)
                await dB.query(`update marks set
                            mark_value=${obj.mark_value},
                            mark_desc='${obj.mark_desc}',
                            weight = ${obj.weight}
                where id=${obj.id} and studentid =${studentId}`)

                return { Success:true }
            }
            else
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent mark`)
                return { MarkExist:false }
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
        throw Error("An error ocured while trying to update student mark")
    }
}

const deleteGroup = async(groupId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`Select * from groups where id=${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent group`)
                return { Exist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his group`)
                return { Permission:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted group with id: ${groupId}`)
            await dB.query(`delete from groups where id=${groupId}`)
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
        throw Error("An error ocured while trying to delete group")
    }
}

const deleteGroups = async(token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`Select * from groups where userid=${verifed.Data.userId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent groups`)
                return { Exist:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly delete all his groups`)
            await dB.query(`delete from groups where userid=${verifed.Data.userId}`)
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
        throw Error("An error ocured while trying to delete group")
    }
}

const deleteStudent = async(groupId:any, studentId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`select * from groups where id = ${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete student from nonexistent group`)
                return { Exist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete student from not his group`)
                return { Permission:false }
            }
            const checkStud = await dB.query(`select * from students join groups on (groups.id = students.groupid)
                                            where groupid = ${groupId} and students.id=${studentId}`)
            
            if(checkStud.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent student`)
                return { Student:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted student with id: ${studentId} from group with id: ${groupId}`)
            await dB.query(`Delete from students where id=${studentId} and groupid=${groupId}`)
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
        throw Error("An error ocured while trying to remove student")
    }
}

const deleteStudents = async(groupId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`select * from groups where id = ${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete students from nonexistent group`)
                return { Exist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {   
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete students from not his group`)
                return { Permission:false }
            }
            const checkStud = await dB.query(`select * from students join groups on (groups.id = students.groupid)
                                            where groupid = ${groupId}`)
            
            if(checkStud.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent students`)
                return { Students:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted students from group with id: ${groupId}`)
            await dB.query(`Delete from students where groupid=${groupId}`)
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
        throw Error("An error ocured while trying to remove students")
    }
}

const deleteSubject = async(subjectId:any, token:string) => {
    try
    {
        const verifed  = await auth(token)
        if(verifed.Success)
        {
            const checkSub = await dB.query(`Select * from subjects where id=${subjectId}`)
            if(checkSub.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent subject`)
                return { Exist:false }
            }
            if(checkSub.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete not his subject`)
                return { Permission:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted subject with id: ${subjectId}`)
            await dB.query(`Delete from subjects where id=${subjectId}`)
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
        throw Error("An error ocured while trying to remove subject")
    }
}

const deleteSubjects = async(token:string) => {
    try
    {
        const verifed  = await auth(token)
        if(verifed.Success)
        {
            const checkSub = await dB.query(`Select * from subjects where userid=${verifed.Data.userId}`)
            if(checkSub.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent subjects`)
                return { Exist:false }
            }
            await dB.query(`Delete from subjects where userid=${verifed.Data.userId}`)
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
        throw Error("An error ocured while trying to remove subjects")
    }
}

const detachSubject = async(groupId:any, subjectId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`select * from groups where id=${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subject from nonexistent subject`)
                return { GrExist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subject from not his subject`)
                return { GrPermission:false }
            }
            const checkSub = await dB.query(`Select * from subjects where id=${subjectId}`)
            if(checkSub.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach nonexistent subject`)
                return { SubExist:false }
            }
            if(checkSub.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach not his subject`)
                return { SubPermission:false }
            }
            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly detached subject with id: ${subjectId} from group with id: ${groupId}`)
            await dB.query(`Delete from groups_subjects where groupid=${groupId} and subjectId = ${subjectId}`)
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
        throw Error("An error ocured while trying to detach subject from group")
    }
}

const detachSubjects = async(groupId:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkGr = await dB.query(`select * from groups where id=${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subjects from nonexistent group`)
                return { Exist:false }
            }
            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach subjects from not his group`)
                return { Permission:false }
            }
            const checkAtch = await dB.query(`Select * from groups_subjects where groupid=${groupId}`)
            if(checkAtch.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly detached subjects from group with id: ${groupId}`)
                await dB.query(`Delete from groups_subjects where groupid=${groupId}`)
                return { Success:true }
            }
            else
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach nonexistent subjects group`)
                return { Detach:false }
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
        throw Error("An error ocured while trying to detach subject from group")
    }
}

const deleteMark = async(markId:any, studentId:any, token:string) => {
    try
    {  
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkStud = await dB.query(`select * from students join groups on(students.groupid = groups.id) where students.id=${studentId}`)
            if(checkStud.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete mark of nonexistent student`)
                return { StudExist:false }
            }
            if(checkStud.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete mark of not his student`)
                return { Permission:false }
            }
            const checkMark = await dB.query(`select * from marks where id=${markId} and studentid=${studentId}`)
            if(checkMark.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent mark`)
                return { MarkExist:false }
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted mark with id: ${markId} of studednt with id: ${studentId}`)
                await dB.query(`delete from marks where studentid=${studentId} and id=${markId}`)
                return { Success:true }
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
        throw Error("An error ocured while trying to remove student mark")
    }
}

const deleteMarks = async(studentId:any, token:string) => {
    try
    {  
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkStud = await dB.query(`select * from students join groups on(students.groupid = groups.id) where students.id=${studentId}`)
            if(checkStud.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete marks of nonexistent student`)
                return { StudExist:false }
            }
            if(checkStud.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete marks of not his student`)
                return { Permission:false }
            }
            const checkMark = await dB.query(`select * from marks where studentid=${studentId}`)
            if(checkMark.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent marks`)
                return { MarkExist:false }
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted all marks of student with id: ${studentId}`)
                await dB.query(`delete from marks where studentid=${studentId}`)
                return { Success:true }
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
        throw Error("An error ocured while trying to remove student mark")
    }
}

export default {
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
    deleteGroup,
    deleteGroups,
    deleteStudent,
    deleteStudents,
    deleteSubject,
    deleteSubjects,
    detachSubject,
    detachSubjects,
    deleteMark,
    deleteMarks
}