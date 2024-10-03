import auth from "../middleware/auth"
import Log from "../middleware/logger"
import client from "../middleware/db-connection"
import e from "express"
const dB = client

const getSchedules = async(token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`select * from schedules where userid=${verifed.Data.userId}`)
            if(result.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get schedules`)
                return { Success:true, Data:result.rows}
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get schedules, but recived no data`)
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
        throw Error('An error ocured while trying to get schedules')
    }
}

const getSchedule = async(day:any, begin:any, end:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`select * from schedules join groups on(schedules.groupid = groups.id) 
                    join subjects on(schedules.subjectid = subjects.id) 
                    where schedules.userid = ${verifed.Data.userId} and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
            if(result.rowCount > 0)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: Yes -- Message: User successfuly get schedule`)
                return { Success:true, Data:result.rows }
            }
            else
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: GET -- Success: No -- Message: User tried to get nonexistent schedule`)
                return { Exist: false }
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
        throw Error('An error ocured while trying to get schedules')
    }
}

const attachGroup = async (groupId:any, day:any, begin:any, end:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkSche = await dB.query(`select * from schedules join groups on(schedules.groupid = groups.id) 
                    join subjects on(schedules.subjectid = subjects.id) 
                    where schedules.userid = ${verifed.Data.userId} and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
            if(checkSche.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to attach group to nonexistent schedule`)
                return { ScheExist:false }
            }

            const checkGr = await dB.query(`select * from groups where id=${groupId}`)
            if(checkGr.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to attach nonexistent group to schedule`)
                return { GrExist:false }
            }

            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to attach not his group to schedule`)
                return { GrPermission:false }
            }

            const checkSubGroup = await dB.query(`select * from groups_subjects where groupid=${groupId} and subjectId=${checkSche.rows[0].subjectid}`)
            if(checkSubGroup.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to attach to schedule group with not valid subject`)
                return { SubGroupExist:false }
            }
            const checkAttached = await dB.query(`select * from schedules where lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}' and groupId = ${groupId}`)
            if(checkAttached.rowCount > 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to attach to schedule group that is already attached`)
                return { Attached:true }
            }

            Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User successfuly attached group with id: ${groupId} to schedule [${day}, ${begin}, ${end}]`)
            await dB.query(`insert into schedules (WEEK_DAY,TIME_BEGIN,TIME_END,CLASSROOM,FACULTY,USERID,SUBJECTID,GROUPID) values(
                    '${day}',
                    '${begin}',
                    '${end}',
                    '${checkSche.rows[0].classroom}',
                    '${checkSche.rows[0].faculty}',
                    ${verifed.Data.userId},
                    ${checkSche.rows[0].subjectid},
                    ${groupId})`)

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
        throw Error("An error ocured while trying to attach group to schedule")
    }
}

const detachGroup = async (groupId:any, day:any, begin:any, end:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkSche = await dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} 
            and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
            if(checkSche.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach group from nonexistent schedule`)
                return { ScheExist:false }
            }

            const checkGr = await dB.query(`select * from groups where id=${groupId}`)
            if(checkGr.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach nonexistent group from schedule`)
                return { GrExist:false }
            }

            if(checkGr.rows[0].userid != verifed.Data.userId)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach nothis group from schedule`)
                return { GrPermission:false }
            }

            const checkAttached = await dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} 
            and lower(week_day) like '${day.toLowerCase()}' and groupid = ${groupId} and time_begin = '${begin}' and time_end ='${end}'`)
            if(checkAttached.rowCount == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to detach not attached group from schedule`)
                return { Attached:false }
            }

            Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly detached group with id: ${groupId} to schedule [${day}, ${begin}, ${end}]`)
            await dB.query(`delete from schedules where userid = ${verifed.Data.userId} 
                    and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}' and groupid=${groupId}`)

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
        throw Error("An error ocured while trying to attach group to schedule")
    }
}

