from flask import Blueprint, request, jsonify
from models.certification import Certification
from database import mongo
from datetime import datetime, timedelta

certifications_bp = Blueprint('certifications', __name__)

@certifications_bp.route('/certifications', methods=['POST'])
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

@certifications_bp.route('/certifications/module/<module_id>', methods=['GET'])
def get_module_certificate(module_id):
    try:
        # Find certificate by module_id
        certificate = mongo.db.certifications.find_one({'module_id': module_id})
        
        if not certificate:
            return jsonify({'error': 'Certificate not found'}), 404
            
        # Convert ObjectId to string for JSON serialization
        certificate['_id'] = str(certificate['_id'])
        
        # Format dates
        certificate['issue_date'] = certificate['issue_date'].isoformat()
        certificate['expiry_date'] = certificate['expiry_date'].isoformat()
        
        return jsonify(certificate), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@certifications_bp.route('/certifications/verify/<certificate_id>', methods=['GET'])
def verify_certificate(certificate_id):
    try:
        # Find certificate by certificate_id
        certificate = mongo.db.certifications.find_one({'certificate_id': certificate_id})
        
        if not certificate:
            return jsonify({'error': 'Certificate not found'}), 404
            
        # Check if certificate is expired
        if datetime.now() > certificate['expiry_date']:
            return jsonify({'error': 'Certificate has expired'}), 400
            
        # Convert ObjectId to string for JSON serialization
        certificate['_id'] = str(certificate['_id'])
        
        # Format dates
        certificate['issue_date'] = certificate['issue_date'].isoformat()
        certificate['expiry_date'] = certificate['expiry_date'].isoformat()
        
        return jsonify(certificate), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 