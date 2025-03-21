import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;;

const CompanySchema = new Schema(
    {
     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    website: String,
    JNFs :[{
        type : Schema.Types.ObjectId,
        ref:"JNF",
    }],
    
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    
    recruitmentStatus: {
        type: String,
        enum: ['ongoing', 'upcoming', 'completed'],
        default: 'upcoming'
    },

    // Additional tracking fields
    lastVisit: Date,
    offersCount: {
        type: Number,
        default: 0
    },
    avgPackage: {
        type: Number,
        default: 0
    },
    totalHired: {
        type: Number,
        default: 0
    },
    hiringSince: {
        type: Date,
        default: Date.now
    },
}
)
const Company = model('Company', CompanySchema);

export default Company;