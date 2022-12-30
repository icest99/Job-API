const Job = require('../models/Job');
const {statusCode, StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user.userId}).sort('createdAt');
        res.status(StatusCodes.OK).json({jobs, count: jobs.length}, );
    } catch(err){
        console.log(err)
    }
}
const getJob = async (req, res) => {
    // res.status(StatusCodes.OK).json({req.user})
    const {
        user:{ userId },
        params:{ id:jobId },
    } = req
    const job = await Job.findOne({
        _id:jobId, createdBy:userId
    })
    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const createJob = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId
        const job = await Job.create(req.body)
        res.status(StatusCodes.CREATED).json({job})
    } catch(err) {
        console.log("ERROR: ", err)
    }
}
const updateJob = async (req, res) => {
    const {
        body:{ company, position },
        user:{ userId },
        params:{ id:jobId },
    } = req

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId}, req.body, {new:true, runValidators: true})

    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})

}
const deleteJob = async (req, res) => {
    const {
        user:{ userId },
        params:{ id:jobId },
    } = req

    const job = await Job.findByIdAndRemove({
        _id:jobId,
        createdBy:userId
    })

    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json("Job deleted")
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}