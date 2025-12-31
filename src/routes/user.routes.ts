import express from 'express'
import { getAllUser, getById, remove, updateProfile } from '../controllers/user.controller'
import { OnlyUser } from '../types/global.types'
import { upload } from '../middlewares/file-uploader.middleware'
import { authenticate } from '../middlewares/auth.middleware'

const uploader = upload()
const router = express.Router()

router.get('/',getAllUser)
router.get('/:id',getById)
router.put('/:id', authenticate(OnlyUser),uploader.single('profile_picture'),updateProfile)
router.delete('/:id',remove)

export default router