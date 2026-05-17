import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, X, Loader2 } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setText(''); // clear text if file is selected
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setText('');
      setError('');
    } else {
      setError('Please drop a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !text.trim()) {
      setError('Please upload a PDF or paste your syllabus text.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (file) {
      formData.append('syllabus', file);
    } else {
      formData.append('text', text);
    }

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': file ? 'multipart/form-data' : 'application/json'
        }
      });
      navigate(`/dashboard/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Analyze Your Syllabus</h1>
        <p className="text-lg text-gray-600">Upload your academic syllabus to discover your career fit, identify skill gaps, and get a personalized roadmap.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center justify-between">
                <span>{error}</span>
                <button type="button" onClick={() => setError('')}><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                file ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="font-semibold text-indigo-900">{file.name}</p>
                  <p className="text-sm text-indigo-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium mt-2"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <UploadIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Drag & drop your PDF syllabus here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse from your computer</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
                  >
                    Select PDF
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="application/pdf" 
                    className="hidden" 
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-sm font-medium text-gray-400">OR PASTE TEXT</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Text Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Raw Syllabus Text</label>
              <textarea
                rows="6"
                placeholder="Paste the course description, modules, and topics here..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!!file}
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading || (!file && !text.trim())}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Analyzing with AI... (This may take a moment)
                  </>
                ) : (
                  'Generate Career Map'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
