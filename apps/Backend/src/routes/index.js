import { Router } from 'express';
import userRouter from './userRoutes.js';
import adminRouter from './adminRoutes.js';
import eventRouter from './eventRoutes.js';
import companyRouter from './companyRoutes.js';
import studentRouter from './studentRoutes.js';
import jobRoutes from './jobRoutes.js';
import applicationRoutes from "./applicationRoutes.js"
import dashboardRouter from './dashboardRoutes.js';
import placementRoutes from './placementRoutes.js';
import jnfRouter from './jnfRoutes.js';
import auditRouter from './auditRoutes.js';
import reportRouter from './reportRoutes.js';
import placementSessionRoutes from './placementSessionRoutes.js';
// import auditRoutes from './auditRoutes.js';
import placementPolicyRoutes from './placementPolicyRoutes.js';
import queryRouter from './queryRoutes.js';
const router = Router();

router.get('/', (req, res) => {
    res.send('Api is working');
});

router.use("/user", userRouter); // dev 
router.use("/admin", adminRouter); //uday
router.use("/event", eventRouter); //shivam
router.use("/company", companyRouter); //akansha
router.use("/application", applicationRoutes);
router.use("/student", studentRouter); //naveen
router.use("/job", jobRoutes);//akarshit
router.use("/dashboard", dashboardRouter);
router.use("/jnf", jnfRouter);
router.use("/placement", placementRoutes);
router.use("/audit", auditRouter);
router.use("/reports", reportRouter);
router.use("/placement-sessions", placementSessionRoutes);
router.use("/placement-policy", placementPolicyRoutes);
router.use("/query", queryRouter);
export default router;