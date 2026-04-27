# Smart LMS & Admission Portal - Backend

A Flask-based REST API server for Smart Learning Management System and Admission Portal with Supabase integration.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── config.py             # Configuration management
│   ├── models/
│   │   └── schemas.py        # Database schemas
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── admissions.py    # Admission endpoints
│   │   ├── lms.py           # Learning management endpoints
│   │   └── admin.py         # Admin analytics endpoints
│   └── services/
│       ├── eligibility.py   # Eligibility checking logic
│       ├── chatbot.py       # AI chatbot service
│       ├── geofence.py      # Geofence validation
│       ├── ocr.py           # Document OCR service
│       └── predictive.py    # Predictive analytics
├── tests/
│   ├── conftest.py          # Test configuration
│   ├── test_auth.py         # Authentication tests
│   ├── test_admissions.py   # Admission tests
│   ├── test_chatbot.py      # Chatbot tests
│   ├── test_geofence.py     # Geofence tests
│   ├── test_lms.py          # LMS tests
│   └── test_eligibility.py  # Eligibility tests
├── run.py                    # Application entry point
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## Features

### Authentication
- Email-based login with role assignment
- JWT token generation and validation
- Role-based access control (RBAC)
- Session management

### Admission Portal
- Application form processing
- Eligibility checking based on marks
- Document OCR scanning
- Application status tracking

### Learning Management System (LMS)
- Attendance marking via QR code
- Geofence-based attendance verification
- AI chatbot for course assistance
- Schedule management

### Analytics & Insights
- Predictive risk scoring
- Student at-risk identification
- Attendance analytics
- Performance tracking

## API Endpoints

### Authentication
```
POST /api/auth/login
  - Email-based login
  - Returns JWT token and user role
```

### Admissions
```
POST /api/admissions/eligibility
  - Check student eligibility
  - Returns eligibility status and message

POST /api/admissions/apply
  - Submit admission application
  - Returns application ID and status

GET /api/admissions/application/:id
  - Get application status
```

### Learning Management
```
POST /api/lms/attendance/scan
  - Mark attendance with geofence
  - Returns marked status

POST /api/lms/chat
  - AI chatbot interaction
  - Returns bot response

GET /api/lms/schedule
  - Get student schedule
```

### Admin Analytics
```
POST /api/admin/predictive-alert
  - Get risk score for student
  - Returns risk analysis

GET /api/admin/at-risk-students
  - Get list of at-risk students
  - Returns student list with risk scores
```

## Services

### Eligibility Service (`app/services/eligibility.py`)
```python
def check_eligibility(obtained_marks, required_marks=60):
    """
    Check if student is eligible for admission
    
    Args:
        obtained_marks: Student's previous exam marks
        required_marks: Minimum marks required
        
    Returns:
        EligibilityResult with eligible flag and message
    """
```

### Geofence Service (`app/services/geofence.py`)
```python
def validate_location(latitude, longitude, campus_lat, campus_lng, radius_km):
    """
    Check if location is within campus geofence
    
    Args:
        latitude, longitude: User's current location
        campus_lat, campus_lng: Campus center coordinates
        radius_km: Geofence radius in kilometers
        
    Returns:
        bool: True if within geofence
    """
```

Campus Location: Karachi (24.8607°N, 67.0011°E)
Geofence Radius: ~2 km

### Chatbot Service (`app/services/chatbot.py`)
```python
def get_ai_response(prompt, course_context):
    """
    Get AI-powered response for course questions
    
    Args:
        prompt: User's question
        course_context: Course for context
        
    Returns:
        dict with response text
    """
```

### Predictive Service (`app/services/predictive.py`)
```python
def calculate_risk_score(attendance, assignments, gpa):
    """
    Calculate risk score for student
    
    Args:
        attendance: Attendance percentage
        assignments: Assignment submission rate
        gpa: Student's GPA
        
    Returns:
        dict with risk_score and message
    """
```

Factors:
- Low attendance (< 60%) - 40 points
- Low assignment submission (< 50%) - 35 points
- Low GPA (< 2.0) - 25 points

Risk Levels:
- Critical: 70-100
- High: 50-69
- Medium: 30-49
- Low: 0-29

