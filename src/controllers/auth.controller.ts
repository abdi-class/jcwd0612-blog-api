import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compareSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  try {
    await prisma.accounts.create({
      data: { ...req.body, password: await hashPassword(req.body.password) },
    });

    res.status(200).send({
      success: true,
      message: "Registration success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const account = await prisma.accounts.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!account) {
      throw { success: false, message: "Account is not exist" };
    }
    // Check password
    const comparePass = compareSync(req.body.password, account.password);
    if (!comparePass) {
      throw { success: false, message: "Password is wrong" };
    }

    // Generate token
    const token = sign(
      { id: account.id, role: account.role },
      process.env.TOKEN_KEY || "secret"
    );

    res.status(200).send({
      success: true,
      result: {
        username: account.username,
        email: account.email,
        role: account.role,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const keepLogin = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      throw { success: false, message: "Token is not exist" };
    }
    const checkToken: any = verify(token, process.env.TOKEN_KEY || "secret");
    console.log(checkToken);
    const account = await prisma.accounts.findUnique({
      where: {
        id: parseInt(checkToken.id),
      },
      omit: {
        password: true,
      },
    });

    res.status(200).send(account);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
