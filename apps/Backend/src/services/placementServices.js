import PlacementModel from "../models/placementModel.js";
import apiResponse from "../utils/apiResponse.js";
export default class PlacementService {
    constructor() {
        this.placementModel = new PlacementModel();
    }
    async createPlacement(placementData) {
        try {
            return await this.placementModel.createPlacement(placementData);
        } catch (error) {
            throw new Error("Error creating placement drive: " + error.message);
        }
    }

    async getAllPlacements() {
        try {
            return await this.placementModel.getAllPlacements();
        } catch (error) {
            throw new Error("Error fetching placements: " + error.message);
        }
    }

    async getPlacementById(id) {
        try {
            return await this.placementModel.findPlacementById(id);
        } catch (error) {
            throw new Error("Error fetching placement: " + error.message);
        }
    }

    async updatePlacement(id, updates) {
        try {
            return await this.placementModel.updatePlacement(id, updates, { new: true });
        } catch (error) {
            throw new Error("Error updating placement: " + error.message);
        }
    }

    async deletePlacement(id) {
        try {
            return await this.placementModel.deletePlacement(id);
        } catch (error) {
            throw new Error("Error deleting placement: " + error.message);
        }
    }
    async addRound(id, roundData) {
        try {
            return await this.placementModel.addRound(id, roundData);
        } catch (error) {
            throw new Error("Error adding round: " + error.message);
        }
    }
    async deleteRound(id, roundId) {
        try {
            return await this.placementModel.deleteRound(id, roundId);
        } catch (error) {
            throw new Error("Error deleting round: " + error.message);
        }
    }
    async getRound(id, roundId) {
        try {
            return await this.placementModel.getRound(id, roundId);
        } catch (error) {
            throw new Error("Error fetching round: " + error.message);
        }
    }
    async updateRound(id, roundId, updates) {
        try {
            return await this.placementModel.updateRound(id, roundId, updates);
        } catch (error) {
            throw new Error("Error updating round: " + error.message);
        }
    }
    async getApplicants(id) {
        try {
            return await this.placementModel.getApplicants(id);
        } catch (error) {
            throw new Error("Error fetching applicants: " + error.message);
        }
    }
    async getSelectedStudents(id) {
        try {
            return await this.placementModel.getSelectedStudents(id);
        } catch (error) {
            throw new Error("Error fetching selected students: " + error.message);
        }
    }
    async getApplicantsForRound(id, roundId) {
        try {
            const result = await this.placementModel.getApplicantsForRound(id, roundId);
            if (!result) {
                return new apiResponse(404, null, "Round not found or no applicants available");
            }
            return new apiResponse(200, result, "Successfully retrieved applicants");
        } catch (error) {
            console.error("Error in getApplicantsForRound service:", error);
            return new apiResponse(500, null, error.message);
        }
    }
    async getSelectedStudentsForRound(id, roundId) {
        try {
            return await this.placementModel.getSelectedStudentsForRound(id, roundId);
        } catch (error) {
            throw new Error("Error selecting student: " + error.message);
        }
    }
    async getAppearedStudentsForRound(id, roundId) {
        try {
            return await this.placementModel.getAppearedStudentsForRound(id, roundId);
        } catch (error) {
            throw new Error("Error fetching appeared students: " + error.message);
        }
    }
    async updateSelectedStudents(id, roundId, studentId) {
        try {
            return await this.placementModel.updateSelectedStudents(id, roundId, studentId);
        } catch (error) {
            throw new Error("Error updating selected students: " + error.message);
        }
    }
    async declareResults(id, roundId, results) {
        try {
            return await this.placementModel.declareResult(id, roundId, results);
        } catch (error) {
            throw new Error("Error declaring results: " + error.message);
        }
    }
    async getResults(id, roundId) {
        try {
            return await this.placementModel.getResults(id, roundId);
        } catch (error) {
            throw new Error("Error fetching results: " + error.message);
        }
    }
    async declareDriveResults(id){
        try {
            return await this.placementModel.declareDriveResults(id);
        } catch (error) {
            throw new Error("Error declaring drive results: " + error.message);
        }
    }
    async getDriveResults(id){
        try {
            return await this.placementModel.getDriveResults(id);
        } catch (error) {
            throw new Error("Error fetching drive results: " + error.message);
        }
    }
    async addNotification(id, notification){
        try {
            return await this.placementModel.addNotification(id, notification);
        } catch (error) {
            throw new Error("Error adding notification: " + error.message);
        }
    }
    async getNotifications(id,notification_id){
        try {
            return await this.placementModel.getNotifications(id,notification_id);
        } catch (error) {
            throw new Error("Error fetching notifications: " + error.message);
        }
    }
    async getAllNotifications(id){
        try {
            return await this.placementModel.getAllNotifications(id);
        } catch (error) {
            throw new Error("Error fetching notifications: " + error.message);
        }
    }
    async deleteNotification(id, notification_id){
        try {
            return await this.placementModel.deleteNotification(id, notification_id);
        } catch (error) {
            throw new Error("Error deleting notification: " + error.message);
        }
    }
    async getAllRounds(id) {
        try {
            return await this.placementModel.getAllRounds(id);
        } catch (error) {
            throw new Error("Error fetching rounds: " + error.message);
        }
    }
    async sendOfferLetters(placementId, studentIds, content, expiryDate) {
        try {
            return await this.placementModel.sendOfferLetters(
                placementId, 
                studentIds, 
                content, 
                expiryDate
            );
        } catch (error) {
            throw new Error("Error sending offer letters: " + error.message);
        }
    }
    async getOfferLetters(placementId) {
        try {
            return await this.placementModel.getOfferLetters(placementId);
        } catch (error) {
            throw new Error("Error getting offer letters: " + error.message);
        }
    }
    async getOfferLetter(placementId, offerId) {
        try {
            return await this.placementModel.getOfferLetter(placementId, offerId);
        } catch (error) {
            throw new Error("Error fetching offer letter: " + error.message);
        }
    }
    async updateOfferStatus(placementId, offerId, status) {
        try {
            return await this.placementModel.updateOfferStatus(placementId, offerId, status);
        } catch (error) {
            throw new Error("Error updating offer status: " + error.message);
        }
    }
    async getFinalSelectedStudents(placementId) {
        try {
            return await this.placementModel.getFinalSelectedStudents(placementId);
        } catch (error) {
            throw new Error("Error fetching final selected students: " + error.message);
        }
    }

