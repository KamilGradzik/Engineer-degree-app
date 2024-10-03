import jwt from 'jsonwebtoken'
const generateAccesToken = (userId:number, userName:string):string => {
    return jwt.sign({userId,userName},process.env.AUTH_SECRET_TOKEN,{expiresIn:'4h'})
}

export default generateAccesToken