import Course from '../models/course.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultImage from './../../client/assets/images/default.png'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let course = new Course(fields)
    course.instructor = req.profile
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path)
      course.image.contentType = files.image.type
    }
    try {
      let result = await course.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate('instructor', '_id name')
    if (!course)
      return res.status(400).json({
        error: "Course not found"
      })
    req.course = course
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve course"
    })
  }
}

const read = (req, res) => {
  req.course.image = undefined
  return res.json(req.course)
}

const list = async (req, res) => {
  try {
    let courses = await Course.find().select('name email updated created')
    res.json(courses)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let course = req.course
    course = extend(course, fields)
    if (fields.lessons) {
      course.lessons = JSON.parse(fields.lessons)
    }
    course.updated = Date.now()
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path)
      course.image.contentType = files.image.type
    }
    try {
      await course.save()
      res.json(course)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const newLesson = async (req, res) => {
  try {
    let lesson = req.body.lesson
    let result = await Course.findByIdAndUpdate(
      req.course._id,
      { $push: { lessons: lesson }, updated: Date.now() },
      { new: true }
    )
      .populate('instructor', '_id name')
      .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let course = req.course

    let deletedCourse = await Course.findByIdAndDelete(course._id)

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found or already deleted" })
    }

    res.json({
      message: "Course deleted successfully",
      course: {
        _id: deletedCourse._id,
        name: deletedCourse.name
      }
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const isInstructor = (req, res, next) => {
  // Pastikan data lengkap
  const courseInstructor = req.course?.instructor?._id?.toString()
  const userId = req.auth?._id?.toString()



  if (!courseInstructor || !userId) {
    return res.status(400).json({ error: "Missing instructor or authenticated user ID" })
  }

  if (courseInstructor !== userId) {
    return res.status(403).json({
      error: "User is not authorized to delete this course"
    })
  }

  next()
}




const listByInstructor = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.profile._id })
      .populate('instructor', '_id name')
    res.json(courses)
  } catch (err) {
    res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listPublished = async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .populate('instructor', '_id name')
    res.json(courses)
  } catch (err) {
    res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
  if (req.course.image.data) {
    res.set("Content-Type", req.course.image.contentType)
    return res.send(req.course.image.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + defaultImage)
}

export default {
  create,
  courseByID,
  read,
  list,
  remove,
  update,
  isInstructor,
  listByInstructor,
  photo,
  defaultPhoto,
  newLesson,
  listPublished
}
