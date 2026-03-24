const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: String,
    title: String,
    photoUrl: String,
    resumeUrl: String,
    photoSize: { type: Number, default: 200 },
    contacts: [{ icon: String, text: String, link: String }],
    summary: String,
    strengths: [String],
    fundamentals: [String],
    devopsHighlights: String
});

const EducationSchema = new mongoose.Schema({
    degree: String,
    institution: String,
    score: String,
    year: String
});

const SkillCategorySchema = new mongoose.Schema({
    category: String,
    items: String
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    tech: String,
    description: String,
    bullets: [String],
    links: [String]
});

const AchievementSchema = new mongoose.Schema({
    title: String,
    description: String
});

const PortfolioSchema = new mongoose.Schema({
    profile: ProfileSchema,
    education: [EducationSchema],
    skills: [SkillCategorySchema],
    projects: [ProjectSchema],
    achievements: [AchievementSchema],
    visitors: { type: Number, default: 0 },
    admin: {
        username: { type: String, default: 'admin' },
        password: { type: String, default: 'admin123' }
    }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
