import mongoose from 'mongoose'

const requestSchema =  new mongoose.Schema({
    from : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    to : {type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
    status : {type : String, enum : ['Pending', 'Accepted', 'Rejected'], default : 'Pending'}
}, {timestamps : true})

export default mongoose.model('Request', requestSchema)