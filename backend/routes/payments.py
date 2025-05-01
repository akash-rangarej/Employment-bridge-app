from flask import Blueprint, request, jsonify
from database import mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/', methods=['GET'])
@jwt_required()
def get_payments():
    try:
        user_id = get_jwt_identity()
        payments = list(mongo.db.payments.find({"user_id": user_id}))
        for payment in payments:
            payment['_id'] = str(payment['_id'])
        return jsonify(payments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.route('/create-payment', methods=['POST'])
@jwt_required()
def create_payment():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Create payment document
    payment = {
        'job_id': data['job_id'],
        'amount': data['amount'],
        'status': 'pending',
        'payer_id': user_id,
        'payee_id': data['payee_id'],
        'created_at': datetime.utcnow(),
        'payment_type': data.get('payment_type', 'escrow'),
        'description': data.get('description', '')
    }
    
    # Insert payment into database
    result = db.payments.insert_one(payment)
    
    # Here you would integrate with a payment gateway
    # For now, we'll just return the payment ID
    
    return jsonify({
        'message': 'Payment created successfully',
        'payment_id': str(result.inserted_id)
    }), 201

@payments_bp.route('/release-payment/<payment_id>', methods=['POST'])
@jwt_required()
def release_payment(payment_id):
    user_id = get_jwt_identity()
    
    # Find payment
    payment = db.payments.find_one({'_id': payment_id})
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404
    
    # Verify user is the payer
    if payment['payer_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Update payment status
    db.payments.update_one(
        {'_id': payment_id},
        {
            '$set': {
                'status': 'completed',
                'completed_at': datetime.utcnow()
            }
        }
    )
    
    return jsonify({'message': 'Payment released successfully'}), 200

@payments_bp.route('/dispute/<payment_id>', methods=['POST'])
@jwt_required()
def create_dispute(payment_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Find payment
    payment = db.payments.find_one({'_id': payment_id})
    if not payment:
        return jsonify({'error': 'Payment not found'}), 404
    
    # Create dispute document
    dispute = {
        'payment_id': payment_id,
        'reporter_id': user_id,
        'reason': data['reason'],
        'description': data['description'],
        'status': 'open',
        'created_at': datetime.utcnow(),
        'evidence': data.get('evidence', [])
    }
    
    # Insert dispute into database
    result = db.disputes.insert_one(dispute)
    
    # Update payment status
    db.payments.update_one(
        {'_id': payment_id},
        {'$set': {'status': 'disputed'}}
    )
    
    return jsonify({
        'message': 'Dispute created successfully',
        'dispute_id': str(result.inserted_id)
    }), 201

@payments_bp.route('/transactions/<user_id>', methods=['GET'])
@jwt_required()
def get_user_transactions(user_id):
    # Get all transactions where user is either payer or payee
    transactions = list(db.payments.find({
        '$or': [
            {'payer_id': user_id},
            {'payee_id': user_id}
        ]
    }))
    
    # Convert ObjectId to string
    for transaction in transactions:
        transaction['_id'] = str(transaction['_id'])
    
    return jsonify(transactions), 200 