const addSchedule = async(obj:any, token:string) => {
    try
    {
        var notShe:any = []
        var j = 0
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const checkSub = await dB.query(`Select * from subjects where id=${obj.subjectId}`)
            if(checkSub.rowCount == 0 )
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule with nonexistent subject`)
                return { SubExist:false }
            }
            if(checkSub.rows[0].userid != verifed.Data.userId)
            {   
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule with not his subject`)
                return { SubPermission:false }
            }
            const checkTime = await dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} 
                and lower(week_day) like '${obj.day.toLowerCase()}' and time_begin between '${obj.begin}' and '${obj.end}'`)
            if(checkTime.rowCount > 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule with time that override other schedule`)
                return { TimeCheck:false}
            }
            for(let i = 0; i< obj.groups.length; i++)
            {
                const checkGr = await dB.query(`select * from groups where id=${obj.groups[i]}`)
                if(checkGr.rowCount == 0)
                {
                    Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule with nonexistent group`)
                    return { GrExist:false }
                }

                if(checkGr.rows[0].userid != verifed.Data.userId)
                {   
                    Log.error(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule with not his group`)
                    return { GrPermission:false }
                }

                const checkGrSub = await dB.query(`select * from groups_subjects where groupid=${obj.groups[i]} and subjectid=${checkSub.rows[0].id}`)
                if(checkGrSub.rowCount == 0)
                {
                    Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule with group with not valid subject`)
                    return { GrSubExist:false }
                }

                const checkScheduled = await dB.query(`select * from schedules where userid = ${verifed.Data.userId} and groupid=${obj.groups[i]} and subjectid=${checkSub.rows[0].id}`)
                if(checkScheduled.rowCount == 0)
                {
                    notShe[j] = checkScheduled.rows[i].groupid
                    j++
                }
            }

            for(let i = 0; i< obj.groups.length; i++)
            {
                for(let j = 0; j<notShe.length; j++)
                {
                    if(notShe[j] == obj.groups[i])
                    {
                        await dB.query(`insert into schedules(week_day, time_begin, time_end, classroom, faculty, userid, subjectid, groupid)
                                values('${obj.day}', '${obj.begin}', '${obj.end}', '${obj.classroom}', '${obj.faculty}', ${verifed.Data.userId}, ${obj.subjectId}, ${obj.groups[i]})`)
                    }
                }
            }
            if(notShe.length == 0)
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: No -- Message: User tried to add schedule, but group or groups are alrady scheduled`)
                return { Success:false, AllSche:true }
            }
            else if(notShe.length == obj.groups.length)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly added schedule [${obj.day}, ${obj.begin}, ${obj.end}]`)
                return { Success:true, AllSche:false }
            }
            else
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: POST -- Success: Yes -- Message: User successfuly added schedule [${obj.day}, ${obj.begin}, ${obj.end}], but some groups are already scheduled`)
                return { Success:true, NotAllSche:true }
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
        throw Error("An error ocured while trying to add schedule")
    }
}

