export const generateResponse = (
  userMessage: string, 
  sessionId: string, 
  qaResults?: Array<{content: string, source: string, confidence?: number}>
): string => {
  console.log(`Generating response for: "${userMessage}"`);
  console.log(`Q&A results count: ${qaResults?.length || 0}`);
  
  // If we have Q&A search results, use them to generate response
  if (qaResults && qaResults.length > 0) {
    console.log('Using Q&A results for response generation');
    return generateQABasedResponse(userMessage, qaResults);
  }
  
  // Fallback response when no Q&A results found
  console.log('No Q&A results found, using fallback response');
  return generateFallbackResponse(userMessage);
};

const generateQABasedResponse = (
  userMessage: string, 
  qaResults: Array<{content: string, source: string, confidence?: number}>
): string => {
  console.log(`Generating Q&A-based response with ${qaResults.length} results`);
  
  // Sort by confidence if available
  const sortedResults = qaResults.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  
  let response = `💡 **Answer to: "${userMessage}"**\n\n`;
  
  if (sortedResults.length === 1) {
    // Single best answer
    response += `${sortedResults[0].content}\n\n`;
    response += `📚 *Source: ${sortedResults[0].source}*`;
  } else {
    // Multiple relevant answers
    response += `Here's what I found in our company knowledge base:\n\n`;
    
    sortedResults.forEach((result, index) => {
      const confidence = result.confidence || 0;
      const confidenceIcon = confidence > 50 ? '🎯' : confidence > 30 ? '✅' : '💡';
      
      response += `${confidenceIcon} **Answer ${index + 1}:**\n`;
      response += `${result.content}\n\n`;
    });
    
    const sources = [...new Set(sortedResults.map(r => r.source))];
    response += `📚 *Sources: ${sources.join(', ')}*`;
  }
  
  return response;
};

const generateFallbackResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Check for common HR topics and provide helpful guidance
  if (message.includes('vacation') || message.includes('leave') || message.includes('pto')) {
    return `📅 **Leave Policy Information Needed**\n\nI don't have specific information about "${userMessage}" in the knowledge base yet.\n\n💡 **To get accurate answers:**\n• Add your company's leave policy Q&As to the knowledge base\n• Include questions like "How many vacation days do employees get?"\n• Add details about sick leave, personal days, and approval processes\n\n📁 Use the "Manage Knowledge Base" to import your company's Q&A data.`;
  }
  
  if (message.includes('benefit') || message.includes('insurance') || message.includes('health')) {
    return `💼 **Benefits Information Needed**\n\nI don't have specific information about "${userMessage}" in the knowledge base yet.\n\n💡 **To get accurate answers:**\n• Add your company's benefits Q&As to the knowledge base\n• Include details about health insurance, 401k, dental, vision\n• Add information about enrollment periods and eligibility\n\n📁 Use the "Manage Knowledge Base" to import your company's Q&A data.`;
  }
  
  if (message.includes('expense') || message.includes('reimburs')) {
    return `💰 **Expense Policy Information Needed**\n\nI don't have specific information about "${userMessage}" in the knowledge base yet.\n\n💡 **To get accurate answers:**\n• Add your company's expense policy Q&As to the knowledge base\n• Include what expenses are reimbursable\n• Add details about submission processes and limits\n\n📁 Use the "Manage Knowledge Base" to import your company's Q&A data.`;
  }
  
  if (message.includes('remote') || message.includes('work from home') || message.includes('wfh')) {
    return `🏠 **Remote Work Policy Information Needed**\n\nI don't have specific information about "${userMessage}" in the knowledge base yet.\n\n💡 **To get accurate answers:**\n• Add your company's remote work Q&As to the knowledge base\n• Include eligibility requirements and approval processes\n• Add details about equipment, security, and expectations\n\n📁 Use the "Manage Knowledge Base" to import your company's Q&A data.`;
  }
  
  return `🔍 **Information Not Found**\n\nI couldn't find specific information about "${userMessage}" in the current knowledge base.\n\n💡 **To get accurate answers:**\n• Import your company's Q&A data using CSV upload\n• Add manual entries for specific policies\n• Use the "Manage Knowledge Base" feature\n\n📋 **Sample CSV format:**\n\`\`\`\nquestion,answer,category\n"What are working hours?","9 AM to 5 PM Monday-Friday","Working Hours"\n"How many vacation days?","15 days annually","Leave Policy"\n\`\`\`\n\n📁 **Next Steps:** Click "Manage Knowledge Base" to add your company's specific policy information.`;
};