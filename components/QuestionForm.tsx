import React, { useState } from 'react';

interface QuestionFormProps {
  title: string;
  placeholder: string;
  onSubmit: (answer: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ title, placeholder, onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-serif text-amber-100 text-center border-b border-amber-500/30 pb-4">
          {title}
        </h2>
        
        <div className="relative">
          <textarea
            className="w-full h-40 bg-indigo-950/40 border border-amber-500/30 rounded-lg p-4 text-amber-50 placeholder-amber-500/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none font-serif text-lg"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <div className="absolute -top-2 -right-2 text-4xl text-amber-500/20 pointer-events-none">✦</div>
          <div className="absolute -bottom-2 -left-2 text-4xl text-amber-500/20 pointer-events-none">✦</div>
        </div>

        <button
          type="submit"
          disabled={!input.trim()}
          className="mt-4 py-3 px-8 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-serif font-bold rounded-sm shadow-lg shadow-amber-900/50 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Revelar Carta
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;