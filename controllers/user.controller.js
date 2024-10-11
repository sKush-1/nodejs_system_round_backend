import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userSchema = z.object({
      firstName: z.string().min(3).max(20),
      lastName: z.string().min(3).max(20),
      email: z.string().min(5).max(40),
      password: z.string().min(8).max(40),
    });

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    userSchema.parse({ firstName, lastName, email, password });

    if (findUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: "User created",
      user,
    });
  } catch (error) {
    console.log(error);

    jwt.sign();
    return res.status(500).json({
      message: error.message || "User not created",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userLoginSchema = z.object({
      email: z.string().min(5).max(40),
      password: z.string().min(8).max(40),
    });

    userLoginSchema.parse({ email, password });

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const isPassword = await bcrypt.compare(password, findUser.password);

    if (!isPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: findUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    req.user = findUser.id;

    return res.status(200).json({
      message: "User logged in Successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "User failed to login",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.query;

    const findUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!findUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        id: findUser.id,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email: findUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: error.message || "User not found",
    });
  }
};

export const logout = async (req, res) => {
  req.user = "";

  return res.status(200).json({
    message: "User logged out",
  });
};

export const forgotPassword = async(req,res) => {
    const {email} = req.body;

    const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "300s",
      });

    const saveToken = await prisma.token.create({
        data: {
            forgotToken:token,
            email: user.email
        }
    })


   const sentEmail =  await sendEmail(user.email,"Forgot password",`<a href="${process.env.BaseUrl}/change-password/${token}></a>`);
   res.status(200).json({
    message: "If the user exists we will send you a mail"
   })

}

export const resetPassword = async(req,res) => {
    try {
        const {forgotToken,newPassword,confirmPassword} = req.body;
    
        const resetPasswordSchema = z.object({
            token: z.string(),
            newPassword: z.string().min(8).max(40),
            confirmPassword: z.string().min(8).max(40),
    
        })
    
        const findToken = await prisma.token.findUnique({
            where: {
              forgotToken,
            },
          });
    
    
          const isVerifiedToken = jwt.verify(findToken.forgotToken,process.env.JWT_SECRET);
          
    
          if(!findToken || !isVerifiedToken  || newPassword !== confirmPassword){
            return res.status(404).json({
                message: "Invalid token"
            })
          }

    
          const user = await prisma.user.findUnique({
            where: {
              email: findToken.forgotToken,
            },
          });
    
    
          const hashedPassword = await bcrypt.hash(newPassword,10);
    
          const updateUser = await prisma.user.update({
            where: {
              email: findToken.email,
            },
            data: {
              password: hashedPassword,
            },
          })
    
    
        return res.status(200).json({
            message: "Password reset successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Password failed to reset"
        })
    }
}