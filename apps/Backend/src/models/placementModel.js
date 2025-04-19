import placementDrive from "../schema/placement/placementSchema.js";
import student from "../schema/student/studentSchema.js";
import {Application} from "../schema/general/applicationSchema.js";
import mongoose from "mongoose";
import JNF from "../schema/company/jnfSchema.js";
export default class PlacementModel {
    placement = placementDrive;
    student = student;
    application = Application;
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
        console.log("Placement Model: createPlacement called with data:", placementData);
        try {
            // Initialize roundDetails if not provided
            if (!placementData.roundDetails) {
                placementData.roundDetails = { rounds: [] };
            }
    
            // Fetch rounds from selectionProcess and add to roundDetails
            if (placementData.selectionProcess && Array.isArray(placementData.selectionProcess)) {
                placementData.selectionProcess.forEach((process) => {
                    process.rounds.forEach((round, index) => {
                        placementData.roundDetails.rounds.push({
                            roundName: round.roundName,
                            roundNumber: round.roundNumber || index + 1,
                            startTime: round.startTime || new Date(Date.now() + 24 * 60 * 60 * 1000), // Set to 24 hours in the future
                            endTime: round.endTime || new Date(Date.now() + 48 * 60 * 60 * 1000),     // Set to 48 hours in the future
                            roundStatus: "upcoming"
                        });
                    });
                });
            }
    
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
            // Validate round data
            if (!roundData.roundNumber || !roundData.roundName || !roundData.startTime || !roundData.endTime) {
                throw new Error("Missing required round fields");
            }

            // Get current placement drive
            const placement = await this.placement.findById(id);
            if (!placement) {
                throw new Error("Placement drive not found");
            }

            // Set initial status based on time
            const now = new Date();
            if (new Date(roundData.startTime) <= now && new Date(roundData.endTime) >= now) {
                roundData.roundStatus = 'ongoing';
            } else if (new Date(roundData.startTime) > now) {
                roundData.roundStatus = 'upcoming';
            } else {
                roundData.roundStatus = 'completed';
            }

            // Add the round
            return await this.placement.findByIdAndUpdate(
                id,
                { $push: { "roundDetails.rounds": roundData } },
                { new: true }
            );
        } catch (error) {
            console.error("Error in addRound:", error);
            throw error;
        }
    }

    async deleteRound(id, roundId) {
        console.log("Placement Model: deleteRound called");
        try {
            return await this.placement.findByIdAndUpdate(id, { $pull: { "roundDetails.rounds": { _id: roundId } } }, { new: true });
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

    async updateRound(placementId, roundId, updateData) {
        try {
            console.log("Updating round with data:", { placementId, roundId, updateData });
            
            const result = await this.placement.findOneAndUpdate(
                { 
                    "_id": placementId,
                    "roundDetails.rounds._id": roundId 
                },
                { 
                    "$set": {
                        "roundDetails.rounds.$": {
                            ...updateData,
                            _id: roundId // Preserve the original round ID
                        }
                    }
                },
                { new: true }
            );

            if (!result) {
                throw new Error('Round not found');
            }

            return result;
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
                select: "name email branch" // Add fields you want to retrieve
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
            const result = await this.placement.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$": 1 }
            ).populate({
                path: "roundDetails.rounds.selectedStudents",
                model: "Student",
                select: "personalInfo academics" // Select only the fields we need
            });
    
            if (!result || !result.roundDetails || !result.roundDetails.rounds.length === 0) {
                return [];
            }
    
            // Return the selected students array from the matched round
            return result.roundDetails.rounds[0].selectedStudents || [];
        } catch (error) {
            console.error("Error in getSelectedStudentsForRound:", error);
            throw error;
        }
    }

    async getAppearedStudentsForRound(id, roundId) {
        console.log("Placement Model: getAppearedStudentsForRound called");
        try {
            const result = await this.placement.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$": 1 }
            ).populate({
                path: "roundDetails.rounds.appearedStudents",
                model: "Student",
                select: "personalInfo academics"
            });

            if (!result || !result.roundDetails || !result.roundDetails.rounds.length === 0) {
                return [];
            }

            return result.roundDetails.rounds[0].appearedStudents || [];
        } catch (error) {
            console.error("Error in getAppearedStudentsForRound:", error);
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

    async updateSelectedStudents(id, roundId, studentIds) {
        console.log("Placement Model: updateSelectedStudents called with studentIds:", studentIds);
        try {
            // Ensure studentIds is always an array (even if empty)
            const studentIdsArray = Array.isArray(studentIds) ? studentIds : (studentIds ? [studentIds] : []);
            
            // First, get the current round
            const placement = await this.placement.findOne(
                { _id: id, "roundDetails.rounds._id": roundId },
                { "roundDetails.rounds.$": 1 }
            );
            
            if (!placement || !placement.roundDetails || !placement.roundDetails.rounds || placement.roundDetails.rounds.length === 0) {
                throw new Error("Round not found");
            }
            
            const currentRound = placement.roundDetails.rounds[0];
            
            // Update the round with the new selected students list (replacing the old one)
            // This will work even if studentIdsArray is empty
            const result = await this.placement.findOneAndUpdate(
                { _id: id, "roundDetails.rounds._id": roundId },
                { $set: { "roundDetails.rounds.$.selectedStudents": studentIdsArray } },
                { new: true }
            );
            
            if (!result) {
                throw new Error("Failed to update selected students");
            }
            
            const currentRoundIndex = result.roundDetails.rounds.findIndex(
                round => round._id.toString() === roundId
            );
            
            // Add selected students to next round's applicants if there is a next round
            if (currentRoundIndex < result.roundDetails.rounds.length - 1 && studentIdsArray.length > 0) {
                const nextRoundId = result.roundDetails.rounds[currentRoundIndex + 1]._id;
                await this.placement.findOneAndUpdate(
                    { _id: id, "roundDetails.rounds._id": nextRoundId },
                    { $set: { "roundDetails.rounds.$.applicantStudents": studentIdsArray } }
                );
            }
            
            // Update StudentPlacement records for each student
            try {
                const StudentPlacement = mongoose.model('StudentPlacement');
                const placementDrive = await this.placement.findById(id);
                
                // Get all students who were previously selected in this round
                const previouslySelected = currentRound.selectedStudents || [];
                
                // Process each student who is now selected
                for (const studentId of studentIdsArray) {
                    let studentPlacement = await StudentPlacement.findOne({
                        student: studentId,
                        placementDrive: id
                    });
                    
                    // Create or update the student placement record
                    if (!studentPlacement) {
                        // Create new record if it doesn't exist
                        const companyId = placementDrive.companyDetails?.companyId || null;
                        const profileId = placementDrive.jobProfile?._id || null;
                        
                        if (companyId && profileId) {
                            studentPlacement = new StudentPlacement({
                                student: studentId,
                                company: companyId,
                                placementDrive: id,
                                selectedProfile: profileId,
                                status: 'pending',
                                selectionProgress: []
                            });
                            
                            const round = result.roundDetails.rounds[currentRoundIndex];
                            
                            studentPlacement.selectionProgress.push({
                                roundNumber: round.roundNumber,
                                roundName: round.roundName,
                                status: 'cleared',
                                date: new Date()
                            });
                            
                            await studentPlacement.save();
                        } else {
                            console.warn("Missing required fields for StudentPlacement. Skipping record creation.");
                        }
                    } else {
                        // Update existing record
                        const round = result.roundDetails.rounds[currentRoundIndex];
                        
                        const existingRoundIndex = studentPlacement.selectionProgress.findIndex(
                            progress => progress.roundNumber === round.roundNumber
                        );
                        
                        if (existingRoundIndex >= 0) {
                            studentPlacement.selectionProgress[existingRoundIndex].status = 'cleared';
                            studentPlacement.selectionProgress[existingRoundIndex].date = new Date();
                        } else {
                            studentPlacement.selectionProgress.push({
                                roundNumber: round.roundNumber,
                                roundName: round.roundName,
                                status: 'cleared',
                                date: new Date()
                            });
                        }
                        
                        if (currentRoundIndex === result.roundDetails.rounds.length - 1) {
                            studentPlacement.status = 'offer_accepted';
                            
                            if (placementDrive.jobProfile && placementDrive.jobProfile.ctcOffered) {
                                studentPlacement.offerDetails = {
                                    offerDate: new Date(),
                                    finalPackage: placementDrive.jobProfile.ctcOffered,
                                    location: placementDrive.jobProfile.location || ''
                                };
                            }
                        }
                        
                        await studentPlacement.save();
                    }
                }
                
                // Process students who were previously selected but are now deselected
                for (const studentId of previouslySelected) {
                    if (!studentIdsArray.includes(studentId.toString())) {
                        // This student was deselected
                        const studentPlacement = await StudentPlacement.findOne({
                            student: studentId,
                            placementDrive: id
                        });
                        
                        if (studentPlacement) {
                            // Update the student's record to show they didn't clear this round
                            const round = result.roundDetails.rounds[currentRoundIndex];
                            
                            const existingRoundIndex = studentPlacement.selectionProgress.findIndex(
                                progress => progress.roundNumber === round.roundNumber
                            );
                            
                            if (existingRoundIndex >= 0) {
                                studentPlacement.selectionProgress[existingRoundIndex].status = 'not_cleared';
                            } else {
                                studentPlacement.selectionProgress.push({
                                    roundNumber: round.roundNumber,
                                    roundName: round.roundName,
                                    status: 'not_cleared',
                                    date: new Date()
                                });
                            }
                            
                            // Update overall status
                            studentPlacement.status = 'rejected';
                            
                            await studentPlacement.save();
                        }
                    }
                }
            } catch (studentPlacementError) {
                console.error("Error updating StudentPlacement records:", studentPlacementError);
            }
            
            return result;
        } catch (error) {
            console.error("Error in updateSelectedStudents:", error);
            throw error;
        }
    }

    async declareResult(id, roundId, resultData) {
        console.log("Placement Model: declareResult called with:", { id, roundId, resultData });
        try {
            const { resultMessage, resultDescription } = resultData;
            
            // Step 1: Find the placement drive
            console.log("Finding placement drive...");
            const placement = await this.placement.findOne({ _id: id });
            if (!placement) {
                throw new Error("Placement drive not found");
            }
            console.log("Placement drive found:", placement._id);
            
            // Step 2: Find the round
            console.log("Finding round...");
            const roundIndex = placement.roundDetails.rounds.findIndex(
                round => round._id.toString() === roundId
            );
            
            if (roundIndex === -1) {
                throw new Error("Round not found");
            }
            console.log("Round found at index:", roundIndex);
            
            const currentRound = placement.roundDetails.rounds[roundIndex];
            console.log("Current round:", currentRound.roundName);
            
            // Step 3: Get selected students
            console.log("Getting selected students...");
            const selectedStudents = [...new Set(currentRound.selectedStudents.map(id => id.toString()))];
            console.log("Selected students:", selectedStudents.length);
            
            const nextRoundIndex = roundIndex + 1;
            const hasNextRound = nextRoundIndex < placement.roundDetails.rounds.length;
            console.log("Has next round:", hasNextRound);
            
            // Step 4: Update the current round status
            console.log("Updating current round status...");
            await this.placement.findOneAndUpdate(
                { _id: id, "roundDetails.rounds._id": roundId },
                { 
                    $set: { 
                        "roundDetails.rounds.$.resultMessage": resultMessage, 
                        "roundDetails.rounds.$.resultDescription": resultDescription,
                        "roundDetails.rounds.$.roundStatus": "completed"
                    }
                }
            );
            console.log("Current round status updated");
            
            // Step 5: Get all appeared students
            console.log("Getting appeared students...");
            const allAppearedStudents = currentRound.appearedStudents.map(id => id.toString());
            console.log("Appeared students:", allAppearedStudents.length);
            
            // Step 6: Find rejected students
            const rejectedStudents = allAppearedStudents.filter(id => !selectedStudents.includes(id));
            console.log("Rejected students:", rejectedStudents.length);

            // Step 7: Update placement drive status if last round
            if (!hasNextRound) {
                console.log("Last round - updating drive status to closed");
                await this.placement.findByIdAndUpdate(
                    id,
                    { 
                        $set: { 
                            status: "closed",
                            selectedStudents: selectedStudents
                        }
                    }
                );
                console.log("Drive status updated to closed");
            } 
            // Step 8: Update next round if not last round
            else if (selectedStudents.length > 0) {
                console.log("Not last round - updating next round status");
                const nextRoundId = placement.roundDetails.rounds[nextRoundIndex]._id;
                
                // Update placement for next round
                await this.placement.findOneAndUpdate(
                    { _id: id, "roundDetails.rounds._id": nextRoundId },
                    { $set: { "roundDetails.rounds.$.roundStatus": "ongoing" } }
                );
                console.log("Next round status updated to ongoing");
                
                // Add selected students to next round
                for (const studentId of selectedStudents) {
                    console.log(`Adding student ${studentId} to next round`);
                    await this.placement.findOneAndUpdate(
                        { _id: id, "roundDetails.rounds._id": nextRoundId },
                        {
                            $addToSet: { 
                                "roundDetails.rounds.$.applicantStudents": studentId,
                                "roundDetails.rounds.$.appearedStudents": studentId
                            }
                        }
                    );
                }
                console.log("Selected students added to next round");
            }
            
            // Step 9: Add timeline entry
            console.log("Adding timeline entry...");
            await this.placement.findByIdAndUpdate(
                id,
                {
                    $push: {
                        timeline: {
                            title: `Round ${currentRound.roundNumber} Results Declared`,
                            description: `${selectedStudents.length} students selected for ${hasNextRound ? 'next round' : 'final selection'}`,
                            date: new Date()
                        }
                    }
                }
            );
            console.log("Timeline entry added");
            
            // Step 10: Return updated placement
            console.log("Returning updated placement...");
            return await this.placement.findById(id);
        } catch (error) {
            console.error("Error in declareResult:", error);
            // Log the full error stack
            console.error(error.stack);
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

    async getOfferLetters(placementId) {
        console.log("Placement Model: getOfferLetters called");
        try {
            const placement = await this.placement.findById(placementId);
            if (!placement) {
                throw new Error("Placement not found");
            }
            
            return placement.offerLetters || [];
        } catch (error) {
            console.error("Error in getOfferLetters:", error);
            throw error;
        }
    }

    async sendOfferLetters(placementId, studentIds, content, expiryDate) {
        try {
            console.log("Starting sendOfferLetters with:", { placementId, studentIds, contentLength: content?.length, expiryDate });
            
            // Validate inputs
            if (!placementId) {
                throw new Error("Placement ID is required");
            }
            
            if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
                throw new Error("Student IDs must be a non-empty array");
            }
            
            if (!content) {
                throw new Error("Offer letter content is required");
            }
            
            // Find the placement
            const placement = await this.placement.findById(placementId);
            console.log("Placement found:", placement ? "Yes" : "No");
            
            if (!placement) {
                throw new Error(`Placement not found with ID: ${placementId}`);
            }
            
            // Initialize offerLetters array if it doesn't exist
            if (!placement.offerLetters) {
                placement.offerLetters = [];
            }
            
            // Create offer letters for each student
            const newOfferLetters = [];
            
            for (const studentId of studentIds) {
                console.log("Processing student ID:", studentId);
                
                try {
                    // Check if an offer letter already exists for this student
                    const existingOfferIndex = placement.offerLetters.findIndex(
                        offer => offer.studentId && offer.studentId.toString() === studentId
                    );
                    
                    if (existingOfferIndex !== -1) {
                        console.log("Updating existing offer letter");
                        // Update existing offer letter
                        placement.offerLetters[existingOfferIndex] = {
                            ...placement.offerLetters[existingOfferIndex],
                            content,
                            sentDate: new Date(),
                            expiryDate: expiryDate || new Date(Date.now() + 7*24*60*60*1000), // Default 7 days
                            status: 'pending'
                        };
                        
                        newOfferLetters.push(placement.offerLetters[existingOfferIndex]);
                    } else {
                        console.log("Creating new offer letter");
                        // Create new offer letter with mongoose ObjectId
                        const newOffer = {
                            _id: new mongoose.Types.ObjectId(),
                            studentId,
                            content,
                            sentDate: new Date(),
                            expiryDate: expiryDate || new Date(Date.now() + 7*24*60*60*1000), // Default 7 days
                            status: 'pending'
                        };
                        
                        placement.offerLetters.push(newOffer);
                        newOfferLetters.push(newOffer);
                    }
                } catch (studentError) {
                    console.error(`Error processing student ${studentId}:`, studentError);
                    // Continue with next student instead of failing the entire operation
                }
            }
            
            console.log("Saving placement with new offer letters");
            await placement.save();
            console.log("Placement saved successfully");
            
            return newOfferLetters;
        } catch (error) {
            console.error("Error in sendOfferLetters:", error);
            throw new Error(`Error sending offer letters: ${error.message}`);
        }
    }

    async updateOfferStatus(placementId, offerId, status) {
        try {
            // Import models directly if they're not available through this
            const Student = mongoose.model('Student');
            const Application = mongoose.model('Application');
            
            const placement = await this.placement.findById(placementId);
            if (!placement) {
                throw new Error("Placement not found");
            }
            
            if (!placement.offerLetters || !Array.isArray(placement.offerLetters)) {
                throw new Error("No offer letters found");
            }
            
            const offerIndex = placement.offerLetters.findIndex(
                offer => offer._id.toString() === offerId
            );
            
            if (offerIndex === -1) {
                throw new Error("Offer letter not found");
            }
            
            // Update the status
            placement.offerLetters[offerIndex].status = status;
            placement.offerLetters[offerIndex].responseDate = new Date();
            
            // Get the student ID
            const studentId = placement.offerLetters[offerIndex].studentId;
            if (!studentId) {
                throw new Error("Student ID not found in offer letter");
            }
            
            try {
                // Find student with the student id
                const student = await Student.findById(studentId);
                if (!student) {
                    console.warn(`Student with ID ${studentId} not found`);
                } else {
                    // Update the student's placement status
                    if (status === 'accepted') {
                        student.isPlaced = true;
                        student.placementDate = new Date();
                    } else if (status === 'rejected') {
                        student.isPlaced = false;
                        student.placementDate = null;
                    }
                    await student.save();
                }
                
                // Find and update the application
                const application = await Application.findOne({ 
                    student: studentId, 
                    placementDrive: placementId 
                });
                
                if (!application) {
                    console.warn(`Application for student ${studentId} and placement ${placementId} not found`);
                } else {
                    // Make sure offerDetails exists
                    if (!application.offerDetails) {
                        application.offerDetails = {};
                    }
                    
                    application.offerDetails.status = status;
                    application.status = "selected";
                    application.offerDetails.responseDate = new Date();
                    await application.save();
                }
            } catch (innerError) {
                console.error("Error updating related records:", innerError);
                // Continue with saving the placement even if related updates fail
            }
            
            // Save the placement regardless of other updates
            await placement.save();
            return placement.offerLetters[offerIndex];
        } catch (error) {
            console.error("Error in updateOfferStatus:", error);
            throw error;
        }
    }

    async getFinalSelectedStudents(placementId) {
        console.log("Placement Model: getFinalSelectedStudents called");
        try {
            const placement = await this.placement.findById(placementId);
            
            if (!placement) {
                throw new Error("Placement drive not found");
            }
            
            // Get the last round with results
            let lastRoundWithResults = null;
            
            if (placement.roundDetails && placement.roundDetails.rounds) {
                const completedRounds = placement.roundDetails.rounds
                    .filter(round => round.roundStatus === 'completed' && round.resultMessage)
                    .sort((a, b) => b.roundNumber - a.roundNumber);
                
                if (completedRounds.length > 0) {
                    lastRoundWithResults = completedRounds[0];
                }
            }
            
            if (!lastRoundWithResults) {
                return [];
            }
            
            return lastRoundWithResults.selectedStudents || [];
        } catch (error) {
            console.error("Error in getFinalSelectedStudents:", error);
            throw error;
        }
    }
}
