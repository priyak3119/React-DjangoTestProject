# Django React Test Project
Frontend (React) Dependencies

react-router-dom
For client-side routing between dashboard pages and login/profile.

axios
For making authenticated API requests to Django backend.

jwt-decode
To decode JWT tokens and extract user_id for permission checks.

bootstrap
For UI styling and layout 


Backend (Django) Dependencies
Main backend framework.
djangorestframework
For building RESTful APIs.

djangorestframework-simplejwt
For JWT-based authentication.

django-cors-headers
To allow frontend (React) to communicate with backend on a different port.
sqlite used

 Challenges You Faced
 Authentication & Permissions
500 error when accessing /api/profile/
→ Caused by UserSerializer trying to access a non-existent method (get_permissions).

JWT decoding errors in frontend

Area	Tool / Fix
Frontend Routing	react-router-dom
API Communication	axios, JWT headers
JWT Management	jwt-decode, simplejwt
UI Permissions	Checkbox state logic, page-action mapping
Backend Logic	Permission model, APIView, serializers
Error Handling	Try/catch in API calls, alerts for feedback
CORS Fixes	django-cors-headers
Auth Enforcement	IsAuthenticated, IsAdminUser
Superadmin Features	User list with permissions, permission editing


username:  admin
email: admin@gmail.com
password: Marian2012

Running the Project

cd/backend  
vertual environment created   
copy the code    .\venv\Scripts\Activate
run the command  python python manage.py runserver

cd/frontend
npm start



Admin can create users
