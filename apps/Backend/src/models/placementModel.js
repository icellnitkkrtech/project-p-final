import placementDrive from "../schema/placement/placementSchema.js";

export default class PlacementModel {
    placement = placementDrive;

    async getAllPlacements() {
        console.log("Placement Model: getAllPlacements called");
        try {
            return await this.placement.find({}).populate("createdBy");
        } catch (error) {
            console.error("Error in getAllPlacements:", error);
            throw error;
        }
    }

    async createPlacement(placementData) {
        console.log("Placement Model: createPlacement called");
        try {
            return await this.placement.create(placementData);
        } catch (error) {
            console.error("Error in createPlacement:", error);
            throw error;
        }
    }

    async findPlacementById(id) {
        console.log("Placement Model: findPlacementById called");
        try {
            const placement = await this.placement.findById(id).populate("createdBy");
            return placement || null;
        } catch (error) {
            console.error("Error in findPlacementById:", error);
            throw error;
        }
    }

    async updatePlacement(id, updates) {
        console.log("Placement Model: updatePlacement called");
        try {
            return await this.placement.findByIdAndUpdate(id, updates, { new: true });
        } catch (error) {
            console.error("Error in updatePlacement:", error);
            throw error;
        }
    }

    async deletePlacement(id) {
        console.log("Placement Model: deletePlacement called");
        try {
            return await this.placement.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error in deletePlacement:", error);
            throw error;
        }
    }

    async addRound(id, roundData) {
        console.log("Placement Model: addRound called");
        try {
            return await this.placement.findByIdAndUpdate(id, { $push: { "roundDetails.rounds": roundData } }, { new: true });
        } catch (error) {
            console.error("Error in addRound:", error);
            throw error;
        }
    }

    async deleteRound(id, roundId) {
        console.log("Placement Model: deleteRound called");
        try {
            return await this.placement.findByIdAndUpdate(id, { $pull: { rounds: { _id: roundId } } }, { new: true });
        } catch (error) {
            console.error("Error in deleteRound:", error);
            throw error;
        }
    }
    async getRound(id, roundId) {
        console.log("Placement Model: getRound called");
        try {
            return await this.placement.findOne({ _id: id, "roundDetails.rounds._id": roundId }, { "roundDetails.rounds.$": 1 });
        } catch (error) {
            console.error("Error in getRound:", error);
            throw error;
        }
    }
    
    async updateRound(id, roundId, updates) {
        console.log("Placement Model: updateRound called");
        try {
            return await this.placement.findOneAndUpdate(
                { _id: id, "roundDetails.rounds._id": roundId },
                { $set: { "roundDetails.rounds.$": updates } },
                { new: true }
            );
        } catch (error) {
            console.error("Error in updateRound:", error);
            throw error;
        }
    }
    async getApplicants(id) {
        console.log("Placement Model: getApplicants called");
        try {
            return await this.placement.findById(id, { applicantStudents: 1 }).populate("applicantStudents");
        } catch (error) {
            console.error("Error in getApplicants:", error);
            throw error;
        }
    }

    async getSelectedStudents(id) {
        console.log("Placement Model: getSelectedStudents called");
        try {
            return await this.placement.findById(id, { selectedStudents: 1 }).populate("selectedStudents");
        } catch (error) {
            console.error("Error in getSelectedStudents:", error);
            throw error;
        }
    }

