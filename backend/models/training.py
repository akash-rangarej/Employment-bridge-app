from datetime import datetime
from database import mongo

class Training:
    def __init__(self, title, description, category, duration, level, prerequisites, instructor, format, videoUrl):
        self.title = title
        self.description = description
        self.category = category
        self.duration = duration
        self.level = level
        self.prerequisites = prerequisites
        self.instructor = instructor
        self.format = format
        self.videoUrl = videoUrl
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'duration': self.duration,
            'level': self.level,
            'prerequisites': self.prerequisites,
            'instructor': self.instructor,
            'format': self.format,
            'videoUrl': self.videoUrl,
            'created_at': self.created_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return Training(
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