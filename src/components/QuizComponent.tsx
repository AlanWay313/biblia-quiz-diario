import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBibleChallenge } from '@/hooks/useBibleChallenge';
import { HelpCircle, Check, Book } from 'lucide-react';

interface QuizComponentProps {
  bookId: string;
  chapter: number;
  onComplete: (score: number) => void;
}

const QuizComponent = ({ bookId, chapter, onComplete }: QuizComponentProps) => {
  const { getQuizForChapter } = useBibleChallenge();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const questions = getQuizForChapter(bookId, chapter);
  
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Quiz ainda não disponível para este capítulo.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      showQuizResults();
    }
  };

  const showQuizResults = () => {
    setShowResults(true);
    const score = selectedAnswers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correctAnswer ? 10 : 0);
    }, 0);
    onComplete(score);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const score = selectedAnswers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correctAnswer ? 10 : 0);
    }, 0);
    const percentage = Math.round((score / (questions.length * 10)) * 100);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Check className="h-5 w-5" />
            Resultados do Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{score} pontos</div>
            <div className="text-lg text-gray-600">{percentage}% de acertos</div>
            <Badge className={`mt-2 ${percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {percentage >= 70 ? 'Aprovado!' : 'Continue estudando!'}
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Revisão das Respostas:</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <p className="font-medium mb-2">{index + 1}. {question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded text-sm ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : selectedAnswers[index] === optionIndex
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-50'
                      }`}
                    >
                      {option}
                      {optionIndex === question.correctAnswer && (
                        <Check className="inline h-4 w-4 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <p className="text-sm text-blue-600 mt-2 italic">{question.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <Button onClick={restartQuiz} variant="outline" className="w-full">
            Refazer Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Book className="h-5 w-5" />
          Quiz - Questão {currentQuestion + 1} de {questions.length}
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all hover:border-blue-300 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="w-full"
        >
          {currentQuestion < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
