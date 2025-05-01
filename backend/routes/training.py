from flask import Blueprint, request, jsonify
from database import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from bson import ObjectId
from models.training import Training
from models.certification import Certification

training_bp = Blueprint('training', __name__)

@training_bp.route('/training', methods=['GET'])
def get_training_modules():
    try:
        # Get all training modules
        modules = list(mongo.db.trainings.find())
        
        # Convert ObjectId to string for JSON serialization
        for module in modules:
            module['_id'] = str(module['_id'])
            
        return jsonify(modules), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@training_bp.route('/training/<training_id>', methods=['GET'])
def get_training(training_id):
    try:
        print(f"Fetching training with ID: {training_id}")  # Debug log
        
        # Convert string ID to ObjectId
        training_id = ObjectId(training_id)
        
        # Find the training module
        training = mongo.db.trainings.find_one({'_id': training_id})
        
        if not training:
            print(f"Training not found with ID: {training_id}")  # Debug log
            return jsonify({'message': 'Training module not found'}), 404
            
        # Convert ObjectId to string for JSON serialization
        training['_id'] = str(training['_id'])
        print(f"Found training: {training}")  # Debug log
        
        return jsonify(training)
    except Exception as e:
        print(f"Error fetching training: {str(e)}")  # Debug log
        return jsonify({'message': f'Error fetching training module: {str(e)}'}), 500

