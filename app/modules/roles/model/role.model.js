const mongoose=require('mongoose')
const {Schema}=mongoose

const RoleSchema=new Schema({
    roleName:{
        type: String
    },
    actions: {
        type: [String]
    }
},
{
    timestamps: true,
    versionKey: 0
})

const RoleModel=mongoose.model('role', RoleSchema)
module.exports=RoleModel