    async getApplicantsForRound(id, roundId) {
        console.log("Placement Model: getApplicantsForRound called");
        try {
            // Changed this.placementDrive to this.placement
            const result = await this.placement.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$": 1 }  // Modified projection to get entire round
            ).populate({
                path: "roundDetails.rounds.applicantStudents",
                model: "Student",
                select: "name email registrationNumber branch" // Add fields you want to retrieve
            });

            if (!result) {
                throw new Error('Round not found');
            }

            // Extract applicant students from the matched round
            const round = result.roundDetails.rounds[0];
            return {
                roundId: round._id,
                roundName: round.roundName,
                applicantStudents: round.applicantStudents
            };
        } catch (error) {
            console.error("Error in getApplicantsForRound:", error);
            throw error;
        }
    }

    async getSelectedStudentsForRound(id, roundId) {
        console.log("Placement Model: getSelectedStudentsForRound called");
        try {
            return await this.placementDrive.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$.selectedStudents": 1 }
            ).populate({ path: "roundDetails.rounds.selectedStudents", model: "Student" });
        } catch (error) {
            console.error("Error in getSelectedStudentsForRound:", error);
            throw error;
        }
    }

    async getAppearedStudentsForRound(id, roundId) {
        console.log("Placement Model: getApperaredStudentsForRound called");
        try {
            return await this.placementDrive.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$.appearedStudents": 1 }
            ).populate({ path: "roundDetails.rounds.appearedStudents", model: "Student" });
        } catch (error) {
            console.error("Error in getApperaredStudentsForRound:", error);
            throw error;
        }
    }

    async getPlacementDriveByRoundId(roundId) {
        console.log("Placement Model: getPlacementDriveByRoundId called");
        try {
            return await this.placement.findOne({ "roundDetails.rounds._id": roundId });
        } catch (error) {
            console.error("Error in getPlacementDriveByRoundId:", error);
            throw error;
        }
    }

    async updateSelectedStudents(id, roundId, studentId) {
        console.log("Placement Model: updateSelectedStudents called");
        try {
            console.log(studentId);
            return await this.placement.findOneAndUpdate(
                { _id: id, "roundDetails.rounds._id": roundId },
                { $push: { "roundDetails.rounds.$.selectedStudents": studentId } },
                { new: true }
            );
        } catch (error) {
            console.error("Error in updateSelectedStudents:", error);
            throw error;
        }
    }
    async declareResult(id, roundId, resultData) {
        console.log("Placement Model: declareResult called");
        try {
            const {resultMessage, resultDescription} = resultData;
            return await this.placement.findOneAndUpdate(
                { _id: id, "roundDetails.rounds._id": roundId },
                { $set: { "roundDetails.rounds.$.resultMessage": resultMessage, "roundDetails.rounds.$.resultDescription": resultDescription } },
                { new: true }
            );
        } catch (error) {
            console.error("Error in declareResult:", error);
            throw error;
        }
    }
    async getResults(id, roundId) {
        console.log("Placement Model: getResults called");
        try {
            return await this.placement.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$.resultMessage": 1, "roundDetails.rounds.$.resultDescription": 1 }
            );
        } catch (error) {
            console.error("Error in getResults:", error);
            throw error;
        }
    }
    async declareDriveResults(id, resultData) {
        console.log("Placement Model: declareDriveResults called");
        try {
            return await this.placement.findByIdAndUpdate(id, { $set: { resultMessage: resultData.message, resultDescription: resultData.description } }, { new: true });
        } catch (error) {
            console.error("Error in declareDriveResults:", error);
            throw error;
        }
    }
    async getDriveResults(id) {
        console.log("Placement Model: getDriveResults called");
        try {
            return await this.placement.findById(id, { resultMessage: 1, resultDescription: 1 });
        } catch (error) {
            console.error("Error in getDriveResults:", error);
            throw error;
        }
    }
    async addNotification(id, notificationData) {
        console.log("Placement Model: addNotification called");
        try {
            return await this.placement.findByIdAndUpdate(id, { $push: { notificationLogs: notificationData } }, { new: true });
        } catch (error) {
            console.error("Error in addNotification:", error);
            throw error;
        }
    }
    async getNotifications(id,notification_id) {
        console.log("Placement Model: getNotifications called");
        try {
            return await this.placement.findById(id, { notificationLogs: 1 }, { "notificationLogs.$": notification_id });
        } catch (error) {
            console.error("Error in getNotifications:", error);
            throw error;
        }
    }
    async getAllNotifications(id) {
        console.log("Placement Model: getAllNotifications called");
        try {
            return await this.placement.findById(id, { notificationLogs: 1 });
        } catch (error) {
            console.error("Error in getAllNotifications:", error);
            throw error;
        }
    }
    async deleteNotification(id, notificationId) {
        console.log("Placement Model: deleteNotification called");
        try {
            return await this.placement.findByIdAndUpdate(id, { $pull: { notificationLogs: { _id: notificationId } } }, { new: true });
        } catch (error) {
            console.error("Error in deleteNotification:", error);
            throw error;
        }
    }
    async getAllRounds(id) {
        console.log("Placement Model: getAllRounds called");
        try {
            return await this.placement.findById(id, { "roundDetails.rounds": 1 });
        } catch (error) {
            console.error("Error in getAllRounds:", error);
            throw error;
        }
    }
}
