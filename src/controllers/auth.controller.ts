import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hashPassword";
import { compareSync } from "bcrypt";

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

    res.status(200).send({
      success: true,
      result: {
        id: account.id,
        username: account.username,
        email: account.email,
        role: account.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const keepLogin = async (req: Request, res: Response) => {
  try {
    const account = await prisma.accounts.findUnique({
      where: {
        id: parseInt(req.params.id),
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