const updateSchedule = async(day:any, begin:any, end:any, obj:any, token:string) => {
    try
    {
        var notShe:any = []
        var SubGr:any = []
        var j = 0
        var z = 0;
        var sameSub = false
        const verifed = await auth(token)
        if(verifed.Success)
        {   
            
            const checkSche = await dB.query(`select * from schedules 
                    where userid = ${verifed.Data.userId} and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
            if(checkSche.rows[0].subjectid == obj.subjectid)
            {
                sameSub = true
            }
            if(checkSche.rowCount == 0)
            {   
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update nonexistent schedule`)
                return { Exist:false }
            }
            const checkSub = await dB.query(`Select * from subjects where id=${obj.subjectid}`)
            if(checkSub.rowCount == 0 )
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update schedule with nonexistent subject`)
                return { SubExist:false }
            }
            if(checkSub.rows[0].userid != verifed.Data.userId)
            {
                Log.error(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update schedule with not his subject`)
                return { SubPermission:false }
            }
            if(!sameSub)
            {
                for(let i = 0; i< checkSche.rowCount; i++)
                {

                    const checkScheduled = await dB.query(`select * from schedules where userid = ${verifed.Data.userId} and groupid=${checkSche.rows[i].groupid} and subjectid=${obj.subjectid}`)
                    if(checkScheduled.rowCount == 0)
                    {
                        notShe[j] = checkSche.rows[i].groupid
                        j++
                    }

                    const checkGrSub = await dB.query(`select * from groups_subjects where groupid=${checkSche.rows[i].groupid} and subjectid = ${obj.subjectid}`)
                    if(checkGrSub.rowCount > 0)
                    {
                        SubGr[z] = checkGrSub.rows[0].groupid
                        z++
                    }
                }
            }
            const checkTime = await dB.query(`select * from schedules where userid = ${verifed.Data.userId} 
                    and lower(week_day) like '${obj.day.toLowerCase()}' and time_begin between '${obj.begin}' and '${obj.end}'`)
            if(checkTime.rowCount > 0)
            {
                return { TimeCheck:false}
            }
            if(!sameSub)
            {
                for(let i = 0; i<checkSche.rowCount; i++)
                {
                    for(let j = 0; j < notShe.length; j++)
                    {
                        if(notShe[j] == checkSche.rows[i].groupid)
                        {

                            for(let z = 0; z<SubGr.length; z++)
                            {
                                if(SubGr[z] == checkSche.rows[i].groupid)
                                {
                                    await dB.query(`Update schedules set
                                        week_day = '${obj.day}',
                                        time_begin = '${obj.begin}',
                                        time_end = '${obj.end}',
                                        classroom = '${obj.classroom}',
                                        faculty = '${obj.faculty}',
                                        subjectid = ${obj.subjectid},
                                        groupid = ${checkSche.rows[i].groupid}
                                        where userid = ${verifed.Data.userId} and 
                                            lower(week_day) like '${day.toLowerCase()}' and 
                                            time_begin = '${begin}' and time_end ='${end}'`)
                                }
                            }
                        }
                    }
                }
            }
            else
            {   
                await dB.query(`Update schedules set
                        week_day = '${obj.day}',
                        time_begin = '${obj.begin}',
                        time_end = '${obj.end}',
                        classroom = '${obj.classroom}',
                        faculty = '${obj.faculty}'
                        where userid = ${verifed.Data.userId} and 
                            lower(week_day) like '${day.toLowerCase()}' and 
                            time_begin = '${begin}' and time_end ='${end}'`)
            }

            const left = await dB.query(`select * from schedules where userid = ${verifed.Data.userId} 
                and lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
            if(left.rowCount > 0)
            {
                for(let i = 0; i<left.rowCount; i++)
                {
                    await dB.query(`delete from schedules where
                         userid = ${verifed.Data.userId} and 
                         lower(week_day) like '${day.toLowerCase()}' and 
                         time_begin = '${begin}' and 
                         time_end ='${end}' and
                         groupid =${left.rows[i].groupid}`)
                }
            }
            if(sameSub)
            {
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly update schedule [${day}, ${begin}, ${end}]`)
                return { Success:true }
            }
            else
            {   
                if(notShe.length == checkSche.rowCount && SubGr.length == checkSche.rowCount)
                {   
                    Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User tried to update schedule [${day}, ${begin}, ${end}]`)
                    return { Success:true }
                }
                else if(notShe.length == 0 || SubGr.length == 0)
                {
                    Log.warn(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: No -- Message: User tried to update schedule, but some groups are already scheduled or subject are not valid for this groups`)
                    return { Success:false, Some:false }
                }
                else if(notShe.length != checkSche.rowCount || SubGr.length != checkSche.rowCount)
                {   
                    Log.info(`User_ID: ${verifed.Data.userId} -- Request: PUT -- Success: Yes -- Message: User successfuly update schedule [${day}, ${begin}, ${end}], but some groups detached`)
                    return { Success:true, Some:true }
                }
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
        throw Error('An error ocured while trying to get schedules')
    }
}

const deleteSchedule = async(day:any, begin:any, end:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
            if(result.rowCount > 0)
            {   
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted schedule [${day}, ${begin}, ${end}]`)
                await dB.query(`delete from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}' and time_begin = '${begin}' and time_end ='${end}'`)
                return { Success:true }
            }
            else
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent schedule`)
                return { Exist: false }
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
        throw Error('An error ocured while trying to get schedules')
    }
}

const deleteDaySchedules = async(day:any, token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}'`)
            if(result.rowCount > 0)
            {   
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted schedules from day: ${day}`)
                await dB.query(`delete from schedules where schedules.userid = ${verifed.Data.userId} and 
                        lower(week_day) like '${day.toLowerCase()}'`)
                return { Success:true }
            }
            else
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent day schedules`)
                return { Exist: false }
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
        throw Error('An error ocured while trying to get schedules')
    }
}

const deleteSchedules = async(token:string) => {
    try
    {
        const verifed = await auth(token)
        if(verifed.Success)
        {
            const result = await dB.query(`select * from schedules where schedules.userid = ${verifed.Data.userId}`)
            if(result.rowCount > 0)
            {   
                Log.info(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: Yes -- Message: User successfuly deleted all schedules`)
                await dB.query(`delete from schedules where schedules.userid = ${verifed.Data.userId}`)
                return { Success:true }
            }
            else
            {
                Log.warn(`User_ID: ${verifed.Data.userId} -- Request: DELETE -- Success: No -- Message: User tried to delete nonexistent schedules`)
                return { Exist: false }
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
        throw Error('An error ocured while trying to get schedules')
    }
}

export default{
    getSchedules,
    getSchedule,
    attachGroup,
    detachGroup,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    deleteDaySchedules,
    deleteSchedules
}