import PlacementService from "../../services/placementServices.js";

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
            res.status(200).json({ data: response });
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
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching placement", error });
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
                return res.status(404).json({ message: "Placement drive not found" });
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
            const response = await this.placementService.updateRound(req.params.id, req.params.round_id, req.body);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error updating round", error });
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
            const response = await this.placementService.getApplicantsForRound(req.params.id, req.params.round_id);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error fetching applicants", error });
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
            const { getSelectedStudents } = req.body;
            const response = await this.placementService.updateSelectedStudents(req.params.id, req.params.round_id, getSelectedStudents);
            if (!response) {
                return res.status(404).json({ message: "Round not found" });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Error updating selected students", error });
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
}
