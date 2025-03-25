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

    async updateRound(id, roundId, updates) {
        console.log("Placement Model: updateRound called");
        try {
            // Validate the round exists
            const placement = await this.placement.findOne({
                _id: id,
                "roundDetails.rounds._id": roundId
            });

            if (!placement) {
                throw new Error("Round not found");
            }

            // Update round status based on time if start/end times are being updated
            if (updates.startTime || updates.endTime) {
                const now = new Date();
                const startTime = new Date(updates.startTime || placement.roundDetails.rounds[0].startTime);
                const endTime = new Date(updates.endTime || placement.roundDetails.rounds[0].endTime);

                if (startTime <= now && endTime >= now) {
                    updates.roundStatus = 'ongoing';
                } else if (startTime > now) {
                    updates.roundStatus = 'upcoming';
                } else {
                    updates.roundStatus = 'completed';
                }
            }

            return await this.placement.findOneAndUpdate(
                { _id: id, "roundDetails.rounds._id": roundId },
                { $set: { "roundDetails.rounds.$": { ...placement.roundDetails.rounds[0], ...updates } } },
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
                            $addToSet: { "roundDetails.rounds.$.applicantStudents": studentId },
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
}
