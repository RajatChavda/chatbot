import React from 'react';
import { Users, Calendar, Shield, Laptop, DollarSign, Clock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface QuickActionsProps {
  onActionClick: (question: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const { getTranslation } = useLanguage();

  const quickActions = [
    {
      icon: Users,
      title: getTranslation('hr_policies'),
      question: "What are the company's HR policies regarding remote work?",
      color: "blue"
    },
    {
      icon: Calendar,
      title: getTranslation('leave_policy'),
      question: "How many vacation days am I entitled to?",
      color: "green"
    },
    {
      icon: Shield,
      title: getTranslation('code_of_conduct'),
      question: "What is the company's code of conduct?",
      color: "purple"
    },
    {
      icon: Laptop,
      title: getTranslation('it_security'),
      question: "What are the IT security guidelines for employees?",
      color: "orange"
    },
    {
      icon: DollarSign,
      title: getTranslation('benefits'),
      question: "What benefits does the company offer?",
      color: "emerald"
    },
    {
      icon: Clock,
      title: getTranslation('working_hours'),
      question: "What are the standard working hours?",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      green: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
      purple: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
      orange: "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200",
      emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
      indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="text-center mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getTranslation('welcome_title')}
        </h2>
        <p className="text-gray-600">
          {getTranslation('welcome_subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => onActionClick(action.question)}
              className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-md ${getColorClasses(action.color)}`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <h3 className="font-medium text-sm">{action.title}</h3>
            </button>
          );
        })}
      </div>
    </div>
  );
};