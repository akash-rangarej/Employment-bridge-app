from datetime import datetime
from database import mongo

class Job:
    def __init__(self, title, company, description, location, sector, salary_range, job_type):
        self.title = title
        self.company = company
        self.description = description
        self.location = location
        self.sector = sector
        self.salary_range = salary_range
        self.job_type = job_type
        self.posted_date = datetime.utcnow()
        self.status = 'active'

    def to_dict(self):
        return {
            'title': self.title,
            'company': self.company,
            'description': self.description,
            'location': self.location,
            'sector': self.sector,
            'salary_range': self.salary_range,
            'job_type': self.job_type,
            'posted_date': self.posted_date.isoformat(),
            'status': self.status
        }

    @staticmethod
    def from_dict(data):
        return Job(
            title=data['title'],
            company=data['company'],
            description=data['description'],
            location=data['location'],
            sector=data['sector'],
            salary_range=data['salary_range'],
            job_type=data['job_type']
        ) 