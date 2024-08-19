import bcrypt from 'bcryptjs';


export const hashedPasswordFunction = async(password : string) : Promise<{hashedPassword : string}> =>{
 const hashedPassword = await bcrypt.hash(password , 8);
 return { hashedPassword };
};

export const hashedPasswordCompare = async(password : string , hashedPassword : string) : Promise<boolean> =>{
    return await bcrypt.compare(password , hashedPassword);
}