const mongoose=require('mongoose')
const {Schema}=mongoose

const CategorySchema=new Schema ({
    catName: {
        type: String
    },
    isDeleted: {
        type: Boolean
    }
},
{
    timestamps: true,
    versionKey: 0
})

const CategoryModel=mongoose.model("category", CategorySchema)
module.exports=CategoryModel