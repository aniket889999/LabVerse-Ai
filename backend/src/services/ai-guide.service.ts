import prisma from '../config/prisma.js';

interface ChatRequest {
  question: string;
  labId?: string;
  projectId?: string;
  equipmentId?: string;
  visitorType?: 'STUDENT' | 'RECRUITER' | 'INDUSTRY_PARTNER';
}

interface ChatResponse {
  answer: string;
  sources: string[];
  suggestedQuestions: string[];
  mode: 'LLM' | 'FALLBACK_RETRIEVAL';
}

interface RankedItem {
  type: 'LAB' | 'PROJECT' | 'EQUIPMENT' | 'KNOWLEDGE';
  id: string;
  title: string;
  description: string;
  score: number;
  metadata?: any;
}

export const generateAiResponse = async (req: ChatRequest): Promise<ChatResponse> => {
  const { question, labId, projectId, equipmentId, visitorType } = req;
  const qLower = question.toLowerCase();
  
  // 1. Context Retrieval & Scoring
  const keywords = qLower.split(/[\s,?.!]+/).filter(w => w.length > 3);
  let allItems: RankedItem[] = [];

  // Fetch all searchable data (in a real app, use pgvector or Full Text Search)
  const [labs, projects, equipment, docs] = await Promise.all([
    prisma.lab.findMany({ include: { equipment: true, projects: true } }),
    prisma.project.findMany({ include: { lab: true } }),
    prisma.equipment.findMany({ include: { lab: true } }),
    prisma.aiKnowledgeDocument.findMany()
  ]);

  // Scoring function
  const scoreItem = (title: string, desc: string, type: string, explicitIdMatch = false): number => {
    let score = 0;
    if (explicitIdMatch) score += 50; // Huge boost for being on the current page
    
    const tLower = title.toLowerCase();
    const dLower = desc.toLowerCase();
    
    // Exact phrase match in title or description
    if (tLower.includes(qLower)) score += 20;
    if (dLower.includes(qLower)) score += 10;
    
    // Keyword matching
    for (const kw of keywords) {
      if (tLower.includes(kw)) score += 5;
      if (dLower.includes(kw)) score += 2;
    }

    // Role-based boosting
    if (visitorType === 'RECRUITER') {
      if (type === 'PROJECT') score += 5;
      if (tLower.includes('analytics') || tLower.includes('backend') || tLower.includes('skill')) score += 5;
      if (tLower.includes('recruiter')) score += 10;
    } else if (visitorType === 'INDUSTRY_PARTNER') {
      if (type === 'PROJECT' || type === 'LAB') score += 3;
      if (tLower.includes('industry') || tLower.includes('collaboration') || tLower.includes('case study')) score += 10;
    } else {
      // Default / Student
      if (tLower.includes('student') || tLower.includes('learn')) score += 5;
      // Penalize recruiter/industry specific docs for students unless specifically asked
      if (!qLower.includes('recruiter') && tLower.includes('recruiter')) score -= 10;
      if (!qLower.includes('industry') && tLower.includes('industry')) score -= 10;
    }

    return score;
  };

  // Add Labs
  labs.forEach(lab => {
    const desc = lab.description || '';
    const score = scoreItem(lab.name, desc, 'LAB', lab.id === labId);
    if (score > 0) allItems.push({ type: 'LAB', id: lab.id, title: lab.name, description: desc, score, metadata: lab });
  });

  // Add Projects
  projects.forEach(proj => {
    const desc = proj.description || '';
    const score = scoreItem(proj.title, desc, 'PROJECT', proj.id === projectId);
    if (score > 0) allItems.push({ type: 'PROJECT', id: proj.id, title: proj.title, description: desc, score, metadata: proj });
  });

  // Add Equipment
  equipment.forEach(eq => {
    const desc = eq.description || '';
    const score = scoreItem(eq.name, desc, 'EQUIPMENT', eq.id === equipmentId);
    if (score > 0) allItems.push({ type: 'EQUIPMENT', id: eq.id, title: eq.name, description: desc, score, metadata: eq });
  });

  // Add Docs
  docs.forEach(doc => {
    const score = scoreItem(doc.title, doc.content, 'KNOWLEDGE', false);
    if (score > 0) allItems.push({ type: 'KNOWLEDGE', id: doc.id, title: doc.title, description: doc.content, score });
  });

  // Sort by score descending
  allItems.sort((a, b) => b.score - a.score);

  // Filter out irrelevant recruiter docs for non-recruiters
  if (visitorType !== 'RECRUITER' && !qLower.includes('recruiter')) {
    allItems = allItems.filter(item => !item.title.toLowerCase().includes('recruiter use cases'));
  }

  const topItems = allItems.slice(0, 5);
  
  // Build context for LLM
  const contextBlocks = topItems.map(item => `[${item.type}] ${item.title}: ${item.description}`);
  const combinedContext = contextBlocks.join('\n\n');

  // Build sources
  let sources = topItems.map(item => `${item.type.charAt(0) + item.type.slice(1).toLowerCase()}: ${item.title}`);

  // 2. Try LLM
  const apiKey = process.env.GEMINI_API_KEY;
  let answer = "";
  let mode: 'LLM' | 'FALLBACK_RETRIEVAL' = 'FALLBACK_RETRIEVAL';
  let suggestedQuestions: string[] = [];

  if (apiKey && apiKey.length > 0) {
    try {
      mode = 'LLM';
      const prompt = `
        You are LabVerse AI, a helpful virtual guide for a university lab ecosystem.
        Answer the user's question based strictly on the provided context.
        User Type: ${visitorType || 'General Visitor'}
        
        Context:
        ${combinedContext}
        
        Question: ${question}
        
        Format your response cleanly. Be concise but highly professional.
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) throw new Error('Gemini API Error');
      const data = await response.json();
      answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not generate an answer.";
      
      // Dynamic suggested questions for LLM mode
      if (visitorType === 'RECRUITER') {
        suggestedQuestions = ["Which projects show backend/data analytics skills?", "Which students worked on supply chain analytics?", "What technologies are used in these projects?"];
      } else if (visitorType === 'INDUSTRY_PARTNER') {
        suggestedQuestions = ["How can this lab support real industry problems?", "Can we propose a warehouse optimization case study?", "What collaboration models are available?"];
      } else {
        suggestedQuestions = ["How does RFID improve warehouse accuracy?", "Which student projects use RFID?", "Can I see the Warehouse & Inventory Lab tour?"];
      }
    } catch (error) {
      console.error('[AI Guide LLM Error]', error);
      mode = 'FALLBACK_RETRIEVAL';
    }
  }

  // 3. Structured Fallback Mode Synthesis
  if (mode === 'FALLBACK_RETRIEVAL') {
    if (topItems.length > 0) {
      const topLab = topItems.find(i => i.type === 'LAB');
      const topProject = topItems.find(i => i.type === 'PROJECT');
      const topEquipment = topItems.find(i => i.type === 'EQUIPMENT');
      
      let synthesis = `Here is a structured overview based on our laboratory database:\n\n`;
      
      // Direct Answer / Short Explanation
      synthesis += `**Explanation & Context:**\n`;
      synthesis += `${topItems[0]?.description.split('. ')[0] || topItems[0]?.title}.\n\n`;

      // Where it appears / Related Lab
      if (topLab) {
        synthesis += `**Where to find this in LabVerse AI:**\n`;
        synthesis += `This is primarily featured in the **${topLab.title}**.\n\n`;
      }

      // Related Projects / Equipment
      if (topProject || topEquipment) {
        synthesis += `**Related Projects & Equipment:**\n`;
        if (topProject) synthesis += `- Project: ${topProject.title}\n`;
        if (topEquipment) synthesis += `- Equipment: ${topEquipment.title}\n`;
        synthesis += `\n`;
      }

      // Value proposition based on visitor type
      synthesis += `**Value & Next Steps:**\n`;
      if (visitorType === 'RECRUITER') {
        synthesis += `For recruiters, these resources demonstrate practical student skills in analytics, system design, and hands-on implementation. Consider exploring the featured projects to scout talent.\n`;
      } else if (visitorType === 'INDUSTRY_PARTNER') {
        synthesis += `For industry partners, this showcases our capability to tackle real-world supply chain and optimization challenges. We welcome collaboration and sponsored case studies.\n`;
      } else {
        synthesis += `For students, engaging with this equipment and related projects provides hands-on industry experience. Be sure to check the lab schedule to book a visit.\n`;
      }

      answer = synthesis;

    } else {
      // Minimum useful answer rule
      const totalDBItems = labs.length + projects.length + equipment.length + docs.length;
      if (totalDBItems === 0) {
        answer = "I couldn't find exact matches for your question. Our database appears to be empty at the moment.";
      } else {
        // We have data, but no strong match. Provide the absolute top item across all data anyway.
        const allUnscored = [
          ...labs.map(l => ({ type: 'LAB', title: l.name, desc: l.description || '' })),
          ...projects.map(p => ({ type: 'PROJECT', title: p.title, desc: p.description || '' })),
          ...equipment.map(e => ({ type: 'EQUIPMENT', title: e.name, desc: e.description || '' }))
        ];
        if (allUnscored.length > 0 && allUnscored[0]) {
           answer = `While I couldn't find an exact match for your specific question, you might be interested in our **${allUnscored[0].title}** (${allUnscored[0].type}).\n\n${allUnscored[0].desc}\n\nI recommend exploring the Lab Directory or Projects Repository for more detailed information.`;
        } else {
           answer = "I couldn't find exact matches for your question in our database. I recommend exploring the Lab Directory or the Projects Repository directly.";
        }
      }
    }
    
    // Dynamic suggested questions for FALLBACK mode based on keywords and visitorType
    if (visitorType === 'RECRUITER') {
      suggestedQuestions = [
        "Which projects show backend/data analytics skills?", 
        "Which students worked on supply chain analytics?", 
        "What technologies are used in these projects?"
      ];
    } else if (visitorType === 'INDUSTRY_PARTNER') {
      suggestedQuestions = [
        "How can this lab support real industry problems?", 
        "Can we propose a warehouse optimization case study?", 
        "What collaboration models are available?"
      ];
    } else {
      if (qLower.includes('rfid') || qLower.includes('warehouse')) {
        suggestedQuestions = [
          "How does RFID improve warehouse accuracy?", 
          "Which student projects use RFID?", 
          "Can I see the Warehouse & Inventory Lab tour?"
        ];
      } else if (qLower.includes('digital twin') || qLower.includes('simulation')) {
        suggestedQuestions = [
          "How do Digital Twins reduce logistics costs?",
          "Can I use the VR headsets for simulations?",
          "Show me projects involving supply chain analytics."
        ];
      } else {
        suggestedQuestions = [
          "What can I learn in the Warehouse & Inventory Lab?",
          "Which lab is best for demand forecasting?",
          "Can I book a visit to the facility?"
        ];
      }
    }
    
    // De-duplicate sources
    sources = Array.from(new Set(sources));
  }

  return {
    answer,
    sources,
    suggestedQuestions,
    mode
  };
};
