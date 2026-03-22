
import React, { useState } from 'react';
import { QuizAnswers } from '../types';

interface Props {
  onSubmit: (answers: QuizAnswers) => void;
  onBack: () => void;
}

const Quiz: React.FC<Props> = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    skinTone: '', eyeShape: '', faceShape: '', vibe: '', occasion: ''
  });

  const questions = [
    { key: 'skinTone' as const, question: "Skin Tone?", options: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'] },
    { key: 'eyeShape' as const, question: "Eye Shape?", options: ['Almond', 'Round', 'Monolid', 'Hooded', 'Downturned'] },
    { key: 'faceShape' as const, question: "Face Shape?", options: ['Oval', 'Round', 'Heart', 'Square', 'Diamond'] },
    { key: 'vibe' as const, question: "Your Aesthetic?", options: ['Clean Girl', 'Soft Glam', 'Bold Edgy', 'Y2K Retro'] },
    { key: 'occasion' as const, question: "The Event?", options: ['Daily Wear', 'Date Night', 'Girls Outing', 'Formal Wedding'] }
  ];

  const handleSelect = (val: string) => {
    const key = questions[step].key;
    setAnswers({ ...answers, [key]: val });
    if (step < questions.length - 1) setStep(step + 1);
  };

  const currentQuestion = questions[step];

  return (
    <div className="max-w-xl mx-auto py-12 space-y-8 animate-in slide-in-from-bottom-8">
      <button onClick={onBack} className="text-gray-500 hover:text-pink-600 font-medium flex items-center">← Back</button>

      <div className="space-y-6">
        <h2 className="serif text-4xl text-pink-900">{currentQuestion.question}</h2>
        <div className="grid gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-6 text-left rounded-3xl border-2 transition-all group ${
                answers[currentQuestion.key] === option 
                ? 'border-pink-500 bg-pink-500 text-white shadow-xl translate-x-2' 
                : 'border-pink-100 bg-white text-gray-800 hover:border-pink-300 hover:bg-pink-50'
              }`}
            >
              <span className="text-lg font-bold">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {step === questions.length - 1 && answers.occasion && (
        <button onClick={() => onSubmit(answers)} className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white py-5 rounded-3xl font-bold shadow-2xl hover:scale-[1.02] transition-transform">
          Reveal My Custom Style ✨
        </button>
      )}
    </div>
  );
};

export default Quiz;
