from flask_pymongo import PyMongo
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB setup
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/employment_portal')

# Initialize PyMongo
mongo = PyMongo()

# Initialize client
client = MongoClient(MONGO_URI)
db = client.get_database() 