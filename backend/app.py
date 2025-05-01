from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_babel import Babel
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from database import MONGO_URI
from typing import List, Dict
from flask_sqlalchemy import SQLAlchemy
from models.user import User
from models.job import Job
from models.certification import Certification
from models.training import Training
from routes.jobs import jobs_bp
from routes.certifications import certifications_bp
from routes.training import training_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['MONGO_URI'] = MONGO_URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
CORS(app)
babel = Babel(app)

# Initialize database
from database import mongo, db
mongo.init_app(app)

# Register blueprints
app.register_blueprint(jobs_bp)
app.register_blueprint(certifications_bp)
app.register_blueprint(training_bp)

@app.route('/')
def index():
    return {'message': 'Welcome to the Employment Portal API'}

# Job listing schema
def job_schema():
    return {
        'title': str,
        'company': str,
        'location': str,
        'description': str,
        'requirements': list,
        'salary_range': str,
        'job_type': str,
        'sector': str,
        'posted_date': datetime
    }

# In-memory storage for jobs (replace with database in production)
jobs: List[Dict] = []
job_id_counter = 1

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        # Get search query
        search_query = request.args.get('search', '')
        
        # Build search filter
        search_filter = {}
        if search_query:
            search_filter['$or'] = [
                {'title': {'$regex': search_query, '$options': 'i'}},
                {'description': {'$regex': search_query, '$options': 'i'}},
                {'company': {'$regex': search_query, '$options': 'i'}},
                {'location': {'$regex': search_query, '$options': 'i'}}
            ]
        
        # Get filter parameters
        job_type = request.args.get('job_type')
        location = request.args.get('location')
        sector = request.args.get('sector')
        
        # Add additional filters
        if job_type:
            search_filter['job_type'] = job_type
        if location:
            search_filter['location'] = location
        if sector:
            search_filter['sector'] = sector
        
        # Get jobs from database
        jobs = list(mongo.db.jobs.find(search_filter))
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job['_id'] = str(job['_id'])
            if 'posted_date' in job:
                job['posted_date'] = job['posted_date'].isoformat()
        
        return jsonify(jobs), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs', methods=['POST'])
def create_job():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'company', 'location', 'description', 'salary_range']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create new job
        job = {
            'title': data['title'],
            'company': data['company'],
            'location': data['location'],
            'description': data['description'],
            'requirements': data.get('requirements', []),
            'salary_range': data['salary_range'],
            'job_type': data.get('job_type', 'full-time'),
            'sector': data.get('sector', 'general'),
            'posted_date': datetime.now()
        }
        
        # Insert job into database
        result = mongo.db.jobs.insert_one(job)
        
        # Convert ObjectId to string
        job['_id'] = str(result.inserted_id)
        job['posted_date'] = job['posted_date'].isoformat()
        
        return jsonify(job), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = mongo.db.jobs.find_one({'_id': job_id})
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
            
        # Convert ObjectId to string
        job['_id'] = str(job['_id'])
        if 'posted_date' in job:
            job['posted_date'] = job['posted_date'].isoformat()
            
        return jsonify(job), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<job_id>', methods=['PUT'])
def update_job(job_id):
    try:
        data = request.get_json()
        
        # Update job in database
        result = mongo.db.jobs.update_one(
            {'_id': job_id},
            {'$set': data}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Job not found'}), 404
            
        return jsonify({'message': 'Job updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        result = mongo.db.jobs.delete_one({'_id': job_id})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Job not found'}), 404
            
        return jsonify({'message': 'Job deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 

