import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator';
import axios from 'axios'
import generateToken from '../utils/generateToken.js'
import User from "../users/userModel.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
    const user = await User.findOne({ email })
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  })

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullname,
    email,
    password,
    phone_number,
    country,
    business_name,
    bank_name,
    bank_code,
    account_number,
  } = req.body;
  

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({message: "User already exists"});
  }

  if (bank_name === ""){
    const newUser = await User.create({
      fullname,
      email,
      password,
      phone_number,
      country,
      business_name,
      bank_name,
      bank_code,
      account_number,
    });
  
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        isMerchant: newUser.isMerchant,
        token: generateToken(newUser._id),
      })
    
    } else {
      res.status(400).send({message: error})
      
    }
  }else{
  //Create Subaccount
  let APIKEY = "FLWSECK-767b9baea608e14a8a840d1cee54e619-X";

  var data =  JSON.stringify({
    "account_bank": bank_code,
    "account_number": account_number,
    "business_name": business_name,
    "business_email": email,
    "business_mobile": phone_number,
    "country": country,
    "split_type": "percentage",
    "split_value": 0.093
  })
  var config = {
    method: 'post',
    url: 'https://api.flutterwave.com/v3/subaccounts',
    headers: { 
      'Authorization': `Bearer ${APIKEY}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(async function (response)  {
      //res.status(200).json(response.data.data);
 const {subaccount_id} = response.data.data
console.log(subaccount_id)
 const newUser = await User.create({
    fullname,
    email,
    password,
    phone_number,
    country,
    business_name,
    bank_name,
    bank_code,
    account_number,
    subaccount_id
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      business_name: newUser.business_name,
      email: newUser.email,
      isMerchant: newUser.isMerchant,
      account_status: newUser.account_status,
      token: generateToken(newUser._id),
    }).catch(function (error) {
      res.status(400).json({message: error.message});
    });
    
  }
  })
  .catch(function (error) {
    //console.log(error.response.data.message)
    res.status(400).send({message: error.response.data.message});
  });
}
  
});
export { loginUser, registerUser };
