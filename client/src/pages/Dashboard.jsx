import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Share2, Download, AlertTriangle, CheckCircle, TrendingUp, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/history/${slug}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load analysis. It might not exist or you lack permission.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline font-medium">Return Home</Link>
      </div>
    );
  }

  const { results, originalFileName } = data;

  // Prepare data for Radar Chart
  const radarData = results.roles.map(r => ({
    role: r.role.replace(' Engineer', '').replace(' Developer', ''),
    fit: r.fitScore,
    fullMark: 100
  }));

  const handlePrint = () => {
    window.print();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:py-0 print:px-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Mapping Report</h1>
          <p className="text-gray-500 mt-1">Source: <span className="font-medium text-gray-700">{originalFileName}</span></p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button onClick={copyLink} className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-200">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Roles & Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
              Role Fit Analysis
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="role" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                  <Radar name="Fit Score" dataKey="fit" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
              Top Matched Roles
            </h2>
            {results.roles.map((role, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{role.role}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    role.fitScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 
                    role.fitScore >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {role.fitScore}% Fit
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-600 flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" /> Acquired Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.matchedSkills.map((s, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-500 flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 mr-1" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {role.missingSkills.map((s, i) => (
                        <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Roadmap & Stats */}
        <div className="space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white"
          >
            <h3 className="text-indigo-100 font-medium text-sm mb-1">Market Demand Score</h3>
            <div className="flex items-end space-x-2">
              <span className="text-5xl font-extrabold">{results.demandScore}</span>
              <span className="text-indigo-200 mb-1">/ 100</span>
            </div>
            <p className="mt-4 text-sm text-indigo-100 leading-relaxed">
              Based on current job market trends, the skills in this syllabus are {results.demandScore >= 80 ? 'highly sought after' : 'moderately demanded'}.
            </p>
            <div className="mt-6 pt-6 border-t border-indigo-500/30">
              <h4 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3">Top Hiring Companies</h4>
              <div className="flex flex-wrap gap-2">
                {results.topCompanies.map((c, i) => (
                  <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20 backdrop-blur-sm">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upskilling Roadmap</h3>
            <div className="space-y-6">
              {results.roadmap.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 last:border-0 pb-6 last:pb-0">
                  <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1 border-2 border-white"></div>
                  <h4 className="font-semibold text-gray-900 text-md">{item.skill}</h4>
                  <ul className="mt-2 space-y-1">
                    {item.resources.map((res, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="text-indigo-400 mr-2">•</span> {res}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
