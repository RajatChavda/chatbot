import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle, Loader, Database, Trash2, AlertTriangle, Calendar, BarChart3, Brain } from 'lucide-react';

interface ProcessedDocument {
  id: string;
  name: string;
  content: string;
  sections: DocumentSection[];
  metadata: DocumentMetadata;
  uploadedAt: Date;
}

interface DocumentSection {
  title: string;
  content: string;
  pageNumbers: number[];
  keywords: string[];
}

interface DocumentMetadata {
  pageCount: number;
  wordCount: number;
  fileSize: number;
  extractionQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface AdvancedPDFManagerProps {
  onClose: () => void;
  onProcessDocuments: (files: File[]) => Promise<ProcessedDocument[]>;
  isProcessing: boolean;
  processingProgress: number;
  documents: ProcessedDocument[];
  onDeleteDocument: (id: string) => void;
  onClearAll: () => void;
}

export const AdvancedPDFManager: React.FC<AdvancedPDFManagerProps> = ({
  onClose,
  onProcessDocuments,
  isProcessing,
  processingProgress,
  documents,
  onDeleteDocument,
  onClearAll
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length > 0) {
      try {
        await onProcessDocuments(selectedFiles);
        setSelectedFiles([]);
      } catch (error) {
        console.error('Processing error:', error);
        alert(`Error processing documents: ${error}`);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQualityColor = (quality: DocumentMetadata['extractionQuality']) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
    }
  };

  const totalStats = {
    documents: documents.length,
    totalPages: documents.reduce((sum, doc) => sum + doc.metadata.pageCount, 0),
    totalWords: documents.reduce((sum, doc) => sum + doc.metadata.wordCount, 0),
    totalSections: documents.reduce((sum, doc) => sum + doc.sections.length, 0)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Document Manager</h2>
              <p className="text-sm text-gray-500">Advanced PDF processing with intelligent content extraction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Upload & Documents List */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            {/* Stats Overview */}
            {documents.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{totalStats.documents} Documents</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">{totalStats.totalPages} pages total</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">{totalStats.totalWords.toLocaleString()} Words</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">{totalStats.totalSections} sections extracted</p>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Upload Company Documents</h3>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">
                  Upload PDF Documents
                </h4>
                <p className="text-gray-600 mb-3 text-sm">
                  AI will extract and analyze content intelligently
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF Files
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Files to Process ({selectedFiles.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="mt-3 w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Processing... {processingProgress.toFixed(0)}%
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Process with AI ({selectedFiles.length} files)
                      </>
                    )}
                  </button>
                  
                  {isProcessing && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Documents List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Processed Documents ({documents.length})</h3>
                {documents.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </button>
                )}
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Database className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No Documents Processed</p>
                  <p className="text-sm mt-1">Upload PDF files to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDocument?.id === doc.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <p className="font-medium text-gray-900 truncate text-sm">{doc.name}</p>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{doc.metadata.pageCount} pages</span>
                            <span>{doc.metadata.wordCount.toLocaleString()} words</span>
                            <span>{doc.sections.length} sections</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getQualityColor(doc.metadata.extractionQuality)}`}>
                              {doc.metadata.extractionQuality} quality
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(doc.uploadedAt)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDocument(doc.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Document Details */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {selectedDocument ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedDocument.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Pages:</span>
                      <span className="ml-2 font-medium">{selectedDocument.metadata.pageCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Words:</span>
                      <span className="ml-2 font-medium">{selectedDocument.metadata.wordCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">File Size:</span>
                      <span className="ml-2 font-medium">{formatFileSize(selectedDocument.metadata.fileSize)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quality:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getQualityColor(selectedDocument.metadata.extractionQuality)}`}>
                        {selectedDocument.metadata.extractionQuality}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Extracted Sections ({selectedDocument.sections.length})</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedDocument.sections.map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 mb-2">{section.title}</h5>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                          {section.content.substring(0, 200)}...
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>Pages: {section.pageNumbers.join(', ')}</span>
                          <span>•</span>
                          <span>{section.keywords.length} keywords</span>
                        </div>
                        {section.keywords.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {section.keywords.slice(0, 8).map(keyword => (
                              <span
                                key={keyword}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Select a Document</p>
                  <p className="text-sm mt-1">Click on a document to view its details and extracted sections</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clear All Confirmation Modal */}
        {showClearConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Clear All Documents?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will permanently delete all {documents.length} processed documents and their extracted content. 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                    setSelectedDocument(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};