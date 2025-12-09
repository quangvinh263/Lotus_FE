import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../../styles/Admin/AIInsightModal.css';

const AIInsightModal = ({ isOpen, onClose, questions, onGenerate }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [insightResult, setInsightResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setInsightResult(null); // Clear previous result
  };

  const handleGenerate = async () => {
    if (!selectedQuestion) return;

    setIsGenerating(true);
    try {
      const result = await onGenerate(selectedQuestion.id);
      setInsightResult(result);
    } catch (error) {
      setInsightResult("Đã xảy ra lỗi khi tạo phân tích.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setSelectedQuestion(null);
    setInsightResult(null);
    onClose();
  };

  return (
    <div className="ai-modal-overlay" onClick={handleClose}>
      <div className="ai-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="ai-modal-header">
          <h2>Gợi ý & Phân tích</h2>
          <button className="ai-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="ai-modal-body">
          {/* Left Panel: Questions List */}
          <div className="ai-questions-panel">
            <h3>Chọn câu hỏi phân tích</h3>
            <div className="ai-questions-list">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`ai-question-card ${selectedQuestion?.id === q.id ? 'active' : ''}`}
                  onClick={() => handleQuestionClick(q)}
                >
                  <div className="question-header">
                    
                    <span className="question-category">{q.category}</span>
                  </div>
                  <h4>{q.question}</h4>
                  <p>{q.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Result */}
          <div className="ai-result-panel">
            {!selectedQuestion ? (
              <div className="ai-placeholder">
                
                <p>Chọn một câu hỏi bên trái để bắt đầu phân tích</p>
              </div>
            ) : !insightResult ? (
              <div className="ai-generate-section">
                <div className="selected-question-preview">
                  <div>
                    <h4>{selectedQuestion.question}</h4>
                    <p>{selectedQuestion.description}</p>
                  </div>
                </div>
                <button
                  className="ai-generate-btn"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="loading-spinner"></span>
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      
                      Tạo phân tích
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="ai-result-content">
                <div className="result-header">
                  <h3>Kết quả phân tích</h3>
                  <button className="regenerate-btn" onClick={handleGenerate}>
                    🔄 Tạo lại
                  </button>
                </div>
                <div className="result-markdown">
                  <ReactMarkdown>{insightResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightModal;