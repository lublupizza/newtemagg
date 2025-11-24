
import React, { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { RefreshCw, Trophy, Crown, Ban, Play } from 'lucide-react';

interface PizzaCheckersProps {
  onGameOver: (score: number) => void;
  language: Language;
  autoStart?: boolean;
}

type PieceType = 'p1' | 'p2' | null;
type Cell = { id: number; piece: PieceType; isKing: boolean; };

const PizzaCheckers: React.FC<PizzaCheckersProps> = ({ onGameOver, language, autoStart }) => {
  const [board, setBoard] = useState<Cell[]>([]);
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');
  const [selected, setSelected] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [winner, setWinner] = useState<'p1' | 'p2' | 'draw' | null>(null);
  const [lastMove, setLastMove] = useState<{from: number, to: number} | null>(null);

  const t = {
    title: language === 'ru' ? 'ПИЦЦА ШАШКИ' : 'PIZZA CHECKERS',
    subtitle: language === 'ru' ? 'Пепперони против Грибов' : 'Pepperoni vs Mushrooms',
    turn: language === 'ru' ? 'Ваш ход' : 'Your Turn',
    aiTurn: language === 'ru' ? 'Думает...' : 'Thinking...',
    win: language === 'ru' ? 'ПОБЕДА!' : 'VICTORY!',
    lose: language === 'ru' ? 'ПОРАЖЕНИЕ' : 'DEFEAT',
    restart: language === 'ru' ? 'ЗАНОВО' : 'RESTART',
  };

  const initBoard = useCallback(() => {
    const newBoard: Cell[] = Array.from({ length: 64 }, (_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      let piece: PieceType = null;
      if ((row + col) % 2 !== 0) {
        if (row < 3) piece = 'p2';
        if (row > 4) piece = 'p1';
      }
      return { id: i, piece, isKing: false };
    });
    setBoard(newBoard); setTurn('p1'); setWinner(null); setScore({ p1: 0, p2: 0 }); setLastMove(null);
  }, []);

  useEffect(() => { initBoard(); }, [initBoard]);

  const getAvailableMoves = (index: number, currentBoard: Cell[], isCheckOnly = false): number[] => {
    const cell = currentBoard[index];
    if (!cell.piece) return [];
    const moves: number[] = [];
    const isP1 = cell.piece === 'p1';
    const row = Math.floor(index / 8);
    const col = index % 8;
    const directions = [];
    if (isP1 || cell.isKing) directions.push(-1);
    if (!isP1 || cell.isKing) directions.push(1);

    directions.forEach(rDir => {
        [-1, 1].forEach(cDir => {
            const rNext = row + rDir;
            const cNext = col + cDir;
            const nextIdx = rNext * 8 + cNext;
            if (rNext >= 0 && rNext < 8 && cNext >= 0 && cNext < 8) {
                if (!currentBoard[nextIdx].piece) {
                    if (!isCheckOnly) moves.push(nextIdx);
                } else if (currentBoard[nextIdx].piece !== cell.piece) {
                    const rJump = rNext + rDir;
                    const cJump = cNext + cDir;
                    const jumpIdx = rJump * 8 + cJump;
                    if (rJump >= 0 && rJump < 8 && cJump >= 0 && cJump < 8) {
                        if (!currentBoard[jumpIdx].piece) moves.push(jumpIdx);
                    }
                }
            }
        });
    });
    return moves;
  };

  const handleCellClick = (index: number) => {
    if (winner || turn !== 'p1') return;
    const clickedCell = board[index];
    if (clickedCell.piece === 'p1') { setSelected(index); setValidMoves(getAvailableMoves(index, board)); return; }
    if (selected !== null && validMoves.includes(index)) executeMove(selected, index);
  };

  const executeMove = (from: number, to: number) => {
    const newBoard = [...board];
    const movingPiece = { ...newBoard[from] };
    newBoard[from] = { ...newBoard[from], piece: null, isKing: false };
    newBoard[to] = { ...newBoard[to], piece: movingPiece.piece, isKing: movingPiece.isKing };
    const dist = Math.abs(from - to);
    if (dist > 9) {
        const mid = (from + to) / 2;
        newBoard[mid] = { ...newBoard[mid], piece: null, isKing: false };
        if (turn === 'p1') setScore(s => ({ ...s, p1: s.p1 + 1 })); else setScore(s => ({ ...s, p2: s.p2 + 1 }));
    }
    const row = Math.floor(to / 8);
    if ((movingPiece.piece === 'p1' && row === 0) || (movingPiece.piece === 'p2' && row === 7)) newBoard[to].isKing = true;
    
    setBoard(newBoard); setSelected(null); setValidMoves([]); setLastMove({ from, to });
    const p1Count = newBoard.filter(c => c.piece === 'p1').length;
    const p2Count = newBoard.filter(c => c.piece === 'p2').length;
    if (p2Count === 0) { setWinner('p1'); onGameOver(score.p1 * 500 + 1000); } 
    else if (p1Count === 0) setWinner('p2'); 
    else setTurn(prev => prev === 'p1' ? 'p2' : 'p1');
  };

  useEffect(() => {
    if (turn === 'p2' && !winner) {
      const timer = setTimeout(() => {
        const aiPieces = board.filter(c => c.piece === 'p2');
        let possibleMoves: {from: number, to: number, isJump: boolean}[] = [];
        aiPieces.forEach(cell => {
            const moves = getAvailableMoves(cell.id, board);
            moves.forEach(to => {
                const isJump = Math.abs(cell.id - to) > 9;
                possibleMoves.push({ from: cell.id, to, isJump });
            });
        });
        if (possibleMoves.length > 0) {
            const jumps = possibleMoves.filter(m => m.isJump);
            const move = jumps.length > 0 ? jumps[Math.floor(Math.random() * jumps.length)] : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            executeMove(move.from, move.to);
        } else { setWinner('p1'); onGameOver(score.p1 * 500 + 1000); }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turn, board, winner]);

  const PepperoniPiece = ({ isKing }: { isKing: boolean }) => (
    <div className="w-[80%] h-[80%] rounded-full bg-[#b91c1c] relative shadow-[0_4px_0_#7f1d1d] flex items-center justify-center transition-transform hover:scale-105">
       <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#ef4444] rounded-full opacity-50"></div>
       <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#ef4444] rounded-full opacity-50"></div>
       <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-[#ef4444] rounded-full opacity-50"></div>
       {isKing && <Crown className="w-3/4 h-3/4 text-yellow-400 drop-shadow-md animate-bounce" />}
    </div>
  );

  const MushroomPiece = ({ isKing }: { isKing: boolean }) => (
    <div className="w-[80%] h-[80%] rounded-full bg-[#e5e5e5] relative shadow-[0_4px_0_#a3a3a3] flex items-center justify-center">
       <div className="w-[70%] h-[70%] bg-[#d4d4d4] rounded-full flex items-center justify-center"><div className="w-[60%] h-[60%] bg-[#e5e5e5] rounded-full"></div></div>
       {isKing && <Crown className="absolute w-3/4 h-3/4 text-yellow-600 drop-shadow-md animate-bounce" />}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-8 px-4 flex flex-col items-center touch-none select-none">
        <div className="flex justify-between items-end w-full max-w-2xl mb-6">
            <div><h2 className="text-2xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-sm">{t.title}</h2></div>
            <div className="flex gap-4">
                <div className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${turn === 'p1' ? 'bg-red-500/20 border-red-500 scale-110' : 'bg-gray-900 border-gray-800 opacity-50'}`}><div className="w-3 h-3 rounded-full bg-red-600 mb-1"></div><div className="font-mono text-xl font-black text-white">{score.p1}</div></div>
                <div className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${turn === 'p2' ? 'bg-gray-200/20 border-gray-300 scale-110' : 'bg-gray-900 border-gray-800 opacity-50'}`}><div className="w-3 h-3 rounded-full bg-gray-300 mb-1"></div><div className="font-mono text-xl font-black text-white">{score.p2}</div></div>
            </div>
        </div>

        <div className="relative p-2 md:p-4 bg-[#d4a373] rounded-lg shadow-2xl border-8 border-[#a97142] w-full max-w-[500px] aspect-square">
            <div className="absolute top-0 left-0 w-full h-4 bg-black/10 pointer-events-none"></div>
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full border-4 border-white bg-[#f8fafc]">
                {board.map((cell, i) => {
                    const row = Math.floor(i / 8); const col = i % 8; const isDark = (row + col) % 2 !== 0; const isValidMove = validMoves.includes(i); const isSelected = selected === i; const isLastMove = lastMove && (lastMove.from === i || lastMove.to === i);
                    return (
                        <div key={cell.id} onClick={() => handleCellClick(i)} className={`relative flex items-center justify-center ${isDark ? 'bg-[#b91c1c]' : 'bg-white'} ${isValidMove ? 'cursor-pointer' : ''}`}>
                            {isDark && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')] opacity-30 pointer-events-none"></div>}
                            {isValidMove && <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-ping pointer-events-none"></div>}
                            {isLastMove && <div className="absolute inset-0 bg-yellow-400/30 pointer-events-none"></div>}
                            {cell.piece && <div className={`w-full h-full p-1 flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-110 drop-shadow-[0_0_10px_white]' : ''}`}>{cell.piece === 'p1' ? <PepperoniPiece isKing={cell.isKing} /> : <MushroomPiece isKing={cell.isKing} />}</div>}
                        </div>
                    );
                })}
            </div>
            {winner && <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">{winner === 'p1' ? <><Trophy className="w-24 h-24 text-yellow-400 animate-bounce mb-4" /><h2 className="text-5xl font-black text-white mb-2">{t.win}</h2></> : <><Ban className="w-24 h-24 text-red-500 mb-4" /><h2 className="text-5xl font-black text-white mb-8">{t.lose}</h2></>}<button onClick={initBoard} className="px-8 py-3 bg-white text-black font-black rounded-full hover:scale-105 transition-transform flex items-center gap-2"><RefreshCw className="w-5 h-5" /> {t.restart}</button></div>}
        </div>
    </div>
  );
};

export default PizzaCheckers;
