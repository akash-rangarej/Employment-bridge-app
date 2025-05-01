from datetime import datetime
from database import mongo

class User:
    def __init__(self, name, email, role="user"):
        self.name = name
        self.email = email
        self.role = role
        self.created_at = datetime.now()

    def to_dict(self):
        return {
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at
        }

    @staticmethod
    def from_dict(data):
        return User(
            name=data.get('name'),
            email=data.get('email'),
            role=data.get('role', 'user')
        ) 