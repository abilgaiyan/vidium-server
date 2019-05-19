// Keys for production --  commit it
module.exports ={
    mongoURI: process.env.MONGO_URI,
    s3_vidium_access_key: process.env.s3_vidium_access_key,
    s3_vidium_secretAccess_key:process.env.s3_vidium_secretAccess_key,
    s3_vidium_bucket_name:'my-vidium-video-bucket',
    secretOrPrivateKey: process.env.secretOrPrivateKey

}