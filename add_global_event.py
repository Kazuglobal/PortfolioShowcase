from app import app, db
from models import Event
from datetime import datetime

def add_global_education_event():
    """Add the global education event to the database."""
    with app.app_context():
        # Check if the event already exists to avoid duplicates
        existing_event = db.session.query(Event).filter_by(
            title='多様性を通じたグローバル人材育成').first()
        
        if existing_event:
            print("Event already exists, skipping...")
            return
        
        # Create new global event
        global_event = Event(
            title='多様性を通じたグローバル人材育成',
            description='茨城高校で東大留学生と「カルチャーブリッジ」を実施。異文化交流、問題解決、未来構想で高校生のグローバル人材育成を促進。多様性理解と批判的思考力を養う革新的な国際教育プログラム。',
            date=datetime(2025, 2, 15, 14, 0),  # February 15, 2025, 14:00
            location='https://globalbunny.jp/global-education/',
            image_url='/static/images/global_education_event.png',
            category='global'  # Mark as a global event
        )
        
        # Add and commit to database
        db.session.add(global_event)
        db.session.commit()
        
        print("Global education event added successfully!")

if __name__ == "__main__":
    add_global_education_event()