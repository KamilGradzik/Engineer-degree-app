import dB from '../middleware/db-connection'
import accessToken from '../middleware/generateToken'
import bcrypt from 'bcrypt'
import Log from '../middleware/logger'

const userLogin = async (obj:any) => {
    try{
        const email = obj.email.toLowerCase();
        const password = obj.password;
        const user = await dB.query(`select id,email,password from users where email like '${email}'`)
        if( user.rowCount > 0 ) 
        {   
            if(await bcrypt.compareSync(password,user.rows[0].password))
            {
                const Token = accessToken(user.rows[0].id,user.rows[0].password)
                Log.info(`User[${email}] logged into application`)
                return { Success:true, Message:'Login success.', AccesToken: Token}    
            }
            else{
                Log.warn(`Login attempt with email[${email}] and password[${password}]`)
                return { Success:false, Message:'Email or password incorrect.'}
            }
        }
        else{
            Log.warn(`Login attempt with email[${email}] and password[${password}]`)
            return { Success:false, Message:'Email or password incorrect or user cannot be found' }
        }
    }
    catch(err:any)
    {
        Log.error(err.message)
    }

}

const userRegister = async (obj:any) => {
    try{
        let regexpEmail :RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        let regexpPassword : RegExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        const user = await dB.query(`select id,email,password from users where email like '${obj.email.toLowerCase()}'`)

        if( user.rowCount > 0 )
        {
            return { Success:false, Message:'User already exists. Please login' } 
        } 
            
        const email = obj.email;

        if(!regexpEmail.test(email)) 
        {  
            Log.warn(`Register attempt with wrong email form`)
            return { Success:false, Message:'Invalid email from. Please correct' }
        } 

        const password = obj.password;
        const confirmPassword = obj.confirmPassword;

        if( password != confirmPassword)
        {
            return { Success:false, Message:'Passwords not match. Please correct' }
        }
        
        if(!regexpPassword.test(password))
        {
            Log.warn(`Register attempt with wrong password form`)
            return { Success:false, Message:'Password must be at least 8 characters long, have atleast one number, one upper case letter, one lower case letter and one special sign'}
        }
        const genSalt = await bcrypt.genSalt(12)
        const hashPassword = bcrypt.hashSync(password,genSalt)

        let newUser = {
            email:email,
            password: hashPassword
        }
        await dB.query(`INSERT INTO USERS(email,password) VALUES('${newUser.email.toLowerCase()}', '${newUser.password}')`)
        Log.info(`New user have been registered with email '${email}'`)
        return { Success:true, Message:'Account registration success. You can now login.'}
    }
    catch(e:any)
    {
        Log.error(e.message)
        throw Error(e)
    }
}

export default {
    userLogin,
    userRegister
}