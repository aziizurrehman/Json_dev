const { MongoClient } = require('mongodb');
const fs = require('fs');

// MongoDB connection URL
const mongoURI = 'mongodb://localhost:27017'; // Update with your MongoDB URI
const dbName = 'your_db_name'; // Replace with your database name
const collectionName = 'your_collection_name'; // Replace with your collection name

// MongoDB client
let client;

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(mongoURI, { useUnifiedTopology: true });
    await client.connect();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Middleware function to get document by ID and write to config.json
async function getDocumentByID(req, res, next) {
  const { id } = req.params; // Assuming the ID is provided as a route parameter

  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query MongoDB for document with provided ID
    const document = await collection.findOne({ _id: id });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Write document data to config.json file
    fs.writeFileSync('config.json', JSON.stringify(document, null, 2));

    // Pass the document data to the next middleware or route handler
    req.document = document;
    next();
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Middleware to close MongoDB connection
function closeDBConnection(req, res, next) {
  if (client) {
    client.close();
    console.log('MongoDB connection closed');
  }
  next();
}

// Export the middleware functions
module.exports = {
  connectDB,
  getDocumentByID,
  closeDBConnection,
};