@training_bp.route('/training/<module_id>/complete', methods=['POST'])
def complete_training(module_id):
    try:
        # Update training module completion status
        result = mongo.db.trainings.update_one(
            {'_id': ObjectId(module_id)},
            {'$set': {'completed': True, 'completion_date': datetime.now()}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Training module not found'}), 404
            
        return jsonify({'message': 'Training completed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@training_bp.route('/modules', methods=['POST'])
@jwt_required()
def create_module():
    data = request.get_json()
    
    # Create module document
    module = {
        'title': data['title'],
        'description': data['description'],
        'language': data['language'],
        'category': data['category'],
        'content': data['content'],
        'duration': data['duration'],
        'difficulty_level': data['difficulty_level'],
        'created_at': datetime.utcnow(),
        'enrolled_students': []
    }
    
    # Insert module into database
    result = mongo.db.training_modules.insert_one(module)
    
    return jsonify({
        'message': 'Module created successfully',
        'module_id': str(result.inserted_id)
    }), 201

@training_bp.route('/modules/<module_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_in_module(module_id):
    user_id = get_jwt_identity()
    
    # Check if module exists
    module = mongo.db.training_modules.find_one({'_id': module_id})
    if not module:
        return jsonify({'error': 'Module not found'}), 404
    
    # Check if already enrolled
    if user_id in module.get('enrolled_students', []):
        return jsonify({'error': 'Already enrolled in this module'}), 400
    
    # Add enrollment
    mongo.db.training_modules.update_one(
        {'_id': module_id},
        {'$push': {'enrolled_students': user_id}}
    )
    
    return jsonify({'message': 'Enrolled successfully'}), 200

@training_bp.route('/certifications', methods=['POST'])
def issue_certification():
    try:
        data = request.get_json()
        print("Received certificate data:", data)  # Debug log
        
        # Validate required fields
        required_fields = ['module_id', 'certificate_type', 'name', 'module_name']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            print(f"Missing fields: {missing_fields}")  # Debug log
            return jsonify({
                'message': f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Validate certificate type
        if data['certificate_type'] not in ['trainer', 'learner']:
            print(f"Invalid certificate type: {data['certificate_type']}")  # Debug log
            return jsonify({'message': 'Invalid certificate type'}), 400
        
        # For learner certificates, validate score
        if data['certificate_type'] == 'learner':
            if 'score' not in data or not isinstance(data['score'], (int, float)):
                print(f"Invalid score: {data.get('score')}")  # Debug log
                return jsonify({'message': 'Score is required for learner certificates'}), 400
            if not 0 <= data['score'] <= 100:
                print(f"Score out of range: {data['score']}")  # Debug log
                return jsonify({'message': 'Score must be between 0 and 100'}), 400
        
        print("Creating certification with data:", data)  # Debug log
        
        # Create certification document
        certification = Certification(
            module_id=data['module_id'],
            certificate_type=data['certificate_type'],
            name=data['name'],
            module_name=data['module_name'],
            score=data.get('score'),
            trainer_id=data.get('trainer_id')
        )
        
        print("Certification object created:", certification.to_dict())  # Debug log
        
        # Insert certification into database
        result = mongo.db.certifications.insert_one(certification.to_dict())
        print("Certificate created with ID:", result.inserted_id)  # Debug log
        
        return jsonify({
            'message': 'Certification issued successfully',
            'certificate_id': certification.certificate_id
        }), 201
        
    except Exception as e:
        print(f"Error issuing certification: {str(e)}")  # Debug log
        print(f"Error type: {type(e)}")  # Debug log
        print(f"Error args: {e.args}")  # Debug log
        return jsonify({'message': f'Error issuing certification: {str(e)}'}), 500

@training_bp.route('/certifications/<user_id>', methods=['GET'])
@jwt_required()
def get_user_certifications(user_id):
    # Get all certifications for the user
    certifications = list(mongo.db.certifications.find({'user_id': user_id}))
    
    # Convert ObjectId to string
    for cert in certifications:
        cert['_id'] = str(cert['_id'])
    
    return jsonify(certifications), 200

@training_bp.route('/certifications/trainer/<trainer_id>', methods=['GET'])
@jwt_required()
def get_trainer_certifications(trainer_id):
    # Get all certifications issued by the trainer
    certifications = list(mongo.db.certifications.find({
        'trainer_id': trainer_id,
        'certificate_type': 'learner'
    }))
    
    # Convert ObjectId to string
    for cert in certifications:
        cert['_id'] = str(cert['_id'])
    
    return jsonify(certifications), 200

@training_bp.route('/certifications/verify/<certificate_id>', methods=['GET'])
def verify_certificate(certificate_id):
    # Find the certificate
    certificate = mongo.db.certifications.find_one({'certificate_id': certificate_id})
    
    if not certificate:
        return jsonify({'error': 'Certificate not found'}), 404
    
    # Convert ObjectId to string
    certificate['_id'] = str(certificate['_id'])
    
    return jsonify(certificate), 200

@training_bp.route('/training', methods=['POST'])
def create_training():
    try:
        data = request.get_json()
        print("Received training data:", data)  # Log received data
        
        # Validate required fields
        required_fields = ['title', 'description', 'category', 'duration', 
                         'level', 'prerequisites', 'instructor', 'format']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            print("Validation error:", error_msg)
            return jsonify({'message': error_msg}), 400

        # Validate enum fields
        valid_categories = ['Technology', 'Business', 'Healthcare', 'Education']
        valid_levels = ['Beginner', 'Intermediate', 'Advanced']
        valid_formats = ['Online', 'In-person', 'Hybrid']

        if data['category'] not in valid_categories:
            error_msg = f"Invalid category. Must be one of: {', '.join(valid_categories)}"
            print("Validation error:", error_msg)
            return jsonify({'message': error_msg}), 400
            
        if data['level'] not in valid_levels:
            error_msg = f"Invalid level. Must be one of: {', '.join(valid_levels)}"
            print("Validation error:", error_msg)
            return jsonify({'message': error_msg}), 400
            
        if data['format'] not in valid_formats:
            error_msg = f"Invalid format. Must be one of: {', '.join(valid_formats)}"
            print("Validation error:", error_msg)
            return jsonify({'message': error_msg}), 400

        # Create training object
        training = Training(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            duration=data['duration'],
            level=data['level'],
            prerequisites=data['prerequisites'],
            instructor=data['instructor'],
            format=data['format'],
            videoUrl=data.get('videoUrl', '')
        )

        # Convert to dictionary and insert into database
        training_dict = training.to_dict()
        print("Inserting training data:", training_dict)
        
        result = mongo.db.trainings.insert_one(training_dict)
        training_dict['_id'] = str(result.inserted_id)
        
        print("Training created successfully with ID:", result.inserted_id)
        return jsonify(training_dict), 201
        
    except Exception as e:
        print(f"Error creating training: {str(e)}")
        return jsonify({'message': f'Error creating training module: {str(e)}'}), 400

@training_bp.route('/training/<training_id>', methods=['PUT'])
def update_training(training_id):
    try:
        data = request.get_json()
        training = mongo.db.trainings.find_one({'_id': ObjectId(training_id)})
        if not training:
            return jsonify({'message': 'Training module not found'}), 404

        # Validate enum fields if they are being updated
        if 'category' in data:
            valid_categories = ['Technology', 'Business', 'Healthcare', 'Education']
            if data['category'] not in valid_categories:
                return jsonify({'message': 'Invalid category'}), 400

        if 'level' in data:
            valid_levels = ['Beginner', 'Intermediate', 'Advanced']
            if data['level'] not in valid_levels:
                return jsonify({'message': 'Invalid level'}), 400

        if 'format' in data:
            valid_formats = ['Online', 'In-person', 'Hybrid']
            if data['format'] not in valid_formats:
                return jsonify({'message': 'Invalid format'}), 400

        mongo.db.trainings.update_one(
            {'_id': ObjectId(training_id)},
            {'$set': data}
        )
        
        updated_training = mongo.db.trainings.find_one({'_id': ObjectId(training_id)})
        updated_training['_id'] = str(updated_training['_id'])
        return jsonify(updated_training)
    except Exception as e:
        print(f"Error updating training: {str(e)}")
        return jsonify({'message': 'Error updating training module'}), 400

@training_bp.route('/training/<training_id>', methods=['DELETE'])
def delete_training(training_id):
    try:
        result = mongo.db.trainings.delete_one({'_id': ObjectId(training_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Training module not found'}), 404
        return jsonify({'message': 'Training module deleted successfully'})
    except Exception as e:
        print(f"Error deleting training: {str(e)}")
        return jsonify({'message': 'Error deleting training module'}), 500 