    async createStudentPlacement(placementData) {
        try {
            const {
                studentId,
                companyId,
                placementDriveId,
                selectedProfileId,
                offerDetails,
                status = 'offer_accepted'
            } = placementData;

            // Validate required fields
            if (!studentId || !companyId || !placementDriveId || !selectedProfileId) {
                throw new Error('Missing required fields');
            }

            // Create new student placement
            const studentPlacement = new StudentPlacement({
                student: studentId,
                company: companyId,
                placementDrive: placementDriveId,
                selectedProfile: selectedProfileId,
                status,
                offerDetails: {
                    offerDate: offerDetails?.offerDate || new Date(),
                    joiningDate: offerDetails?.joiningDate,
                    offerLetterUrl: offerDetails?.offerLetterUrl,
                    finalPackage: offerDetails?.finalPackage,
                    location: offerDetails?.location
                },
                selectionProgress: [{
                    roundNumber: 1,
                    roundName: 'Final Selection',
                    status: 'cleared',
                    date: new Date(),
                    remarks: 'Offer accepted'
                }]
            });

            const savedPlacement = await studentPlacement.save();
            console.log('Student placement created:', savedPlacement);

            return new apiResponse(201, savedPlacement, 'Student placement created successfully');
        } catch (error) {
            console.error('Error creating student placement:', error);
            throw error;
        }
    }
}
