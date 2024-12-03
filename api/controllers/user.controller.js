import prisma from "../lib/prisma.js";
import bcrypt from"bcrypt"
export const getUsers=async(req,res)=>
{
    
    try{
        const users=await prisma.user.findMany();
        res.status(200).json(users);
    }catch(err)
    {
        console.log(err)
        res.status(500).json({message:"failed to get users"})
    }
}
export const getUser=async(req,res)=>
    {
        const id=req.params.id;
        try{
            const user=await prisma.user.findUnique({
                where:{
                    id
                },
            })
            res.status(200).json(user);
        }catch(err)
        {
            console.log(err)
            res.status(500).json({message:"failed to get user"})
        }
    }

export const updateUser=async(req,res)=>
        {
            const id=req.params.id;
            const tokenUserId=req.userId;
const {password,avatar,...inputs}=req.body;
            if(id!==tokenUserId)
            {
                return res.status(403).json({message:"Not authrorized"});
            }
            let updatedpassword=null;
            try{
                if(password)
                {
                    updatedpassword=await bcrypt.hash(password,10)
                }
        const updatedUser=await prisma.user.update({
            where:{id},
            data:{
                ...inputs,
                ...(updatedpassword &&{password:updatedpassword}),
                 ...(avatar &&{avatar}),
            },
        })
        res.status(200).json(updatedUser)
            }catch(err)
            {
                console.log(err)
                res.status(500).json({message:"failed to update users"})
            }
}
export const deleteUser=async(req,res)=>
    {
        const id=req.params.id;
        const tokenUserId=req.userId;

        if(id!==tokenUserId)
        {
            return res.status(403).json({message:"Not authrorized"});
        }
        try{
            await prisma.user.delete({
                where:{id}
            })
            res.status(200).json({message:"deleted"});
        }catch(err)
        {
            console.log(err)
            res.status(500).json({message:"failed to delete user"})
        }
    }