import mongoose from "mongoose";
//placement session is session of placement drive for example 2022-2023 and inside that session there are multiple rounds
const placementSessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rounds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlacementRound",
  }],
});
 

export default mongoose.model("PlacementSession", placementSessionSchema);
