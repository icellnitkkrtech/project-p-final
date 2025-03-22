import { Router } from "express";
import JNFModel from "../models/jnfModel.js";
import JNFServices from "../services/jnfServices.js";
import upload from '../config/multerConfig.js';
import { handleFileUploadError } from '../middlewares/fileUploadMiddleware.js';
import JNFController from "../controllers/admin/jnfController.js";
import authVerify from "../middlewares/auth.middlewares.js";

const jnfRouter = Router();
const jnfModel = new JNFModel();
const jnfServices = new JNFServices(jnfModel);

const jnfController = new JNFController(jnfServices);


//update status of the jnf
jnfRouter.put('/update/:id', 
  upload.single('jobDescriptionFile'), 
  handleFileUploadError,
  (req, res) => jnfController.updateJNF(req, res)
);//done
 
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
jnfRouter.post('/create', 
  upload.single('jobDescriptionFile'), 
  handleFileUploadError,
  (req, res) => jnfController.createJNF(req, res)
);//done
//update getAvailableStatuses
jnfRouter.get("/getAvailableStatuses", (req, res) => {  
  jnfController.getAvailableStatuses(req, res);
});//done
//get user who is pcc
jnfRouter.get("/getPCC", (req, res) => {
  jnfController.getPCC(req, res);
});//done
// get jnf assignment 
jnfRouter.get("/getJnfAssignment/:id", (req, res) => {
  jnfController.getJnfAssignments(req, res);
});//done


export default jnfRouter;
