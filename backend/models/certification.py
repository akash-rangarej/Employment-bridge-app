from datetime import datetime
import uuid

class Certification:
    def __init__(self, module_id, certificate_type, name, module_name, score=None, trainer_id=None):
        self.certificate_id = str(uuid.uuid4())
        self.module_id = module_id
        self.module_name = module_name
        self.certificate_type = certificate_type
        self.name = name
        self.score = score
        self.trainer_id = trainer_id
        self.issue_date = datetime.utcnow()
        self.expiry_date = datetime.utcnow().replace(year=datetime.utcnow().year + 1)

    def to_dict(self):
        return {
            'certificate_id': self.certificate_id,
            'module_id': self.module_id,
            'module_name': self.module_name,
            'certificate_type': self.certificate_type,
            'name': self.name,
            'score': self.score,
            'trainer_id': self.trainer_id,
            'issue_date': self.issue_date,
            'expiry_date': self.expiry_date
        }

    @staticmethod
    def from_dict(data):
        return Certification(
            module_id=data['module_id'],
            certificate_type=data['certificate_type'],
            name=data['name'],
            module_name=data['module_name'],
            score=data.get('score'),
            trainer_id=data.get('trainer_id')
        ) 