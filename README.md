# 🧾 AmberFriends API – Setup & Run with Docker

## 📦 Technologies

- Node.js + Express
- TypeORM
- PostgreSQL (Dockerized)
- JWT Authentication
- Docker + Docker Compose
- TypeScript

---

## 🚀 How to Run the Project with Docker

### 🔧 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

### 🛠️ Step 1: Clone the Repository

```bash
git clone https://github.com/raphaelbravo19/AmberFriends.git
cd AmberFriends
```

---

### 🛠️ Step 2: Build and Start the Services

```bash
docker-compose up --build -d
```

This will start:

- PostgreSQL on port `5432`
- The API on `http://localhost:3000`

---

### 🔄 To Stop the Services

```bash
docker-compose down -v
```
---

## 📚 API Reference

You can explore and test the API using the following Postman collection:

[👉 View Postman Collection](https://www.postman.com/amberraphael/workspace/amberfriends/collection/4008427-48e90047-8d69-4035-910d-f0f449b0c2cd?action=share&creator=4008427&active-environment=4008427-49d81c78-b8cf-4fc3-b149-6873b9ef4aa1)

---

## 🧠 Considerations

- To represent friendship relationships, a **bidirectional approach** was used: when a user adds another as a friend, two entries are created in the `friendships` table with inverted `userId` and `friendId`. This simplifies retrieval of friend lists, moving the complexity to the moment of insertion.
- **TypeORM** was chosen to simplify database queries and reduce the risk of SQL injection through parameterized and ORM-safe operations.

---

## 🚧 Next Steps

- It is recommended to **decouple the PostgreSQL database service from the Express app** in the `docker-compose` file. If deploying to an AWS EC2 instance, you can either:
  - Clone the repository and run the app using Docker Compose, or
  - Build and push the image to a container registry and run it from there on the instance.
  Additionally, an NGINX or similar reverse proxy should be configured for production.

- For better control and isolation, it is advisable to **move the PostgreSQL database to an AWS RDS instance**. You will need to update the environment variables in your Docker configuration to point to the RDS host and credentials.

- If traffic increases, consider **setting up an Auto Scaling Group** based on your main instance's template. This allows dynamic provisioning of new EC2 instances based on load, managed through a Load Balancer.

- If a **profile photo upload feature** is added, it is recommended to offload that task to an AWS Lambda function. The function can handle image uploads, save them to an S3 bucket, and optionally process them (e.g., generate thumbnails) without affecting the main application.
