import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, Briefcase } from 'lucide-react';
import axios from '../api/axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('/history')
        .then(res => setHistory(res.data))
        .catch(console.error);
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6"
        >
          Bridge the Gap Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Classroom & Career</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-8"
        >
          Upload your syllabus and let AI analyze your academic curriculum to map it directly to industry roles, discover skill gaps, and generate a customized learning roadmap.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to={token ? "/upload" : "/register"} className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1">
            {token ? "Analyze New Syllabus" : "Get Started for Free"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard 
          icon={<BrainCircuit className="w-8 h-8 text-indigo-500" />}
          title="AI Deep Analysis"
          desc="Extracts semantic meaning from course modules to understand exactly what you're learning."
          delay={0.3}
        />
        <FeatureCard 
          icon={<Target className="w-8 h-8 text-emerald-500" />}
          title="Skill Gap Detection"
          desc="Compares your syllabus against current job market demands to identify missing critical skills."
          delay={0.4}
        />
        <FeatureCard 
          icon={<Briefcase className="w-8 h-8 text-blue-500" />}
          title="Career Role Mapping"
          desc="Discovers exactly which job roles you are best suited for based on your academic background."
          delay={0.5}
        />
      </div>

      {token && history.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Your Past Analyses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <Link to={`/dashboard/${item.slug}`} key={item._id}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer"
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate" title={item.originalFileName}>
                    {item.originalFileName}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                      Demand Score: {item.results?.demandScore}%
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
