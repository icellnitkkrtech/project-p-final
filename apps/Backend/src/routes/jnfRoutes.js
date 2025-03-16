import { Router } from "express";
import JNFModel from "../models/jnfModel.js";
import JNFServices from "../services/jnfServices.js";
import JNFController from "../controllers/admin/jnfController.js";
import authVerify from "../middlewares/auth.middlewares.js";

const jnfRouter = Router();
const jnfModel = new JNFModel();
const jnfServices = new JNFServices(jnfModel);

const jnfController = new JNFController(jnfServices);


//update status of the jnf
jnfRouter.put("/update/:id", (req, res) => {
  jnfController.updateJNF(req, res);
});//done
 
// view jnf 
jnfRouter.get("/getone/:id", (req, res) => {
  jnfController.getJNFById(req, res);
});//done

//assigned to pcc
jnfRouter.put("/assign/:id", (req, res) => {
  jnfController.assignJNF(req, res);
});//done

//get all jnf

jnfRouter.get("/all", (req, res) => {
  jnfController.getAllJNFs(req, res);
});//done

//delete jnf
jnfRouter.delete("/delete/:id", (req, res) => {
  jnfController.deleteJNF(req, res);
});//done
//create jnf
jnfRouter.post("/create", (req, res) => {
  jnfController.createJNF(req, res);
});//done
//update specially status of the jnf

export default jnfRouter;