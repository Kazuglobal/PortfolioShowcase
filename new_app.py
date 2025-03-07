import os
import logging
import requests
from datetime import datetime
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for, Response
from flask_sqlalchemy import SQLAlchemy
from markupsafe import Markup

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

logger.debug(f"Using database: {app.config['SQLALCHEMY_DATABASE_URI']}")

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define models
class Event(db.Model):
    __tablename__ = 'event'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(50), default='ai')
    url = db.Column(db.String(255), default='https://globalbunny.vercel.app/')
    report_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.strftime('%Y-%m-%d %H:%M:%S'),
            'location': self.location,
            'image_url': self.image_url,
            'category': self.category,
            'url': self.url,
            'report_url': self.report_url,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Work(db.Model):
    __tablename__ = 'work'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url,
            'category': self.category,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Contact(db.Model):
    __tablename__ = 'contact'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'created_at': self.created_at.isoformat()
        }

@app.template_filter('nl2br')
def nl2br(value):
    return Markup(value.replace('\n', '<br>'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/portfolio')
def portfolio():
    works = Work.query.order_by(Work.created_at.desc()).all()
    return render_template('portfolio.html', projects=works)

@app.route('/events')
def events():
    # Get all events
    all_events = Event.query.all()
    
    # Separate events by category and date
    now = datetime.utcnow()
    past_ai_events = [e for e in all_events if e.date < now and e.category and e.category.lower() == 'ai']
    past_global_events = [e for e in all_events if e.date < now and e.category and e.category.lower() == 'global']
    upcoming_events = [e for e in all_events if e.date >= now]
    
    # Sort events by date
    past_ai_events.sort(key=lambda x: x.date, reverse=True)
    past_global_events.sort(key=lambda x: x.date, reverse=True)
    upcoming_events.sort(key=lambda x: x.date)

    # Debug logging
    logger.debug(f"Found {len(past_ai_events)} past AI events")
    logger.debug(f"Found {len(past_global_events)} past global events")
    logger.debug(f"Found {len(upcoming_events)} upcoming events")
    logger.debug(f"Total events: {len(all_events)}")

    return render_template(
        'events.html',
        past_events=past_ai_events,
        past_global_events=past_global_events,
        upcoming_events=upcoming_events
    )

@app.route('/about')
def about():
    try:
        url = 'https://globalbunny.vercel.app'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return render_template('about.html', content=response.text)
    except Exception as e:
        logger.error(f"Error fetching content: {str(e)}")
        return render_template('about.html', error=str(e))

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        try:
            contact = Contact(
                name=request.form['name'],
                email=request.form['email'],
                message=request.form['message']
            )
            db.session.add(contact)
            db.session.commit()
            flash('メッセージが送信されました。ありがとうございます！', 'success')
            return redirect(url_for('contact'))
        except Exception as e:
            flash('エラーが発生しました。もう一度お試しください。', 'error')
            logger.error(f"Contact form error: {str(e)}")
            return redirect(url_for('contact'))

    return render_template('contact.html')

# Add a test route to check if the app is running
@app.route('/test')
def test():
    return "App is running!"

if __name__ == '__main__':
    print("Starting application...")
    with app.app_context():
        db.create_all()
        print("Database tables created.")
    print(f"Running on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)