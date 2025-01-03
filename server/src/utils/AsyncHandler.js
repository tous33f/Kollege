const asyncHandler = (callback) => async(req,res,next) =>{
    try{
        await callback(req,res,next)
    }
    catch(err){
        res.status(err.statusCode || 500).json({
            succes: false,
            message: err.message
        })
    }
}

export {asyncHandler}