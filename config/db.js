import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('database conectada')
  } catch (error) {
    console.log(`error: ${error.message}`)
    process.exit(1)
  }
}
export default conectarDB