### OCR Service (`app/services/ocr.py`)
```python
def process_document(image_data):
    """
    Process document image and extract text
    
    Args:
        image_data: Raw image bytes
        
    Returns:
        dict with extracted text and confidence
    """
```

## Database Schema

### Users Table
- id: UUID
- email: String
- role: Enum (prospective_student, enrolled_student, faculty, admin)
- created_at: Timestamp

### Applications Table
- id: UUID
- student_id: UUID
- status: Enum (draft, submitted, reviewing, approved, rejected)
- marks: Integer
- cnic: String
- program: String

### Attendance Table
- id: UUID
- student_id: UUID
- date: Date
- marked_at: Timestamp
- location: Point (lat, lng)

### Messages Table
- id: UUID
- student_id: UUID
- course: String
- prompt: Text
- response: Text

## Testing

### Running Tests
```bash
pytest
```

### Test Coverage
- Authentication (login, token validation)
- Eligibility checking
- Attendance marking
- Geofence validation
- Chatbot responses
- Admin analytics

### Test Files
- `test_auth.py`: Authentication tests (login, roles)
- `test_admissions.py`: Eligibility tests
- `test_lms.py`: Attendance and geofence tests
- `test_chatbot.py`: AI chatbot tests
- `test_geofence.py`: Location validation tests
- `test_eligibility.py`: Service unit tests

### Example Test
```python
def test_eligibility_pass(client, auth_header):
    response = client.post(
        "/api/admissions/eligibility",
        headers=auth_header,
        json={"previous_marks": 76, "required_marks": 60},
    )
    assert response.status_code == 200
    assert response.get_json()["eligible"] is True
```

## Error Handling

### HTTP Status Codes
- 200: Success
- 400: Bad request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (permission denied)
- 404: Not found
- 500: Server error

### Error Response Format
```json
{
    "error": "Description of the error",
    "message": "User-friendly error message",
    "code": "ERROR_CODE"
}
```

### Common Error Scenarios
- Missing email in login
- Invalid marks value
- Student outside geofence
- Empty chatbot prompt
- Invalid CNIC format

## Security

### Authentication
- JWT tokens with 24-hour expiration
- Secure token storage in Supabase
- Role-based access control
- Token refresh mechanisms

### Input Validation
- Email format validation
- CNIC format validation
- Marks range validation (0-100)
- GPA range validation (0-4.0)
- SQL injection prevention

### Data Protection
- HTTPS for all endpoints
- CORS configuration
- Rate limiting (TODO)
- Request validation
- Sensitive data masking in logs

## Configuration

### Environment Variables
```
FLASK_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

### Development
```bash
FLASK_ENV=development
FLASK_DEBUG=true
```

## Performance

### Optimization
- Database query optimization
- Caching strategy (TODO)
- Async processing for heavy tasks
- Connection pooling

### Monitoring
- Request logging
- Error tracking (TODO)
- Performance metrics (TODO)

## Deployment

### Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "run.py"]
```

### Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrations completed
- [ ] Error logging configured
- [ ] Security headers enabled
- [ ] CORS properly configured

## Development

### Installation
```bash
pip install -r requirements.txt
```

### Running Development Server
```bash
python run.py
```

### Creating Database Migrations
```bash
# Using Alembic or similar
flask db migrate
flask db upgrade
```

## API Documentation

### Request/Response Format
- Content-Type: application/json
- All endpoints require Bearer token (except login)

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Example Request
```bash
curl -X POST https://api.smartlms.com/api/admissions/eligibility \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"previous_marks": 75, "required_marks": 60}'
```

## Troubleshooting

### Database Connection Issues
- Verify Supabase credentials
- Check network connectivity
- Review connection pool settings

### Token Validation Errors
- Token may be expired (24 hours)
- Verify JWT_SECRET configuration
- Check token format in header

### Geofence Not Working
- Verify campus coordinates
- Check coordinate format (decimal degrees)
- Ensure radius calculation is correct

## Contributing

### Code Style
- Follow PEP 8
- Use type hints
- Add docstrings
- Write tests for new features

### Commit Standards
- Descriptive commit messages
- Reference issue numbers
- Keep commits atomic

## Support

For issues:
1. Check logs for error details
2. Review test files for usage examples
3. Verify API endpoint format
4. Contact development team

## License

Proprietary - Smart LMS & Admission Portal
