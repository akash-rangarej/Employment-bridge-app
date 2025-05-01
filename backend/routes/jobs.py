from flask import Blueprint, request, jsonify
from database import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bson import ObjectId

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'location', 'sector', 'salary', 'company']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Add timestamp and default status
        data['posted_date'] = datetime.utcnow()
        data['status'] = 'active'
        data['posted_by'] = get_jwt_identity()
        
        # Insert into MongoDB
        result = mongo.db.jobs.insert_one(data)
        
        return jsonify({
            "message": "Job listing created successfully",
            "job_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route('/', methods=['GET'])
def get_jobs():
    try:
        # Get query parameters
        location = request.args.get('location')
        sector = request.args.get('sector')
        status = request.args.get('status', 'active')
        
        # Build query
        query = {"status": status}
        if location:
            query["location"] = location
        if sector:
            query["sector"] = sector
            
        # Get jobs from MongoDB
        jobs = list(mongo.db.jobs.find(query))
        
        # Convert ObjectId to string for JSON serialization
        for job in jobs:
            job['_id'] = str(job['_id'])
            job['posted_date'] = job['posted_date'].isoformat()
            
        return jsonify(jobs), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    try:
        job = mongo.db.jobs.find_one({"_id": job_id})
        if not job:
            return jsonify({"error": "Job not found"}), 404
            
        job['_id'] = str(job['_id'])
        job['posted_date'] = job['posted_date'].isoformat()
        
        return jsonify(job), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    try:
        data = request.get_json()
        
        # Remove _id if present in data
        if '_id' in data:
            del data['_id']
            
        result = mongo.db.jobs.update_one(
            {"_id": job_id},
            {"$set": data}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Job not found"}), 404
            
        return jsonify({"message": "Job updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route('/<job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    try:
        result = mongo.db.jobs.delete_one({"_id": job_id})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Job not found"}), 404
            
        return jsonify({"message": "Job deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@jobs_bp.route('/<job_id>/apply', methods=['POST'])
@jwt_required()
def apply_for_job(job_id):
    try:
        user_id = get_jwt_identity()
        
        # Convert job_id to ObjectId
        job_id = ObjectId(job_id)
        
        # Check if job exists
        job = mongo.db.jobs.find_one({'_id': job_id})
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        # Check if already applied
        if user_id in job.get('applications', []):
            return jsonify({'error': 'Already applied for this job'}), 400
        
        # Add application
        mongo.db.jobs.update_one(
            {'_id': job_id},
            {'$push': {'applications': user_id}}
        )
        
        return jsonify({'message': 'Application submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500 