import { Response,Request,NextFunction } from "express"
import Log from "../middleware/logger"
import service from "../services/user.service"

const loginUser = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(!req.body.email || !req.body.password)
        {
            return res.status(400).json({Status:400, Message:'All fields are required'});
        }
        let results = await service.userLogin(req.body)
        
        if(results?.Success)
        {
            return res.status(200).json({Status:200, Token: results.AccesToken});
        }
        else{
            return res.status(400).json({Status:400, Message:results.Message});
        }
    }
    catch(e:any){
        return res.status(500).json({Status:500, Message:e.message})
    }
}

const registerUser = async (req:Request, res:Response, next:NextFunction) => {
    try{
        if(! req.body.email || !req.body.password || !req.body.confirmPassword )
        {
            res.status(400).json({Status:400, Message:'All fields are required'})
        }
        else{
            let results = await service.userRegister(req.body)
            if(results?.Success)
            {
                return res.status(201).json({Status:201, Message:results.Message});
            }
            else{
                return res.status(400).json({Status:400, Message:results.Message});
            }
        }
    }
    catch(e:any){
        return res.status(500).json({Status:500, Message:e.message})
    }
}

export default{
    loginUser,
    registerUser
}