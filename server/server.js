import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://WebClassroom:32112525@cluster0.laec3qo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// ❌ Error handling
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err)
  process.exit(1)
})

// ✅ Log ketika koneksi berhasil
mongoose.connection.once('open', () => {
  console.log('✅ Successfully connected to MongoDB Atlas')
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('🚀 Server started on port %s.', config.port)
})