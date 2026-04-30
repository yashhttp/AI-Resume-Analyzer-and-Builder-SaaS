const notFound = (req,res,next)=>{
    const error = new Error(`Route Not Found - ${req.originalUrl}`);
    res.status(200)
    next(error)
}
export default notFound;