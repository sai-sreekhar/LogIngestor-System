<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#using-hosted-demo">Using Hosted Demo</a></li>
        <li><a href="#how-to-run-the-project-locally">How to run the project locally</a></li>
      </ul>
    </li>
    <li><a href="#system-design">System Design</a></li>
    <li><a href="#features-implemented">Features Implemented</a></li>
    <li><a href="#demo">Demo</a></li>
    <li><a href="#open-issues">Open Issues</a></li>
    <li><a href="#solution-showcase">Solution Showcase</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This repository includes the Sources code of the logIngestor system i.e given as an assignment by Dyte for SDE Internship role.
This repository contains the Source code of both frontend and backend application.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Fastify][Fastify.js]][Fastify-url]
* [![React][React.js]][Fastify-url]
* [![Node][Node.js]][Node-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![AWS][AWS]][AWS-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Using Hosted Demo

This project is hosted on AWS. You can access the project using the link https://logs.eventwhiz.site. 

Use the below credentials to login as Admin.\
username: admin\
password: admin

After Logging to the demo you can do the below steps\
1. You can query the logs using intuitive query builder.
2.  Add a Sub-Admin and give the access to logs of a specific resourceId.
3.  You can ingest the logs by send http post or put request to the url http://ingest.eventwhiz.site:3000/ \
Below is the sample curl request:
```
curl --location 'http://ingest.eventwhiz.site:3000/' \
--header 'Content-Type: application/json' \
--data '{
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
        "parentResourceId": "server-0987"
    }
}'
```

### How to run the project locally

1. Please install the latest versions of Node, NPM and Yarn.
2. Clone this repo
3. Run the frontend project using below steps
    ```sh
   cd frontend
   yarn install
   yarn run dev
   ```
4. Run the backend project using the below steps
   ```sh
   cd backend
   yarn install
   yarn start
   ```
5. By default frontend code is pointed to backend hosted on aws. If you want to connect frontend code to locally running backend please change the ``API_V1_BASE_URL`` variable in file ``/frontend/utils/constants.js``
   
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## System Design

![systemDesign](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/6cb492d6-4741-4468-a44b-d0eabd03002c)

### Backend Design

- The ``load balancer`` serves as the entry point to the system for both log ingestion and log query.
- Fastify-NodeJS app is deployed on EC2 instances. This application handles the ingested logs and also log queries. ``Fastify`` is selected due to its ``very high performance compared to expressJS`` which is very critical in handling large volumes of log data
- The ``EC2 instances`` hosting the NodeJS app are ``dynamically scaled out and in`` based on the system load, using AWS Auto Scaling Groups.
- Mongo DB is used to store the user data (Login credentials and roles for role-based access)
- Logs are ingested in realtime to kinesis firehose. ``Firehose`` is a fully managed service for delivering realtime ``streaming data`` with ``high performance and scalability``.
- Kinesis Firehose delivers logs to ``OpenSearch`` in ``microbatch`` mode, with log ingestion occurring either every 5 minutes or when the log size reaches 5 megabytes.`\
- Logs are indexed in opensearch for efficient searching. Each index of open search will be split in to ``multiple shards for better performance``. Each shard is a apache lucene index.
- Logs are ``backedup`` in AWS S3 for longterm storage

### Frontend Design

- WebUI is implemented using React.
- ReactApp is built and deployed in AWS S3. Cloudfront is used to access the app using a custom domain. Deploying the WebUI on ``AWS S3 and CloudFront`` ensures a high level of ``scalability`` and ``availability`` while minimizing costs and ``management overhead``

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features Implemented

- Ingest Logs via HTTP server
- Web UI for Querying logs
- Filter logs based on level, message, resource-id and other fields
- Fulltext search across logs
- Search logs in a specific date range
- Combining multiple filters for log query
- Regex based string search. Also contains, beginswith and endswith operators are supported
- Near realtime ingestion and query (Microbatch ingestion for every 5 mins)
- Role-based access for querying logs. (Admin can add a new user with sub-admin role and give permission for the logs based on resourceId

## Demo

![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/aaded76b-8917-48ad-b440-94b02bd81f12)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/c2832a28-9cf6-49cf-afc5-119fda2faa00)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/a215b8f8-85eb-4a43-b084-c87530774792)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/d5e7e9af-24fc-4599-b68f-c58b661f001d)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/b8482a16-207f-44b3-b51d-122c73848c4f)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/d102ba0e-3650-4a40-9bbf-5c324fb2c394)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/0679c879-bf63-402b-9e98-a86b42f8a5fe)
![image](https://github.com/dyte-submissions/november-2023-hiring-sai-sreekhar/assets/91886335/95bf58d6-6007-4b00-a5a0-bbf4cae14c46)



## Open Issues

- In Regex string search and in contains, beginswith and endswith operators, hypen is not supported. This is because hypen in search term is conflicting with regex keyword hypen. Escaping of hypen is not working and I am not able to solve the issue in limited time.
- Only limited regex is supported/tested due to time constraints. Logs can be searched using regex wildcard operators like .*.
- Mongodb atlas is used to store user data. I am using MongoDB free plan which is not stable and connection timeout is observed randomly
- I have provisioned minimal AWS resources due to budget constraints. A single t3.small instance is running for the log handler app. If sudden burst of logs are ingested, then the log ingestion may fail since it takes 3-4 mins for the AWS auto scaling to start a new instance. Similarly I have provisioned t3.small instance for opensearch.

## Solution Showcase:

https://drive.google.com/drive/folders/1ByRhmT3hvILIbYFhuG4DIxNAwpCe0SGX?usp=drive_link

Youtube Link fr demo: https://www.youtube.com/watch?v=M_iQ14doo-Q

<!-- CONTACT -->
## Contact

Name - Sai Sreekar Godala \
Email - sai.sreekhar@gmail.com \
Linkedin - https://www.linkedin.com/in/sai-sreekar

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Fastify-url]: https://fastify.dev/
[Fastify.js]: https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white
[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[AWS]: https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-url]: https://aws.amazon.com
