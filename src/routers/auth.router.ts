import { Router } from "express";
import { keepLogin, signIn, signUp } from "../controllers/auth.controller";

const route: Router = Router();

route.post("/signup", signUp);
route.post("/signin", signIn);
route.get("/keep", keepLogin);

export default route;
