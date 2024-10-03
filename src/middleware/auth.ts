import { NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import Log from './logger'


const auth = async (token:string):Promise<any> => {
    try{
        const verifed = jwt.verify(token,process.env.AUTH_SECRET_TOKEN, (err:any, data:any) =>{
            if(err){
                return { Success:false, Message:'Session timed out. Please login again.'}
            }
            else{
                const userData = {
                    userId:data.userId,
                    username:data.userName,
                }
                return { Success:true, Data:userData}
            }
        })
        return verifed
    }
    catch(e:any){
        Log.error(e.message)
        throw Error(e.message)
    }
}

export default auth