import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subcriber:{
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom ''subscriber is subscriber
        ref:"User"
    }
})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)