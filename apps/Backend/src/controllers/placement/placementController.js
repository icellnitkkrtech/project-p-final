import PlacementService from "../../services/placementServices.js";
import mongoose from "mongoose";

export default class PlacementController {
    constructor() {
        this.placementService = new PlacementService();
    }

    async createPlacement(req, res) {
        try {
            const placementData = req.body;
            console.log("This is the request body");
            console.log(placementData);
            const response = await this.placementService.createPlacement(placementData);
            res.status(201).json({ data: response });
        } catch (error) {
            res.status(500).json({ message: "Error creating placement drive", error });
        }
    }

    async getAllPlacements(req, res) {
        try {
            const response = await this.placementService.getAllPlacements();
            let placementDrives = [];
            response.forEach((placementDrive) => {
                const { _id, companyDetails, jobProfile, status, assignedUser, createdBy, placementDrive_title, applicantStudents, selectedStudents, createdAt, updatedAt } = placementDrive;
                placementDrives.push({ _id, companyDetails, jobProfile, status, assignedUser, createdBy, placementDrive_title, applicantStudents, selectedStudents, createdAt, updatedAt });
            });
            res.status(200).json({ data: placementDrives });
        } catch (error) {
            res.status(500).json({ message: "Error fetching placements", error });
        }
    }

    async getPlacement(req, res) {
        try {
            const response = await this.placementService.getPlacementById(req.params.id);

            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }

            const { roundDetails, notificationLogos, selectedStudents, applicantStudents, ...filteredResponse } = response.toObject ? response.toObject() : response;

            res.status(200).json(filteredResponse);
        } catch (error) {
            console.error("Error fetching placement:", error);
            res.status(500).json({ message: "Error fetching placement", error: error.message });
        }
    }


    async updatePlacement(req, res) {
        try {
            const response = await this.placementService.updatePlacement(req.params.id, req.body);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error updating placement", error });
        }
    }

    async deletePlacement(req, res) {
        try {
            const response = await this.placementService.deletePlacement(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json({ message: "Placement drive deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting placement", error });
        }
    }

    async addRound(req, res) {
        try {
            const response = await this.placementService.addRound(req.params.id, req.body);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error adding round", error });
        }
    }

    async deleteRound(req, res) {
        try {
            const response = await this.placementService.deleteRound(req.params.id, req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json({ message: "Round deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting round", error });
        }
    }

    async getRound(req, res) {
        try {
            const response = await this.placementService.getRound(req.params.id, req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching round", error });
        }
    }

    async updateRound(req, res) {
        try {
            const { id, round_id } = req.params;
            const roundData = req.body;
            
            console.log("Updating round with ID:", round_id, "in placement:", id);
            console.log("Round data:", roundData);
            
            const result = await this.placementService.updateRound(id, round_id, roundData);
            
            return res.status(200).json({
                success: true,
                message: "Round updated successfully",
                data: result
            });
        } catch (error) {
            console.error("Error updating round:", error);
            return res.status(500).json({
                success: false,
                message: "Error updating round",
                error: error.message
            });
        }
    }

    async getApplicants(req, res) {
        try {
            const response = await this.placementService.getApplicants(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching applicants", error });
        }
    }

    async getSelectedStudents(req, res) {
        try {
            const response = await this.placementService.getSelectedStudents(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching selected students", error });
        }
    }

    async getApplicantsForRound(req, res) {
        try {
            const { id, round_id } = req.params;
            const response = await this.placementService.getApplicantsForRound(id, round_id);
            
            if (!response) {
                return res.status(404).json({ 
                    success: false,
                    message: "Round not found or no applicants available" 
                });
            }

            res.status(200).json({
                success: true,
                data: response,
                message: "Successfully retrieved applicants for round"
            });
        } catch (error) {
            console.error("Error in getApplicantsForRound controller:", error);
            res.status(500).json({ 
                success: false,
                message: "Error fetching applicants",
                error: error.message 
            });
        }
    }

    async getSelectedStudentsForRound(req, res) {
        try {
            const response = await this.placementService.getSelectedStudentsForRound(req.params.id, req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching selected students", error });
        }
    }

    async getAppearedStudentsForRound(req, res) {
        try {
            const response = await this.placementService.getAppearedStudentsForRound(req.params.id, req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching appeared students", error });
        }
    }
    
    
    async updateSelectedStudents(req, res) {
        try {
            const { id, round_id } = req.params;
            const { studentId } = req.body;

            const updatedDrive = await this.placementService.updateSelectedStudents(id, round_id, studentId);

            if (!updatedDrive) {
                return res.status(404).json({ message: "Failed to update selected students" });
            }

            const updatedRound = updatedDrive.roundDetails.rounds.find(
                r => r._id.toString() === round_id
            );

            res.status(200).json({
                success: true,
                message: "Student selected successfully",
                data: updatedRound
            });

        } catch (error) {
            res.status(500).json({ 
                message: "Error updating selected students",
                error: error.message 
            });
        }
    }
    async declareResults(req, res) {
        try {
            const response = await this.placementService.declareResults(req.params.id, req.params.round_id, req.body);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error declaring results", error });
        }
    }
    async getResults(req, res) {
        try {
            const response = await this.placementService.getResults(req.params.id, req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching results", error });
        }
    }
    async declareDriveResults(req, res) {
        try {
            const response = await this.placementService.declareDriveResults(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error declaring drive results", error });
        }
    }
    async getDriveResults(req, res) {
        try {
            const response = await this.placementService.getDriveResults(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching drive results", error });
        }
    }
    async getPlacementDriveByRoundId(req, res) {
        try {
            const response = await this.placementService.getPlacementDriveByRoundId(req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching placement drive", error });
        }
    }
    async addNotification(req, res) {
        try {
            const response = await this.placementService.addNotification(req.params.id, req.body);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error adding notification", error });
        }
    }
    async getNotification(req, res) {
        try {
            const response = await this.placementService.getNotifications(req.params.id, req.params.notification_id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching notifications", error });
        }
    }
    async getAllNotifications(req, res) {
        try {
            const response = await this.placementService.getAllNotifications(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching notifications", error });
        }
    }
    async deleteNotification(req, res) {
        try {
            const response = await this.placementService.deleteNotification(req.params.id, req.params.notification_id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json({ message: "Notification deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting notification", error });
        }
    }
    async getAllRounds(req, res) {
        try {
            const response = await this.placementService.getAllRounds(req.params.id);
            if (!response) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching rounds", error });
        }
    }
    async getDetailedRoundResults(req, res) {
        try {
            const { id, round_id } = req.params;
            
            // Get the placement drive
            const placement = await this.placementService.getPlacementById(id);
            
            if (!placement) {
                return res.status(404).json({ message: "Placement drive not found" });
            }
            
            // Find the specific round
            const round = placement.roundDetails.rounds.find(
                r => r._id.toString() === round_id
            );
            
            if (!round) {
                return res.status(404).json({ message: "Round not found" });
            }
            
            // Get the student IDs from the round
            const selectedStudentIds = round.selectedStudents || [];
            const appearedStudentIds = round.appearedStudents || [];
            
            console.log("Selected student IDs:", selectedStudentIds);
            console.log("Appeared student IDs:", appearedStudentIds);
            
            // Fetch student details from the database
            const Student = mongoose.model('Student');
            
            // Get selected students with details
            const selectedStudents = await Student.find({
                _id: { $in: selectedStudentIds }
            }).select('name rollNumber branch email');
            
            // Get appeared students with details
            const appearedStudents = await Student.find({
                _id: { $in: appearedStudentIds }
            }).select('name rollNumber branch email');
            
            console.log("Selected students from DB:", selectedStudents);
            console.log("Appeared students from DB:", appearedStudents);
            
            // Combine all the data
            const detailedResults = {
                ...round.toObject(),
                selectedStudents,
                appearedStudents,
                totalSelected: selectedStudents.length,
                totalAppeared: appearedStudents.length
            };
            
            res.status(200).json(detailedResults);
        } catch (error) {
            console.error("Error fetching detailed round results:", error);
            res.status(500).json({ 
                message: "Error fetching detailed round results", 
                error: error.message 
            });
        }
    }
    async getFinalSelectedStudents(req, res) {
        try {
            const { id } = req.params;
            
            const placement = await this.placementService.getPlacementById(id);
            if (!placement) {
                return res.status(404).json({
                    success: false,
                    message: "Placement not found"
                });
            }
            
            // Find the last round with declared results
            let selectedStudents = [];
            if (placement.roundDetails && placement.roundDetails.rounds) {
                const completedRounds = placement.roundDetails.rounds.filter(
                    round => round.roundStatus === 'completed' && round.resultMessage
                );
                
                if (completedRounds.length > 0) {
                    // Get the last completed round
                    const lastRound = completedRounds[completedRounds.length - 1];
                    
                    // Get selected students from this round
                    if (lastRound.selectedStudents && lastRound.selectedStudents.length > 0) {
                        selectedStudents = lastRound.selectedStudents;
                    }
                }
            }
            
            return res.status(200).json({
                success: true,
                message: "Final selected students retrieved successfully",
                data: selectedStudents
            });
        } catch (error) {
            console.error("Error getting final selected students:", error);
            return res.status(500).json({
                success: false,
                message: "Error getting final selected students",
                error: error.message
            });
        }
    }
    async getOfferLetters(req, res) {
        try {
            const { id } = req.params;
            
            const offerLetters = await this.placementService.getOfferLetters(id);
            
            return res.status(200).json({
                success: true,
                message: "Offer letters retrieved successfully",
                data: offerLetters
            });
        } catch (error) {
            console.error("Error getting offer letters:", error);
            return res.status(500).json({
                success: false,
                message: "Error getting offer letters",
                error: error.message
            });
        }
    }
    async sendOfferLetters(req, res) {
        try {
            const { id } = req.params;
            const { studentIds, content, expiryDate } = req.body;
            
            console.log("Received offer letter request:", {
                placementId: id,
                studentIds,
                contentLength: content ? content.length : 0,
                expiryDate
            });
            
            if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
                console.error("Invalid studentIds:", studentIds);
                return res.status(400).json({
                    success: false,
                    message: "Student IDs are required and must be a non-empty array"
                });
            }
            
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Offer letter content is required"
                });
            }
            
            try {
                const result = await this.placementService.sendOfferLetters(
                    id, 
                    studentIds, 
                    content, 
                    expiryDate
                );
                
                return res.status(200).json({
                    success: true,
                    message: "Offer letters sent successfully",
                    data: result
                });
            } catch (serviceError) {
                console.error("Service error:", serviceError);
                return res.status(500).json({
                    success: false,
                    message: "Error in placement service",
                    error: serviceError.message
                });
            }
        } catch (error) {
            console.error("Error sending offer letters:", error);
            return res.status(500).json({
                success: false,
                message: "Error sending offer letters",
                error: error.message
            });
        }
    }
    async updateOfferStatus(req, res) {
        try {
            const { id, offer_id } = req.params;
            const { status } = req.body;
            
            if (!status || !['accepted', 'rejected'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid status (accepted/rejected) is required"
                });
            }
            
            const result = await this.placementService.updateOfferStatus(id, offer_id, status);
            
            return res.status(200).json({
                success: true,
                message: `Offer ${status} successfully`,
                data: result
            });
        } catch (error) {
            console.error("Error updating offer status:", error);
            return res.status(500).json({
                success: false,
                message: "Error updating offer status",
                error: error.message
            });
        }
    }

    async createStudentPlacement(req, res) {
        try {
            const response = await this.placementServices.createStudentPlacement(req.body);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            console.error('Controller Error:', error);
            return res.status(500).json(
                new apiResponse(500, null, error.message)
            );
        }
    }
}
