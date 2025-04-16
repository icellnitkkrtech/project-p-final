import placementDrive from "../schema/placement/placementSchema.js";
import mongoose from "mongoose";

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

    async updateSelectedStudents(id, roundId, studentId) {
        console.log("Placement Model: updateSelectedStudents called");
        try {
            const result = await this.placement.findOneAndUpdate(
                { 
                    _id: id,
                    "roundDetails.rounds._id": roundId 
                },
                { 
                    $addToSet: { 
                        "roundDetails.rounds.$.selectedStudents": studentId 
                    } 
                },
                { new: true }
            );

            if (!result) {
                throw new Error("Round not found");
            }

            const currentRoundIndex = result.roundDetails.rounds.findIndex(
                round => round._id.toString() === roundId
            );

            // Add student to next round's applicants if there is a next round
            if (currentRoundIndex < result.roundDetails.rounds.length - 1) {
                const nextRoundId = result.roundDetails.rounds[currentRoundIndex + 1]._id;
                await this.placement.findOneAndUpdate(
                    { _id: id, "roundDetails.rounds._id": nextRoundId },
                    { 
                        $addToSet: { 
                            "roundDetails.rounds.$.applicantStudents": studentId 
                        } 
                    }
                );
            }

            // Create or update StudentPlacement record
            const StudentPlacement = mongoose.model('StudentPlacement');
            
            // Get placement drive details
            const placementDrive = await this.placement.findById(id);
            
            // Check if a record already exists
            let studentPlacement = await StudentPlacement.findOne({
                student: studentId,
                placementDrive: id
            });
            
            if (!studentPlacement) {
                // Create new record if it doesn't exist
                studentPlacement = new StudentPlacement({
                    student: studentId,
                    company: placementDrive.companyDetails.companyId || null,
                    placementDrive: id,
                    selectedProfile: placementDrive.jobProfile._id || null,
                    status: 'pending',
                    selectionProgress: []
                });
            }
            
            // Add or update the round progress
            const round = result.roundDetails.rounds[currentRoundIndex];
            
            // Check if this round already exists in the progress
            const existingRoundIndex = studentPlacement.selectionProgress.findIndex(
                progress => progress.roundNumber === round.roundNumber
            );
            
            if (existingRoundIndex >= 0) {
                // Update existing round progress
                studentPlacement.selectionProgress[existingRoundIndex].status = 'cleared';
                studentPlacement.selectionProgress[existingRoundIndex].date = new Date();
            } else {
                // Add new round progress
                studentPlacement.selectionProgress.push({
                    roundNumber: round.roundNumber,
                    roundName: round.roundName,
                    status: 'cleared',
                    date: new Date()
                });
            }
            
            // If this is the final round, update the status to offer_accepted
            if (currentRoundIndex === result.roundDetails.rounds.length - 1) {
                studentPlacement.status = 'offer_accepted';
                
                // Add offer details if available
                if (placementDrive.jobProfile && placementDrive.jobProfile.ctcOffered) {
                    studentPlacement.offerDetails = {
                        offerDate: new Date(),
                        finalPackage: placementDrive.jobProfile.ctcOffered,
                        location: placementDrive.jobProfile.location || ''
                    };
                }
            }
            
            // Save the student placement record
            await studentPlacement.save();

            return result;
        } catch (error) {
            console.error("Error in updateSelectedStudents:", error);
            throw error;
        }
    }

    async declareResult(id, roundId, resultData) {
        console.log("Placement Model: declareResult called");
        try {
            const { resultMessage, resultDescription } = resultData;
            
            const placement = await this.placement.findOne({ _id: id });
            if (!placement) {
                throw new Error("Placement drive not found");
            }
            
            const roundIndex = placement.roundDetails.rounds.findIndex(
                round => round._id.toString() === roundId
            );
            
            if (roundIndex === -1) {
                throw new Error("Round not found");
            }
            
            const currentRound = placement.roundDetails.rounds[roundIndex];
            
            const selectedStudents = [...new Set(currentRound.selectedStudents.map(id => id.toString()))];
            
            const nextRoundIndex = roundIndex + 1;
            const hasNextRound = nextRoundIndex < placement.roundDetails.rounds.length;
            
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
            
            if (!hasNextRound) {
                // If it's the last round, update the drive status to "closed"
                await this.placement.findByIdAndUpdate(
                    id,
                    { 
                        $set: { 
                            status: "closed",
                            selectedStudents: selectedStudents
                        }
                    }
                );
            } else if (selectedStudents.length > 0) {
                const nextRoundId = placement.roundDetails.rounds[nextRoundIndex]._id;
                
                for (const studentId of selectedStudents) {
                    await this.placement.findOneAndUpdate(
                        { 
                            _id: id, 
                            "roundDetails.rounds._id": nextRoundId,
                            "roundDetails.rounds.$.applicantStudents": { $ne: studentId }
                        },
                        {
                            $addToSet: { 
                                "roundDetails.rounds.$.applicantStudents": studentId ,
                                 "roundDetails.rounds.$.appearedStudents": studentId
                            },
                            $set: { "roundDetails.rounds.$.roundStatus": "ongoing" }
                        }
                    );
                }
            }
            
            return await this.placement.findById(id);
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
            const placement = await this.placement.findById(placementId);
            if (!placement) {
                throw new Error("Placement not found");
            }
            
            if (!placement.offerLetters) {
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
            
            // If accepted, update student's placement status
            if (status === 'accepted') {
                const studentId = placement.offerLetters[offerIndex].studentId;
                
                // Update student's placement status in a separate collection if needed
                // This would require additional code to update the student model
            }
            
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
