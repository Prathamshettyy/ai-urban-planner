import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Bot, Check, X, Zap, Target, Leaf } from 'lucide-react';

// Dynamically import the MapComponent to prevent SSR issues with Leaflet.
const MapComponentWithNoSSR = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

// --- MOCK DATA GENERATION (to simulate backend) ---
const generateMockPlan = (iteration) => {
  // Helper to generate random bounds for map elements
  const getRandomBounds = (baseLat, baseLng) => {
    const latOffset = Math.random() * 0.01 - 0.005;
    const lngOffset = Math.random() * 0.01 - 0.005;
    return [
      [baseLat + latOffset, baseLng + lngOffset],
      [baseLat + latOffset + 0.005, baseLng + lngOffset + 0.008],
    ];
  };

  return {
    cityBoundary: [[51.495, -0.11], [51.515, -0.14], [51.51, -0.08]],
    greenSpaces: Array.from({ length: 3 + iteration }, () => ({
      bounds: getRandomBounds(51.505, -0.1),
      area: (Math.random() * 2 + 1).toFixed(2),
    })),
    commercialZones: Array.from({ length: 2 }, () => ({
      bounds: getRandomBounds(51.51, -0.12),
      type: 'Retail/Office Mix',
    })),
    residentialZones: Array.from({ length: 4 }, () => ({
      bounds: getRandomBounds(51.50, -0.13),
      density: 'Medium',
    })),
    keyBuildings: [
      { id: 'B1', type: 'Proposed Hospital', location: [51.51, -0.10] },
      { id: 'B2', type: 'Proposed School', location: [51.508, -0.115] },
    ],
  };
};

export default function Home() {
  const [log, setLog] = useState(['Welcome to the AI Urban Planner.']);
  const [sustainabilityScore, setSustainabilityScore] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const logEndRef = useRef(null);

  // Auto-scroll the log view
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  // --- SIMULATED AGENT WORKFLOW ---
  const runSimulation = async (feedback) => {
    setIsProcessing(true);
    setIteration(prev => prev + 1);
    
    const newLog = [...log];
    const addLog = (msg) => {
      newLog.push(msg);
      setLog([...newLog]);
    };

    addLog(`--- Iteration ${iteration + 1} ---`);
    if (feedback) {
       addLog(`[Human]: Feedback received: ${feedback}.`);
    }

    await new Promise(res => setTimeout(res, 500));
    addLog('[Perceptor]: Gathering geospatial data...');
    
    await new Promise(res => setTimeout(res, 1000));
    addLog('[Planner]: Generating new urban plan...');
    const plan = generateMockPlan(iteration);
    setCurrentPlan(plan);
    
    await new Promise(res => setTimeout(res, 1000));
    addLog('[Utility]: Evaluating plan sustainability...');
    const newScore = Math.floor(Math.random() * 45) + 40; // Random score between 40-85
    setSustainabilityScore(newScore);

    await new Promise(res => setTimeout(res, 500));
    addLog(`[Utility]: New score is ${newScore}. Awaiting feedback.`);
    
    setIsProcessing(false);
  };

  const handleGenerate = () => {
    if (isProcessing) return;
    setCurrentPlan(null);
    setSustainabilityScore(0);
    setLog(['Welcome to the AI Urban Planner.']);
    setIteration(0);
    runSimulation();
  };
  
  const handleApprove = () => {
    if (isProcessing || !currentPlan) return;
    setLog(prev => [...prev, '[Human]: Plan APPROVED. Generating next proposal based on success.']);
    runSimulation('Approved');
  };

  const handleDisapprove = () => {
    if (isProcessing || !currentPlan) return;
    setLog(prev => [...prev, '[Human]: Plan DISAPPROVED. Requesting revisions.']);
    runSimulation('Disapproved');
  };


  return (
    <>
      <Head>
        <title>AI Urban Planner Dashboard</title>
        <meta name="description" content="AI-driven urban planning and design" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-screen w-screen bg-brand-gray-light font-sans p-4 gap-4">
        {/* Header */}
        <header className="flex items-center justify-between pb-2 border-b-2 border-brand-gray">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-brand-blue-dark" />
            <h1 className="text-2xl font-bold text-gray-800">AI Urban Planner</h1>
          </div>
          <div className="text-sm text-gray-500">Iteration: <span className="font-semibold text-gray-700">{iteration}</span></div>
        </header>

        {/* Main Content Area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
          
          {/* Left Column: Map */}
          <div className={`col-span-1 lg:col-span-2 bg-white p-4 rounded-xl shadow-md ${isProcessing ? 'animate-pulse-bg' : ''}`}>
            <MapComponentWithNoSSR planData={currentPlan} />
          </div>

          {/* Right Column: Controls & Logs */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
            
            {/* Score & Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><Leaf className="text-green-500"/> Sustainability Score</h2>
              <div className="text-center">
                <p className="text-6xl font-bold text-brand-blue">{sustainabilityScore}</p>
                <p className="text-sm text-gray-500">/ 100</p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={handleGenerate} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-brand-blue-dark transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                  <Zap className="h-5 w-5" />
                  {iteration === 0 ? 'Generate Initial Plan' : 'Start New Simulation'}
                </button>
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleApprove} disabled={isProcessing || !currentPlan} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <Check className="h-5 w-5" />
                      Approve
                    </button>
                    <button onClick={handleDisapprove} disabled={isProcessing || !currentPlan} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <X className="h-5 w-5" />
                      Disapprove
                    </button>
                 </div>
              </div>
            </div>

            {/* Live Log */}
            <div className="bg-white p-4 rounded-xl shadow-md flex-grow flex flex-col min-h-0">
              <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><Target className="text-purple-500"/> Agent Log</h2>
              <div className="flex-grow bg-gray-900 text-white font-mono text-sm p-3 rounded-md overflow-y-auto">
                {log.map((entry, index) => (
                  <p key={index} className="whitespace-pre-wrap animate-fade-in">{`> ${entry}`}</p>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
