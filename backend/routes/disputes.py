from flask import Blueprint, request, jsonify
from database import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

disputes_bp = Blueprint('disputes', __name__)

@disputes_bp.route('/', methods=['GET'])
@jwt_required()
def get_disputes():
    try:
        user_id = get_jwt_identity()
        disputes = list(mongo.db.disputes.find({"user_id": user_id}))
        for dispute in disputes:
            dispute['_id'] = str(dispute['_id'])
        return jsonify(disputes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@disputes_bp.route('/<dispute_id>', methods=['GET'])
@jwt_required()
def get_dispute(dispute_id):
    dispute = mongo.db.disputes.find_one({'_id': dispute_id})
    
    if not dispute:
        return jsonify({'error': 'Dispute not found'}), 404
    
    dispute['_id'] = str(dispute['_id'])
    return jsonify(dispute), 200

@disputes_bp.route('/<dispute_id>/resolve', methods=['POST'])
@jwt_required()
def resolve_dispute(dispute_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Find dispute
    dispute = mongo.db.disputes.find_one({'_id': dispute_id})
    if not dispute:
        return jsonify({'error': 'Dispute not found'}), 404
    
    # Update dispute status
    mongo.db.disputes.update_one(
        {'_id': dispute_id},
        {
            '$set': {
                'status': 'resolved',
                'resolution': data['resolution'],
                'resolved_by': user_id,
                'resolved_at': datetime.utcnow()
            }
        }
    )
    
    # Update payment status based on resolution
    if data['resolution'] == 'refund':
        mongo.db.payments.update_one(
            {'_id': dispute['payment_id']},
            {'$set': {'status': 'refunded'}}
        )
    elif data['resolution'] == 'release':
        mongo.db.payments.update_one(
            {'_id': dispute['payment_id']},
            {'$set': {'status': 'completed'}}
        )
    
    return jsonify({'message': 'Dispute resolved successfully'}), 200

@disputes_bp.route('/<dispute_id>/add-evidence', methods=['POST'])
@jwt_required()
def add_evidence(dispute_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Find dispute
    dispute = mongo.db.disputes.find_one({'_id': dispute_id})
    if not dispute:
        return jsonify({'error': 'Dispute not found'}), 404
    
    # Add evidence
    evidence = {
        'user_id': user_id,
        'description': data['description'],
        'attachments': data.get('attachments', []),
        'added_at': datetime.utcnow()
    }
    
    mongo.db.disputes.update_one(
        {'_id': dispute_id},
        {'$push': {'evidence': evidence}}
    )
    
    return jsonify({'message': 'Evidence added successfully'}), 200

@disputes_bp.route('/<dispute_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(dispute_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Find dispute
    dispute = mongo.db.disputes.find_one({'_id': dispute_id})
    if not dispute:
        return jsonify({'error': 'Dispute not found'}), 404
    
    # Add comment
    comment = {
        'user_id': user_id,
        'content': data['content'],
        'created_at': datetime.utcnow()
    }
    
    mongo.db.disputes.update_one(
        {'_id': dispute_id},
        {'$push': {'comments': comment}}
    )
    
    return jsonify({'message': 'Comment added successfully'}), 200 