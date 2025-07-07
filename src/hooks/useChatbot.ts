import { useState, useCallback } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Welcome! I'm your intelligent company policy assistant. I have access to all company policies, procedures, and guidelines. Whether you need information about HR policies, benefits, code of conduct, IT security, or any other company-related questions, I'm here to provide accurate and helpful answers. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = useCallback((userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Enhanced mock responses with more detailed information
    if (message.includes('vacation') || message.includes('leave') || message.includes('time off') || message.includes('pto')) {
      return "📅 **Leave Policy Overview**\n\nAccording to our comprehensive Leave Policy:\n\n• **Vacation Days**: Full-time employees receive 15 vacation days annually\n• **Sick Leave**: 10 sick days per year (unused days don't carry over)\n• **Personal Days**: 3 personal days for unexpected situations\n• **Request Process**: Submit requests at least 2 weeks in advance through the HR portal\n• **Approval**: Manager approval required for all leave requests\n• **Carryover**: Up to 5 unused vacation days can be carried to the next year\n• **Blackout Periods**: Limited availability during Q4 and major project deadlines\n\nNeed help with a specific leave request or have questions about your current balance?";
    }
    
    if (message.includes('remote work') || message.includes('work from home') || message.includes('wfh') || message.includes('hybrid')) {
      return "🏠 **Remote Work Policy**\n\nOur flexible Remote Work Policy includes:\n\n• **Eligibility**: Available to employees after 90-day probation period\n• **Frequency**: Up to 3 days per week for eligible positions\n• **Requirements**:\n  - Reliable high-speed internet (minimum 25 Mbps)\n  - Dedicated, professional workspace\n  - Participation in all scheduled meetings\n  - Maintain regular communication with team\n\n• **Equipment**: Company provides laptop, monitor, and necessary software\n• **Security**: VPN required for all company system access\n• **Performance**: Same productivity standards apply\n• **Approval Process**: Complete remote work agreement with your manager\n\nWould you like information about setting up your home office or the approval process?";
    }
    
    if (message.includes('benefits') || message.includes('insurance') || message.includes('health') || message.includes('401k')) {
      return "💼 **Comprehensive Benefits Package**\n\nWe're proud to offer competitive benefits:\n\n**Health & Wellness**\n• Medical Insurance: Company covers 80% of premiums\n• Dental & Vision: Full coverage available\n• Mental Health: Employee Assistance Program included\n• Wellness Stipend: $500 annually for gym/fitness\n\n**Financial Benefits**\n• 401(k) Plan: 6% company match (100% vested after 2 years)\n• Life Insurance: 2x annual salary coverage\n• Disability Insurance: Short and long-term coverage\n\n**Professional Development**\n• Learning Budget: $2,000 per year for courses/conferences\n• Tuition Reimbursement: Up to $5,000 annually\n• Internal Mentorship Program\n\n**Work-Life Balance**\n• Flexible PTO Policy\n• Parental Leave: 12 weeks paid\n• Sabbatical Program: Available after 5 years\n\nNeed details about enrollment or specific benefit information?";
    }
    
    if (message.includes('conduct') || message.includes('ethics') || message.includes('harassment') || message.includes('discrimination')) {
      return "⚖️ **Code of Conduct & Ethics**\n\nOur Code of Conduct is built on core values:\n\n**Core Principles**\n• Respect and dignity for all individuals\n• Integrity in all business dealings\n• Commitment to diversity and inclusion\n• Professional behavior at all times\n\n**Zero Tolerance Policies**\n• Harassment of any kind\n• Discrimination based on protected characteristics\n• Retaliation against those who report violations\n• Conflicts of interest without disclosure\n\n**Reporting Mechanisms**\n• Direct supervisor or HR representative\n• Anonymous ethics hotline: 1-800-ETHICS\n• Online reporting portal (confidential)\n• Open door policy with senior leadership\n\n**Training Requirements**\n• Annual ethics training (mandatory)\n• Harassment prevention certification\n• Regular policy updates and refreshers\n\nAll reports are investigated promptly and confidentially. Need information about reporting a concern?";
    }
    
    if (message.includes('security') || message.includes('password') || message.includes('it policy') || message.includes('cybersecurity')) {
      return "🔒 **IT Security & Cybersecurity Policy**\n\nProtecting company and client data is paramount:\n\n**Password Requirements**\n• Minimum 12 characters with complexity requirements\n• Unique passwords for each system\n• Password manager recommended and provided\n• Multi-factor authentication (MFA) mandatory\n\n**Device Security**\n• Automatic screen locks after 10 minutes\n• Full disk encryption required\n• Regular security updates (auto-install enabled)\n• Personal device approval required before network access\n\n**Data Protection**\n• No sensitive data on personal devices\n• Secure file sharing through approved platforms only\n• Email encryption for confidential information\n• Regular data backup verification\n\n**Incident Response**\n• Report security incidents immediately to IT\n• Suspicious emails should be forwarded to security@company.com\n• Lost/stolen device reporting within 2 hours\n\n**Training & Compliance**\n• Monthly security awareness training\n• Phishing simulation tests\n• Annual security certification required\n\nNeed help with MFA setup or reporting a security concern?";
    }
    
    if (message.includes('hours') || message.includes('schedule') || message.includes('overtime') || message.includes('flexibility')) {
      return "⏰ **Working Hours & Flexibility Policy**\n\nWe believe in work-life balance with structured flexibility:\n\n**Standard Schedule**\n• Core Hours: 9:00 AM - 5:00 PM (Monday-Friday)\n• Lunch Break: 1 hour (flexible timing)\n• Total: 40 hours per week\n\n**Flexible Options**\n• Flex Time: Start between 7:00 AM - 10:00 AM\n• Core Collaboration Hours: 10:00 AM - 3:00 PM (required presence)\n• Compressed Work Week: 4x10 schedule available with approval\n\n**Overtime Policy**\n• Pre-approval required for all overtime\n• Non-exempt employees: 1.5x rate for hours over 40\n• Exempt employees: Compensatory time available\n• Weekend work requires director approval\n\n**Time Tracking**\n• All employees use company time tracking system\n• Submit timesheets by end of day Friday\n• Accurate recording of all work hours required\n\n**Break Policies**\n• 15-minute breaks for every 4 hours worked\n• Meal break required for shifts over 6 hours\n\nQuestions about flexible scheduling or overtime approval process?";
    }
    
    if (message.includes('onboarding') || message.includes('new employee') || message.includes('orientation')) {
      return "🎯 **New Employee Onboarding**\n\nWelcome to the team! Here's your onboarding roadmap:\n\n**Week 1: Foundation**\n• HR orientation and paperwork completion\n• IT setup and security training\n• Office tour and introductions\n• Benefits enrollment session\n• Manager meeting and role expectations\n\n**Week 2-4: Integration**\n• Department-specific training\n• Shadow experienced team members\n• Complete mandatory compliance training\n• Set up 30/60/90-day goals with manager\n• Join relevant team meetings and projects\n\n**First 90 Days**\n• Regular check-ins with HR and manager\n• Feedback sessions and performance discussions\n• Complete all required certifications\n• Build relationships across departments\n• Formal 90-day performance review\n\n**Resources Available**\n• New Employee Handbook (digital copy)\n• Buddy system with experienced colleague\n• Online learning platform access\n• HR open door policy for questions\n\nNeed help accessing any onboarding materials or have specific questions?";
    }
    
    return "🤔 I'd be happy to help you find the specific policy information you're looking for! \n\nI can provide detailed information about:\n• HR policies and procedures\n• Employee benefits and compensation\n• Code of conduct and ethics guidelines\n• IT security and data protection\n• Leave policies and time off\n• Working hours and flexibility options\n• Onboarding and training requirements\n• Performance management processes\n• And much more!\n\nCould you please provide more specific details about what you'd like to know? You can also try one of the quick action buttons above for common policy topics.";
  }, []);

  const sendMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate more realistic AI response delay
    setTimeout(() => {
      const response = generateResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  }, [generateResponse]);

  return {
    messages,
    isTyping,
    sendMessage
  };
};