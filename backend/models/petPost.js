import mongoose from 'mongoose';


const petSchema = new mongoose.Schema({
    u_id:String,
    p_id:String,
    petName:String,
    holderName:String,
    address:String,
    amount:Number,
    phNo:Number,
    breedName:String,
    petAge:String,
    isVaccinated:Boolean,
    imgUrl:String,
  });



  const Pet = new mongoose.model("Pet",petSchema);

  export default Pet