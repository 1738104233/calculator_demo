import { useEffect, useState } from 'react';
import { calculate } from '../public/src/lib/client';

export default function Calculator() {
  // 状态管理
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operator, setOperator] = useState('+');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 当输入变化时清除结果和错误
  useEffect(() => {
    if (a !== '' || b !== '' || operator !== '+') {
      setResult(null);
      setError(null);
    }
  }, [a, b, operator]);

  // 处理计算请求
  const handleCalculate = async () => {
    // 验证输入
    if (a === '' || b === '') {
      setError('Please enter both numbers');
      return;
    }
    
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (isNaN(numA) ){
      setError('First number is invalid');
      return;
    }
    
    if (isNaN(numB)) {
      setError('Second number is invalid');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 调用计算函数
      const calcResult = await calculate(numA, numB, operator);
      
      // 更新状态
      setResult(calcResult);
      
      // 添加到历史记录
      const newEntry = {
        expression: `${numA} ${operator} ${numB} = ${calcResult}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 4)]); // 保留最近5条记录
    } catch (err) {
      // 处理错误
      setError(err.message || 'An error occurred during calculation');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 重置计算器
  const handleReset = () => {
    setA('');
    setB('');
    setOperator('+');
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      padding: '2rem', 
      border: '1px solid #e2e8f0', 
      borderRadius: '16px',
      backgroundColor: '#f8fafc',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#1e293b',
        marginBottom: '32px',
        fontSize: '2.25rem',
        fontWeight: '700',
        letterSpacing: '-0.025em'
      }}>ConnectRPC Calculator</h1>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr auto',
        gap: '16px', 
        marginBottom: '32px',
        alignItems: 'center'
      }}>
        <input 
          type="number" 
          value={a} 
          onChange={(e) => setA(e.target.value)}
          placeholder="First number"
          style={{ 
            padding: '16px', 
            fontSize: '1rem', 
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            transition: 'border-color 0.2s',
            ':focus': {
              outline: 'none',
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
            }
          }}
        />
        
        <select 
          value={operator} 
          onChange={(e) => setOperator(e.target.value)}
          style={{ 
            padding: '16px', 
            fontSize: '1rem', 
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            cursor: 'pointer',
            minWidth: '80px',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23334e68' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.25rem',
            paddingRight: '2.5rem'
          }}
        >
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        
        <input 
          type="number" 
          value={b} 
          onChange={(e) => setB(e.target.value)}
          placeholder="Second number"
          style={{ 
            padding: '16px', 
            fontSize: '1rem', 
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
            transition: 'border-color 0.2s',
            ':focus': {
              outline: 'none',
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
            }
          }}
        />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleCalculate} 
            disabled={loading}
            style={{ 
              padding: '16px 24px', 
              fontSize: '1rem', 
              cursor: 'pointer', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px',
              transition: 'all 0.2s',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
              flex: 1,
              ':hover': !loading && {
                backgroundColor: '#2563eb',
                transform: 'translateY(-2px)'
              },
              ':active': !loading && {
                transform: 'translateY(0)'
              },
              ':disabled': {
                backgroundColor: '#93c5fd',
                cursor: 'not-allowed',
                transform: 'none'
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ marginRight: '8px' }}>Calculating</span>
                <span className="spinner"></span>
              </span>
            ) : '='}
          </button>
          
          <button 
            onClick={handleReset}
            style={{ 
              padding: '16px', 
              fontSize: '1rem', 
              cursor: 'pointer', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px',
              transition: 'all 0.2s',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
              ':hover': {
                backgroundColor: '#dc2626',
                transform: 'translateY(-2px)'
              },
              ':active': {
                transform: 'translateY(0)'
              }
            }}
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* 结果展示区域 */}
      <div style={{ 
        marginTop: '32px',
        padding: '24px', 
        background: result !== null ? '#dbeafe' : '#f1f5f9', 
        borderRadius: '14px',
        borderLeft: result !== null ? '6px solid #3b82f6' : '6px solid #94a3b8',
        transition: 'all 0.3s ease',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {result !== null ? (
          <>
            <div style={{ 
              fontSize: '1.25rem',
              color: '#1e293b',
              marginBottom: '12px',
              fontWeight: '500'
            }}>
              {a} {operator} {b} =
            </div>
            <h2 style={{ 
              margin: 0,
              color: '#1d4ed8',
              textAlign: 'center',
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              {result}
            </h2>
          </>
        ) : error ? (
          <p style={{ 
            margin: 0,
            color: '#b91c1c',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '1.25rem'
          }}>
            Error: {error}
          </p>
        ) : (
          <p style={{ 
            margin: 0,
            color: '#64748b',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: '1.25rem'
          }}>
            Enter numbers and press "=" to calculate
          </p>
        )}
      </div>
      
      {/* 历史记录 */}
      {history.length > 0 && (
        <div style={{ 
          marginTop: '32px',
          padding: '24px', 
          background: '#f1f5f9', 
          borderRadius: '14px',
          borderLeft: '6px solid #94a3b8',
        }}>
          <h3 style={{ 
            marginTop: 0,
            marginBottom: '16px',
            color: '#334155',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>Recent Calculations</h3>
          
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {history.map((entry, index) => (
              <li key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}>
                <span style={{ fontWeight: '500' }}>{entry.expression}</span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{entry.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 页脚信息 */}
      <div style={{ 
        marginTop: '40px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem',
        borderTop: '1px solid #e2e8f0',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>Powered by</span>
        <span style={{ fontWeight: '600', color: '#3b82f6' }}>ConnectRPC</span>
        <span>•</span>
        <span style={{ fontWeight: '600', color: '#00add8' }}>Go 1.24.0</span>
        <span>•</span>
        <span style={{ fontWeight: '600', color: '#0070f3' }}>Next.js</span>
      </div>
      
      {/* 加载动画样式 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}