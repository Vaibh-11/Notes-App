

## 🚀 Setup Instructions

### Prerequisites

* Node.js (>= 18.x)
* npm or yarn
* Database (PostgreSQL / MySQL / MongoDB)

### Installation



### Running the Application

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST = hopper.proxy.rlwy.net
DB_USER = root
DB_PASSWORD = yFPKjUiBRQUnLnYtJlTHnxvKdjLRpFSf
DB_NAME = railway
DB_PORT = 17537
PORT = 5000

JWT_KEY = "MyPrivateKey"




```

---

## 📡 API Documentation

### Base URL


### Endpoints

#### Auth

* `POST /user/signup` → Register user
* `POST /user/login` → Login user
*  `POST /user/logout` → Logout user
* `GET /user/getAllUsers` → Get all users
* `GET /users/logInUser` → Get Logged In user

  #### Post

  * `POST /notes/create` → Create Note
  * * `GET /notes/getAllNotes` → Get all notes
    * `POST /notes/edit/:notes_id` → Edit notes
    * `POST /notes/delete/:notes_id` → RDelete notes
    * `POST /notes/addCollaborator/:notes_id` →Add collab
    * `POST /notes/removeCollaborator/:notes_id/:user_id` → Remove Collab
    * `GET /notes/getCollaborators/:notes_id` → Get collab
    * `GET /notes/getCollaboratorRole` → Get collab Role
    * `POST /notes/share/:noteId` → Share link
    * `POST /notes/public/:token` → Get note

   #### Log
  * `GET /activity/:noteId`-> To get all the logs



#### Example Request

```json
POST /user/login
{
  "email": "test@example.com",
  "password": "123456"
}
```

#### Example Response

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

---

## 🗄️ Database Schema

### Users Table

| Column     | Type       | Description       |
| ---------- | ---------- | ----------------- |
| id         | UUID / INT | Primary Key       |
| name       | VARCHAR    | User name         |
| email      | VARCHAR    | Unique email      |
| password   | VARCHAR    | Hashed password   |
| created_at | TIMESTAMP  | Created timestamp |
| updated_at | TIMESTAMP  | Updated timestamp |

### Relationships

* One-to-Many: User → Posts (if applicable)

---

## 🏗️ Architecture Notes

### Folder Structure

```
src/
 ├── controllers/   # Request handlers    
 ├── routes/        # API routes
 ├── middlewares/   # Custom middleware
 ├── config/        # Configuration files
 └── utils/         # Utility functions
```

### Design Principles

* **Separation of Concerns**
* **Layered Architecture** (Controller → Service → Repository)
* **Reusable Components**
* **Environment-based configuration**

### Flow

1. Client sends request
2. Route handles endpoint
3. Controller processes request
4. Service applies business logic
5. Model interacts with database
6. Response returned to client

---

## 🔐 Security Practices

* Password hashing using bcrypt
* JWT-based authentication
* Input validation & sanitization
* Environment variable protection

---






## 👨‍💻 Author

Vaibhav
