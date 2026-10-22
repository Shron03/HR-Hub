import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Plus,
  Search,
  Filter,
  FileCheck,
  Shield,
  FileSpreadsheet,
  FileCode,
  X,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/api';

export default function DocumentsView({ currentUser, showToast }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Company Policies',
    fileName: '',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    accessLevel: 'All Employees',
    description: ''
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.getDocuments();
      if (res.success) {
        setDocuments(res.documents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.fileName) {
      showToast('Document title and file name are required', 'error');
      return;
    }
    try {
      const res = await api.createDocument({
        ...newDoc,
        uploadedBy: currentUser?.name || 'Priya Sharma (HR Director)'
      });
      if (res.success) {
        showToast('Document published to corporate repository', 'success');
        setIsUploadModalOpen(false);
        setNewDoc({
          title: '',
          category: 'Company Policies',
          fileName: '',
          fileSize: '1.2 MB',
          fileType: 'PDF',
          accessLevel: 'All Employees',
          description: ''
        });
        await fetchDocuments();
      }
    } catch (err) {
      showToast('Failed to upload document: ' + err.message, 'error');
    }
  };

  const handleDeleteDocument = async (id, title) => {
    if (!window.confirm(`Delete document "${title}"?`)) return;
    try {
      const res = await api.deleteDocument(id);
      if (res.success) {
        showToast(`Document "${title}" removed`, 'info');
        await fetchDocuments();
      }
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'error');
    }
  };

  const handleDownload = async (doc) => {
    try {
      await api.recordDocumentDownload(doc._id);
      showToast(`Downloaded "${doc.fileName}" (${doc.fileSize})`, 'success');
      await fetchDocuments();
    } catch (err) {
      showToast('Download simulation failed', 'error');
    }
  };

  const filteredDocs = documents.filter(d => {
    if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'DOCX':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Governance & Compliance Vault
            </span>
            <span className="text-xs text-slate-500 font-medium">Document Management System</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Files & Document Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Enterprise repository of company policies, POSH compliance handbooks, employment NDA templates, and tax declaration frameworks.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer py-2 px-4 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            {['All', 'Company Policies', 'Legal & Compliance', 'Templates & Forms', 'Payroll & Tax'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === cat ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search document title, file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
        <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
          <span>Corporate Documents ({filteredDocs.length})</span>
          <span className="text-[11px] text-slate-400 font-normal">All files verified for compliance</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading document catalog...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No corporate documents found for the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDocs.map(doc => (
              <div
                key={doc._id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex-shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {doc.accessLevel}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-2.5 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {doc.description || 'Official enterprise compliance artifact.'}
                  </p>

                  <div className="text-[10px] text-slate-400 mt-2.5 flex items-center space-x-2 font-mono">
                    <span>{doc.fileName}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Uploaded: {doc.uploadDate}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc._id, doc.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 bg-white/95 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Upload Enterprise Document</h2>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Travel & Deputation Policy 2026"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Company Policies">Company Policies</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Employment Contracts">Employment Contracts</option>
                    <option value="Templates & Forms">Templates & Forms</option>
                    <option value="Payroll & Tax">Payroll & Tax</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Access Level</label>
                  <select
                    value={newDoc.accessLevel}
                    onChange={(e) => setNewDoc({ ...newDoc, accessLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="All Employees">All Employees</option>
                    <option value="Management Only">Management Only</option>
                    <option value="Confidential">Confidential</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">File Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HR_Travel_Policy_v2.pdf"
                    value={newDoc.fileName}
                    onChange={(e) => setNewDoc({ ...newDoc, fileName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">File Type</label>
                  <select
                    value={newDoc.fileType}
                    onChange={(e) => setNewDoc({ ...newDoc, fileType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Summary Description</label>
                <textarea
                  rows="2"
                  placeholder="Short description of the policy, scope, or applicability..."
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 shadow-xs cursor-pointer"
                >
                  Publish Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
