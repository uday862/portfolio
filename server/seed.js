const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Portfolio = require('./models/Portfolio');

const seedData = {
    profile: {
        name: "GADIGE UDAY KUMAR",
        title: "Bachelor of Technology (B.Tech) – Computer Science Engineering",
        contacts: [
            { icon: "📧", text: "gadigeuday111@gmail.com", link: "mailto:gadigeuday111@gmail.com" },
            { icon: "📞", text: "+919912050265", link: "tel:+919912050265" },
            { icon: "📍", text: "Hyderabad", link: "" },
            { icon: "🔗", text: "leetcode.com/u/gadigeuday123/", link: "https://leetcode.com/u/gadigeuday123/" },
            { icon: "🐙", text: "github.com/uday862", link: "https://github.com/uday862" },
            { icon: "💼", text: "linkedin.com/in/gadigeuday", link: "https://linkedin.com/in/gadigeuday" },
            { icon: "🎂", text: "03-02-2004", link: "" }
        ],
        summary: "Computer Science Engineering student with strong expertise in Java, C++, Python, and full-stack development. Experienced in building end-to-end applications integrating machine learning models with scalable web platforms. Proficient in DevOps practices, cloud deployment (AWS), and system design fundamentals. Passionate about solving complex problems and delivering impactful, real-world software solutions.",
        strengths: [
            "Solid understanding of algorithms, data structures, and designing scalable software systems",
            "Proficient in DevOps workflows, version control (Git/GitHub), and cloud deployment (AWS)",
            "Capable of rapidly learning and working with emerging technologies and frameworks",
            "Ability to deploy scalable applications and seamlessly integrate ML models to enhance functionality"
        ],
        fundamentals: [
            "📘 DSA (Data Structures & Algorithms)",
            "🧩 Object-Oriented Programming (OOP)",
            "⚙️ Operating Systems (OS)",
            "🌍 System Design Basics",
            "🐙 Git & GitHub",
            "☁️ AWS Essentials"
        ],
        devopsHighlights: "✅ DevOps Mindset: Version control with Git, collaborative GitHub workflows, understanding of CI/CD pipelines and deployment automation.\n✅ AWS Exposure: Familiar with EC2 instances, S3 storage, and basics of serverless deployment (Lambda). Currently applying AWS concepts in FinTweet project.\n✅ System Design Fundamentals: Knowledge of horizontal scaling, database indexing, API design patterns, and microservices communication. Focused on building modular and maintainable architectures."
    },
    education: [
        {
            degree: "B.Tech in Computer Science Engineering",
            institution: "KMIT, Hyderabad",
            score: "CGPA: 8.9",
            year: "2023 – 2027"
        },
        {
            degree: "Board of Intermediate",
            institution: "CVRAMAN JUNIOR COLLEGE, Wanaparthy",
            score: "Scored: 987/1000",
            year: "2020 – 2022"
        },
        {
            degree: "Board of Secondary Schooling",
            institution: "BGR High School, Ieeja-Gadwal",
            score: "GPA: 10",
            year: "2019 – 2020"
        }
    ],
    skills: [
        {
            category: "💻 Languages",
            items: "Java, C++, Python"
        },
        {
            category: "🗄️ Databases",
            items: "MySQL, MongoDB"
        },
        {
            category: "🌐 Web & Frameworks",
            items: "HTML, CSS, JavaScript, MERN Stack (React, Node, Express, MongoDB)"
        },
        {
            category: "🤖 ML / Deep Learning",
            items: "Model Development, YOLO, OpenCV, Scikit-learn, Logistic Regression, Random Forest, Flask"
        },
        {
            category: "☁️ DevOps & Cloud",
            items: "Git, GitHub, CI/CD basics, AWS (EC2, S3, Lambda fundamentals)"
        },
        {
            category: "🏗️ System Design",
            items: "Basics of scalable architecture, load balancing, database design principles"
        }
    ],
    projects: [
        {
            title: "IPL Match Outcome Prediction",
            tech: "ML • Python • Scikit-learn • Flask • Git",
            description: "Built a machine learning pipeline to predict IPL match results using historical data. Applied Logistic Regression and Random Forest with feature engineering and preprocessing. Evaluated performance using accuracy and log-loss.",
            bullets: [
                "Deployed the model as a live web application on Render: ipl-match-prediction-kq51.onrender.com",
                "Used Git/GitHub for version control and collaborated on iterative model improvements.",
                "Tech stack: Python, Scikit-learn, Flask, HTML/CSS, Git workflows."
            ],
            links: ["https://ipl-match-prediction-kq51.onrender.com"]
        },
        {
            title: "AI-Based Attendance Tracker (YOLO + Manual)",
            tech: "YOLOv8 • React • Node • Flask • MongoDB • Git",
            description: "Designed an AI-powered attendance system using YOLOv8 for real-time face detection and recognition. Integrated React.js frontend, Node.js middleware, and Flask + OpenCV backend. Implemented dual modes: automatic recognition + manual fallback.",
            bullets: [
                "Built dashboards for Admin/Teachers with secure MongoDB storage and CSV report exports.",
                "Supported video uploads and touchless attendance — research project at KMIT, Hyderabad.",
                "Used GitHub for version control, feature branching, and CI/CD awareness for deployment readiness."
            ],
            links: []
        },
        {
            title: "FinTweet – Financial Tweet Sentiment Analysis",
            tech: "MERN • Python • VADER • SOFNN • Twitter API • AWS",
            description: "Developing a sentiment analysis system for financial tweets using VADER, TextBlob, and SOFNN to classify tweets into positive, negative, and neutral categories. Implementing text preprocessing and feature extraction techniques.",
            bullets: [
                "Building a MERN stack web application enabling users to search stock/company keywords and view real-time sentiment insights.",
                "Integrating Git/GitHub for code management, planning to deploy backend services on AWS (EC2/S3) for scalability.",
                "Exploring system design basics: decoupling ML microservice from frontend, API rate limiting considerations."
            ],
            links: []
        }
    ],
    achievements: [
        {
            title: "🏆 450+ LeetCode Problems",
            description: "Solved over 450 data structures & algorithms problems, demonstrating strong analytical and coding proficiency."
        },
        {
            title: "⚡ Hackathon Participant",
            description: "Actively participated in multiple hackathons, building innovative software solutions under time constraints and collaborating effectively."
        }
    ]
};

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio');
        
        console.log('MongoDB connected for seeding...');
        
        // Clear existing data
        await Portfolio.deleteMany({});
        console.log('Cleared existing portfolio data.');
        
        // Insert seed data
        const newPortfolio = new Portfolio(seedData);
        await newPortfolio.save();
        
        console.log('✅ Seed data successfully inserted!');
        
    } catch (err) {
        console.error('❌ Error seeding database:', err);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

seedDatabase();
