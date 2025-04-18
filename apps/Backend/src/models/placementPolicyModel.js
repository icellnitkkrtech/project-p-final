import mongoose from 'mongoose';
import placementPolicySchema from '../schema/admin/placementPolicySchema.js';

const PlacementPolicy = mongoose.model('PlacementPolicy', placementPolicySchema);

export default PlacementPolicy; 