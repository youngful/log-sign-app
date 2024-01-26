const mongoose = require("mongoose")
const slugify = require("slugify")


const articleSchema = mongoose.Schema({
    userName: {
        type: String, 
        required: true
    },
    userEmail:{
        type: String,
        required: true
    },
    userPassword:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    }

})

articleSchema.pre("validate", function(){
    if(this.userEmail){
        this.slug = slugify(this.userEmail, {
            lower: true,
            strict:true
        })
    }
})

module.exports = mongoose.model("Model", articleSchema)