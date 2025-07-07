import { useState, useCallback, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

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

const STORAGE_KEY = 'company_documents_ai';

export const useAdvancedPDFProcessor = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Load stored documents on initialization
  useEffect(() => {
    const loadStoredDocuments = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const docs = JSON.parse(stored);
          const processedDocs = docs.map((doc: any) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt)
          }));
          setDocuments(processedDocs);
          console.log('Loaded stored documents:', processedDocs.length);
        }
      } catch (error) {
        console.error('Error loading stored documents:', error);
      }
    };

    loadStoredDocuments();
  }, []);

  const saveDocuments = useCallback((docs: ProcessedDocument[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      console.log('Saved documents to storage:', docs.length);
    } catch (error) {
      console.error('Error saving documents:', error);
    }
  }, []);

  const extractAdvancedTextFromPDF = async (file: File): Promise<{
    content: string;
    sections: DocumentSection[];
    metadata: DocumentMetadata;
  }> => {
    console.log(`Starting advanced PDF extraction for: ${file.name}`);
    setProcessingProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      
      let fullText = '';
      const pageTexts: string[] = [];
      let totalCharacters = 0;

      console.log(`PDF has ${pageCount} pages`);
      setProcessingProgress(20);

      // Extract text from each page with progress tracking
      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Enhanced text extraction with positioning
          const pageItems = textContent.items.map((item: any) => {
            if (item.str && typeof item.str === 'string') {
              return {
                text: item.str,
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
                height: item.height
              };
            }
            return null;
          }).filter(Boolean);

          // Sort by position (top to bottom, left to right)
          pageItems.sort((a: any, b: any) => {
            const yDiff = Math.abs(a.y - b.y);
            if (yDiff < 5) { // Same line
              return a.x - b.x;
            }
            return b.y - a.y; // Top to bottom
          });

          const pageText = pageItems.map((item: any) => item.text).join(' ');
          pageTexts.push(pageText);
          fullText += pageText + '\n\n';
          totalCharacters += pageText.length;
          
          // Update progress
          const progress = 20 + (pageNum / pageCount) * 60;
          setProcessingProgress(progress);
          
          console.log(`Extracted ${pageText.length} characters from page ${pageNum}`);
        } catch (pageError) {
          console.error(`Error extracting page ${pageNum}:`, pageError);
        }
      }

      setProcessingProgress(85);

      // Clean and process the text
      const cleanedText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Extract sections intelligently
      const sections = extractDocumentSections(cleanedText, pageTexts);
      
      // Calculate metadata
      const wordCount = cleanedText.split(/\s+/).filter(word => word.length > 0).length;
      const extractionQuality = assessExtractionQuality(cleanedText, wordCount, pageCount);

      const metadata: DocumentMetadata = {
        pageCount,
        wordCount,
        fileSize: file.size,
        extractionQuality
      };

      setProcessingProgress(100);
      
      console.log(`Successfully extracted ${cleanedText.length} characters, ${wordCount} words from ${file.name}`);
      
      return {
        content: cleanedText,
        sections,
        metadata
      };
    } catch (error) {
      console.error('Advanced PDF extraction failed:', error);
      throw new Error(`Failed to extract text from ${file.name}: ${error}`);
    }
  };

  const extractDocumentSections = (fullText: string, pageTexts: string[]): DocumentSection[] => {
    const sections: DocumentSection[] = [];
    
    // Common section headers patterns
    const sectionPatterns = [
      /^(POLICY|PROCEDURE|GUIDELINES?|OVERVIEW|INTRODUCTION|PURPOSE|SCOPE|DEFINITIONS?|RESPONSIBILITIES|PROCESS|REQUIREMENTS?|BENEFITS?|LEAVE|VACATION|SICK|REMOTE|WORK|HOURS|SECURITY|CONDUCT|ETHICS|TRAINING|DEVELOPMENT|EXPENSE|REIMBURSEMENT|INSURANCE|HEALTH|DENTAL|VISION|401K|RETIREMENT)[\s:]/i,
      /^\d+\.\s+[A-Z][^.]{10,50}$/,
      /^[A-Z][A-Z\s]{5,30}$/
    ];

    const lines = fullText.split('\n').filter(line => line.trim().length > 0);
    let currentSection: DocumentSection | null = null;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if this line is a section header
      const isHeader = sectionPatterns.some(pattern => pattern.test(trimmedLine)) ||
                      (trimmedLine.length < 100 && trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 5);
      
      if (isHeader && trimmedLine.length < 100) {
        // Save previous section
        if (currentSection && currentSection.content.trim()) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          title: trimmedLine,
          content: '',
          pageNumbers: [Math.floor(index / (lines.length / pageTexts.length)) + 1],
          keywords: extractKeywords(trimmedLine)
        };
      } else if (currentSection) {
        // Add content to current section
        currentSection.content += line + '\n';
        
        // Extract keywords from content
        if (currentSection.content.length % 500 === 0) { // Update keywords periodically
          currentSection.keywords = [
            ...currentSection.keywords,
            ...extractKeywords(line)
          ].filter((keyword, index, arr) => arr.indexOf(keyword) === index);
        }
      }
    });
    
    // Add the last section
    if (currentSection && currentSection.content.trim()) {
      sections.push(currentSection);
    }
    
    // If no sections found, create a general section
    if (sections.length === 0) {
      sections.push({
        title: 'Document Content',
        content: fullText,
        pageNumbers: Array.from({ length: pageTexts.length }, (_, i) => i + 1),
        keywords: extractKeywords(fullText)
      });
    }
    
    return sections;
  };

  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'then', 'them', 'well', 'were'].includes(word));
    
    return [...new Set(words)].slice(0, 20);
  };

  const assessExtractionQuality = (text: string, wordCount: number, pageCount: number): DocumentMetadata['extractionQuality'] => {
    const avgWordsPerPage = wordCount / pageCount;
    const hasStructure = /\n\s*\n/.test(text);
    const hasNumbers = /\d/.test(text);
    const hasProperSpacing = !/\w{50,}/.test(text); // No extremely long words (indicates poor extraction)
    
    if (avgWordsPerPage > 200 && hasStructure && hasNumbers && hasProperSpacing) {
      return 'excellent';
    } else if (avgWordsPerPage > 100 && hasStructure) {
      return 'good';
    } else if (avgWordsPerPage > 50) {
      return 'fair';
    } else {
      return 'poor';
    }
  };

  const processDocuments = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    console.log(`Processing ${files.length} PDF files with AI enhancement`);
    
    try {
      const processed: ProcessedDocument[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`);
        
        const { content, sections, metadata } = await extractAdvancedTextFromPDF(file);
        
        const processedDoc: ProcessedDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          content,
          sections,
          metadata,
          uploadedAt: new Date()
        };
        
        processed.push(processedDoc);
        console.log(`Processed ${file.name}: ${content.length} chars, ${metadata.wordCount} words, ${sections.length} sections`);
      }
      
      const updatedDocuments = [...documents, ...processed];
      setDocuments(updatedDocuments);
      saveDocuments(updatedDocuments);
      
      console.log(`Successfully processed ${processed.length} documents`);
      return processed;
    } catch (error) {
      console.error('Error processing documents:', error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [documents, saveDocuments]);

  const searchDocuments = useCallback((query: string): string => {
    console.log(`Searching for: "${query}" in ${documents.length} documents`);
    
    if (documents.length === 0) {
      return '';
    }
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    const results: Array<{ content: string; score: number; source: string; section: string }> = [];
    
    documents.forEach(doc => {
      doc.sections.forEach(section => {
        let score = 0;
        const sectionLower = section.content.toLowerCase();
        const titleLower = section.title.toLowerCase();
        
        // Score based on matches
        searchTerms.forEach(term => {
          // Title matches are worth more
          if (titleLower.includes(term)) score += 50;
          
          // Content matches
          const contentMatches = (sectionLower.match(new RegExp(term, 'g')) || []).length;
          score += contentMatches * 10;
          
          // Keyword matches
          if (section.keywords.some(keyword => keyword.includes(term))) score += 25;
        });
        
        if (score > 0) {
          // Extract relevant sentences
          const sentences = section.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
          const relevantSentences = sentences.filter(sentence => 
            searchTerms.some(term => sentence.toLowerCase().includes(term))
          );
          
          if (relevantSentences.length > 0) {
            results.push({
              content: relevantSentences.slice(0, 3).join('. ').trim(),
              score,
              source: doc.name,
              section: section.title
            });
          }
        }
      });
    });
    
    // Sort by relevance and combine top results
    const topResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    if (topResults.length === 0) {
      return '';
    }
    
    // Create comprehensive context
    let context = `RELEVANT COMPANY POLICY INFORMATION:\n\n`;
    
    topResults.forEach((result, index) => {
      context += `${index + 1}. FROM "${result.source}" - ${result.section}:\n`;
      context += `${result.content}\n\n`;
    });
    
    context += `\nSOURCE DOCUMENTS: ${[...new Set(topResults.map(r => r.source))].join(', ')}`;
    
    console.log(`Found ${topResults.length} relevant sections for context`);
    return context;
  }, [documents]);

  const deleteDocument = useCallback((id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    saveDocuments(updatedDocuments);
  }, [documents, saveDocuments]);

  const clearAllDocuments = useCallback(() => {
    setDocuments([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    documents,
    isProcessing,
    processingProgress,
    processDocuments,
    searchDocuments,
    deleteDocument,
    clearAllDocuments
  };
};