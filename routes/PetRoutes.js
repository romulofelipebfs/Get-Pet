const router = require('express').Router()

const verifyToken = require('../helpers/verify-token')

const { imageUpload } = require('../helpers/image-upload')

const PetController = require('../controllers/PetController')


router.post(
    '/create',
    verifyToken,
    PetController.create
  )


module.exports = router