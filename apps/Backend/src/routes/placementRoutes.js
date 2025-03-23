import { Router } from "express";
import PlacementController from "../controllers/placement/placementController.js";
import PlacementModel from "../models/placementModel.js";
import PlacementService from "../services/placementServices.js";

const placementRoutes = Router();

const placementModel = new PlacementModel();
const placementService = new PlacementService(placementModel)
const placementController = new PlacementController(placementService);

//1
placementRoutes.post("/create-placement-drive", (req, res) => {
    placementController.createPlacement(req, res);
});

//2
placementRoutes.get("/all", (req, res) => {
    placementController.getAllPlacements(req, res);
});
//3
placementRoutes.get("/:id/getone", (req, res) => {
    placementController.getPlacement(req, res);
});

placementRoutes.put("/:id", (req, res) => {
    placementController.updatePlacement(req, res);
});

placementRoutes.delete("/:id", (req, res) => {
    placementController.deletePlacement(req, res);
});
//4
//add round
placementRoutes.post("/:id/add-round", (req, res) => {
    placementController.addRound(req, res);
});
//5
//delete round
placementRoutes.delete("/:id/rounds/:round_id/delete-round", (req, res) => {
    placementController.deleteRound(req, res);
});
//6
// get round details
placementRoutes.get("/:id/rounds/:round_id/getone", (req, res) => {
    placementController.getRound(req, res);
});
//7
// update round details
placementRoutes.put("/:id/rounds/:round_id/update-round", (req, res) => {
    placementController.updateRound(req, res);
});
//8
// get applicant students in placement drive
placementRoutes.get("/:id/applicant-students", (req, res) => {
    placementController.getApplicants(req, res);
});
//9
// get selected students
placementRoutes.get("/:id/selected-students", (req, res) => {
    placementController.getSelectedStudents(req, res);
});
//10
// get applicant students for a round
placementRoutes.get("/:id/rounds/:round_id/applicant-students", (req, res) => {
    placementController.getApplicantsForRound(req, res);
});
//11
// get selected students for a round
placementRoutes.get("/:id/rounds/:round_id/selected-students", (req, res) => {
    placementController.getSelectedStudentsForRound(req, res);
});
//12
// get appeared students for a round
placementRoutes.get("/:id/rounds/:round_id/appeared-students", (req, res) => {
    placementController.getAppearedStudentsForRound(req, res);
});
//13
// update selected students in rounds
placementRoutes.put("/:id/rounds/:round_id/update-selected-students", (req, res) => {
    placementController.updateSelectedStudents(req, res);
});
//14
// declare round results and update status
placementRoutes.put("/:id/rounds/:round_id/declare-results", (req, res) => {
    placementController.declareResults(req, res);
});
//15
// get results of a round
placementRoutes.get("/:id/rounds/:round_id/get-results", (req, res) => {
    placementController.getResults(req, res);
});
//16
// declare placement drive results and update status
placementRoutes.post("/:id/declare-drive-results", (req, res) => {
    placementController.declareDriveResults(req, res);
});
//17
// get placement drive results
placementRoutes.get("/:id/get-drive-results", (req, res) => {
    placementController.getDriveResults(req, res);
});
//-----------done----------------
//18
// add new notification
placementRoutes.post("/:id/notifications/add-new", (req, res) => {
    placementController.addNotification(req, res);
});
//19
// see one notification
placementRoutes.get("/:id/notifications/:notification_id/get-one", (req, res) => {
    placementController.getNotification(req, res);
});
//20
// get all notification
placementRoutes.get("/:id/notifications/all", (req, res) => {
    placementController.getAllNotifications(req, res);
});
// 21
// deleting notification
placementRoutes.delete("/:id/notifications/:notification_id/delete", (req, res) => {
    placementController.deleteNotification(req, res);
});
// 22
// getting all rounds
placementRoutes.get("/:id/rounds/all", (req, res) => {
    placementController.getAllRounds(req, res);
});

placementRoutes.put("/:id/rounds/:roundId/update-status", (req, res) => {
    placementController.updateRoundStatus(req, res);
});

export default placementRoutes;
