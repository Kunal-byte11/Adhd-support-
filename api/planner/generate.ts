export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    userName = 'Kunal',
    dsaHours = 2,
    genAiHours = 2,
    revisionHours = 1,
    stepGoal = 10000,
    englishMinutes = 10,
    startTime = '09:00 AM',
    customGoals = '',
  } = req.body || {};

  const greeting = `Hii ${userName}! Here is your AI-optimized schedule for today.`;
  const motivationalQuote = `${dsaHours}h DSA + ${genAiHours}h GenAI + ${revisionHours}h Revision + ${stepGoal.toLocaleString()} Steps + ${englishMinutes}m English. Micro-chunked for zero burnout.`;

  const blocks = [
    {
      id: `plan-dsa-${Date.now()}-1`,
      timeSlot: `${startTime} - 10:00 AM`,
      title: `DSA Focus Block: Code & Debug Python Course (${dsaHours * 60} min)`,
      category: 'dsa',
      durationMinutes: dsaHours * 60,
      icon: 'code',
      description: 'Master Big-O time & space complexity, TLE errors, and problem framing on paper before submitting.',
      whyItMatters: 'Morning peak energy is best for algorithmic thinking.',
      stepsTarget: 0,
      isCompleted: false,
      subSteps: [
        { id: `s-dsa-1`, title: 'Frame problem constraints & edge cases on paper', minutes: 15, isCompleted: false, importance: 'MUST_DO' },
        { id: `s-dsa-2`, title: 'Write optimal single-pass Python solution', minutes: 30, isCompleted: false, importance: 'CORE' },
        { id: `s-dsa-3`, title: 'Test boundary conditions & dry-run submit on LeetCode', minutes: 15, isCompleted: false, importance: 'PRACTICE' },
      ],
    },
    {
      id: `plan-genai-${Date.now()}-2`,
      timeSlot: '10:00 AM - 12:00 PM',
      title: `GenAI & RAG Track: Krish Naik Course (${genAiHours * 60} min)`,
      category: 'genai',
      durationMinutes: genAiHours * 60,
      icon: 'brain',
      description: 'Build end-to-end document chunking -> vector embeddings -> ChromaDB -> prompt augmentation pipeline.',
      whyItMatters: 'Hands-on AI agent engineering builds real portfolio competence.',
      stepsTarget: 0,
      isCompleted: false,
      subSteps: [
        { id: `s-gen-1`, title: 'Setup LangChain document loaders & RecursiveCharacterTextSplitter', minutes: 30, isCompleted: false, importance: 'CORE' },
        { id: `s-gen-2`, title: 'Store embeddings in ChromaDB vector database', minutes: 30, isCompleted: false, importance: 'CORE' },
      ],
    },
    {
      id: `plan-steps-${Date.now()}-3`,
      timeSlot: '12:00 PM - 01:00 PM',
      title: `Movement & Dopamine Reset (${stepGoal.toLocaleString()} Steps Goal)`,
      category: 'steps',
      durationMinutes: 40,
      icon: 'footprints',
      description: 'Get physical movement and outdoor daylight for natural dopamine and mental clarity.',
      whyItMatters: 'Physical activity refreshes cognitive energy for afternoon focus.',
      stepsTarget: stepGoal,
      isCompleted: false,
      subSteps: [
        { id: `s-step-1`, title: 'Outdoor walking / stamina movement break', minutes: 35, isCompleted: false, importance: 'MUST_DO' },
      ],
    },
    {
      id: `plan-revision-${Date.now()}-4`,
      timeSlot: '02:00 PM - 03:00 PM',
      title: `Spaced Revision & Algorithmic Recall (${revisionHours * 60} min)`,
      category: 'revision',
      durationMinutes: revisionHours * 60,
      icon: 'book',
      description: 'Review previously solved LeetCode problems & reinforce weak patterns.',
      whyItMatters: 'Prevents forgetting curve and cements long-term memory.',
      stepsTarget: 0,
      isCompleted: false,
      subSteps: [
        { id: `s-rev-1`, title: 'Active recall & re-code 1-2 tagged weak problems', minutes: 30, isCompleted: false, importance: 'PRACTICE' },
      ],
    },
  ];

  return res.status(200).json({
    greeting,
    motivationalQuote,
    blocks,
  });
}
