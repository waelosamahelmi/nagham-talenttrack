// AI Service for resume parsing, candidate scoring, and intelligent analysis

import OpenAI from 'openai';
import { DEFAULT_MODEL, getOptimalModel } from './modelConfig';

// Initialize OpenRouter client (compatible with OpenAI SDK)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true // Note: In production, AI calls should go through backend
});

export interface ResumeParsingResult {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    certifications: string[];
    languages: string[];
  };
  summary: string;
  totalExperience: number;
  keyStrengths: string[];
  potentialConcerns: string[];
}

export interface CandidateScore {
  overallScore: number;
  breakdown: {
    experience: number;
    skills: number;
    education: number;
    culturalFit: number;
    communication: number;
  };
  reasoning: string;
  recommendations: string[];
  redFlags: string[];
  strengths: string[];
  improvementAreas: string[];
}

export interface JobMatch {
  matchPercentage: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  reasoning: string;
  missingSkills: string[];
  matchingSkills: string[];
  recommendations: string[];
}

class AIService {
  private async callOpenAI(messages: any[], temperature = 0.7, maxTokens = 2000, taskType: 'parsing' | 'analysis' | 'chat' | 'generation' = 'analysis') {
    try {
      const model = getOptimalModel(taskType);
      
      console.log('🚀 OpenRouter API Call:', {
        model,
        taskType,
        temperature,
        maxTokens,
        messagesCount: messages.length,
        apiKeyConfigured: !!import.meta.env.VITE_OPENROUTER_API_KEY
      });
      
      const response = await openai.chat.completions.create({
        model, // Dynamic model selection based on task
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      const content = response.choices[0]?.message?.content || '';
      console.log('✅ OpenRouter API Response received:', {
        contentLength: content.length,
        model: response.model,
        usage: response.usage
      });
      
      return content;
    } catch (error) {
      console.error('❌ OpenRouter API error:', error);
      throw new Error('AI service temporarily unavailable');
    }
  }

  // Parse resume text and extract structured data
  async parseResume(resumeText: string): Promise<ResumeParsingResult> {
    const prompt = `
      Analyze the following resume and extract structured information. Return a JSON object with the exact structure shown below.
      
      Resume text:
      ${resumeText}
      
      Extract and return JSON in this exact format:
      {
        "personalInfo": {
          "name": "",
          "email": "",
          "phone": "",
          "location": "",
          "linkedIn": "",
          "portfolio": ""
        },
        "experience": [
          {
            "company": "",
            "position": "",
            "duration": "",
            "startDate": "",
            "endDate": "",
            "description": "",
            "achievements": []
          }
        ],
        "education": [
          {
            "institution": "",
            "degree": "",
            "field": "",
            "graduationYear": "",
            "gpa": ""
          }
        ],
        "skills": {
          "technical": [],
          "soft": [],
          "certifications": [],
          "languages": []
        },
        "summary": "",
        "totalExperience": 0,
        "keyStrengths": [],
        "potentialConcerns": []
      }
      
      Important: 
      - Calculate totalExperience in years
      - Extract actual achievements and quantify them where possible
      - Identify potential red flags (gaps, job hopping, etc.)
      - Be thorough but accurate
    `;

    const messages = [
      {
        role: "system",
        content: "You are an expert HR professional and resume parser. Extract structured data accurately from resumes and provide professional insights."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages, 0.3, 3000, 'parsing');
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to parse resume. Please try again.');
    }
  }

  // Score candidate based on job requirements
  async scoreCandidateForPosition(
    candidateData: any,
    jobRequirements: string,
    additionalNotes?: string
  ): Promise<CandidateScore> {
    const prompt = `
      Evaluate this candidate for the following position and provide a comprehensive scoring analysis.
      
      CANDIDATE DATA:
      ${JSON.stringify(candidateData, null, 2)}
      
      JOB REQUIREMENTS:
      ${jobRequirements}
      
      ${additionalNotes ? `ADDITIONAL CONTEXT:\n${additionalNotes}` : ''}
      
      Provide a detailed scoring analysis in JSON format:
      {
        "overallScore": 0-100,
        "breakdown": {
          "experience": 0-100,
          "skills": 0-100,
          "education": 0-100,
          "culturalFit": 0-100,
          "communication": 0-100
        },
        "reasoning": "Detailed explanation of the overall score",
        "recommendations": ["Specific recommendations for this candidate"],
        "redFlags": ["Any concerns or warning signs"],
        "strengths": ["Key strengths that make them suitable"],
        "improvementAreas": ["Areas where candidate could improve"]
      }
      
      Consider:
      - Relevant experience quality and duration
      - Technical and soft skills alignment
      - Educational background relevance
      - Career progression and achievements
      - Communication skills based on resume quality
      - Cultural fit indicators
    `;

    const messages = [
      {
        role: "system",
        content: "You are a senior HR professional with expertise in candidate evaluation and talent assessment. Provide fair, unbiased, and comprehensive candidate scoring."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages, 0.5, 2000, 'analysis');
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI scoring response:', error);
      throw new Error('Failed to score candidate. Please try again.');
    }
  }

  // Calculate job match percentage
  async calculateJobMatch(
    candidateData: any,
    jobDescription: string
  ): Promise<JobMatch> {
    const prompt = `
      Calculate how well this candidate matches the job requirements.
      
      CANDIDATE:
      ${JSON.stringify(candidateData, null, 2)}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Return analysis in JSON format:
      {
        "matchPercentage": 0-100,
        "skillsMatch": 0-100,
        "experienceMatch": 0-100,
        "educationMatch": 0-100,
        "reasoning": "Detailed explanation of match calculation",
        "missingSkills": ["Skills required but not possessed"],
        "matchingSkills": ["Skills that align well"],
        "recommendations": ["Suggestions to improve match or interview focus"]
      }
    `;

    const messages = [
      {
        role: "system",
        content: "You are an AI recruitment specialist. Calculate precise job-candidate matching scores."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages, 0.3, 1500, 'analysis');
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse job match response:', error);
      throw new Error('Failed to calculate job match. Please try again.');
    }
  }

  // Generate interview questions based on candidate and role
  async generateInterviewQuestions(
    candidateData: any,
    jobRole: string,
    focusAreas?: string[]
  ): Promise<{
    technical: string[];
    behavioral: string[];
    situational: string[];
    roleSpecific: string[];
    followUpSuggestions: Record<string, string[]>;
  }> {
    const prompt = `
      Generate targeted interview questions for this candidate based on their background and the role.
      
      CANDIDATE BACKGROUND:
      ${JSON.stringify(candidateData, null, 2)}
      
      JOB ROLE: ${jobRole}
      
      ${focusAreas ? `FOCUS AREAS: ${focusAreas.join(', ')}` : ''}
      
      Generate questions in JSON format:
      {
        "technical": ["5-7 technical questions based on their skills"],
        "behavioral": ["5-7 behavioral questions"],
        "situational": ["3-5 situational questions relevant to the role"],
        "roleSpecific": ["3-5 questions specific to this job role"],
        "followUpSuggestions": {
          "question1": ["follow-up questions"],
          "question2": ["follow-up questions"]
        }
      }
      
      Make questions:
      - Specific to their experience level
      - Relevant to the job requirements
      - Designed to reveal both strengths and growth areas
      - Include scenario-based questions
    `;

    const messages = [
      {
        role: "system",
        content: "You are an experienced interviewer and talent acquisition specialist. Create insightful, fair interview questions."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages, 0.6, 2500, 'generation');
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse interview questions response:', error);
      throw new Error('Failed to generate interview questions. Please try again.');
    }
  }

  // Analyze candidate communication skills from resume/cover letter
  async analyzeCommunicationSkills(text: string): Promise<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    writingQuality: number;
    clarity: number;
    professionalism: number;
  }> {
    const prompt = `
      Analyze the communication skills demonstrated in this text (resume/cover letter):
      
      "${text}"
      
      Return analysis in JSON format:
      {
        "score": 0-100,
        "strengths": ["Communication strengths observed"],
        "weaknesses": ["Areas needing improvement"],
        "suggestions": ["Specific improvement suggestions"],
        "writingQuality": 0-100,
        "clarity": 0-100,
        "professionalism": 0-100
      }
      
      Evaluate:
      - Grammar and spelling
      - Clarity of expression
      - Professional tone
      - Structure and organization
      - Vocabulary usage
      - Conciseness vs completeness
    `;

    const messages = [
      {
        role: "system",
        content: "You are a communication skills expert and language assessment specialist."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const response = await this.callOpenAI(messages, 0.4, 1000, 'analysis');
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse communication analysis response:', error);
      throw new Error('Failed to analyze communication skills. Please try again.');
    }
  }

  // Generate personalized rejection/feedback email
  async generateCandidateFeedback(
    candidateData: any,
    interviewFeedback: string,
    isPositive: boolean
  ): Promise<string> {
    const prompt = `
      Generate a ${isPositive ? 'positive offer' : 'constructive rejection'} email for this candidate.
      
      CANDIDATE: ${candidateData.name}
      POSITION: ${candidateData.appliedPosition || 'Applied Position'}
      
      INTERVIEW FEEDBACK:
      ${interviewFeedback}
      
      Generate a professional, empathetic email that:
      ${isPositive 
        ? '- Congratulates them on their success\n- Outlines next steps\n- Maintains excitement about joining the team'
        : '- Provides constructive feedback\n- Highlights their strengths\n- Encourages future applications\n- Maintains positive company relationship'
      }
      
      Keep it:
      - Professional but warm
      - Specific to their performance
      - Encouraging
      - Company brand-appropriate
    `;

    const messages = [
      {
        role: "system",
        content: "You are a senior HR professional skilled in candidate communication and relationship management."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.callOpenAI(messages, 0.7, 1200, 'generation');
  }

  // Generic text generation method
  async generateText(prompt: string): Promise<string> {
    const messages = [
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    return await this.callOpenAI(messages, 0.7, 1200, 'generation');
  }
}

export const aiService = new AIService();
export default aiService;
