import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';
import { Word } from 'components/Word';

const acidRainWords = [
  '물고기',
  '바다',
  '꽃밭',
  '나비',
  '숲속',
  '하늘',
  '달빛',
  '별빛',
  '햇살',
  '바람',
  '새소리',
  '푸른색',
  '빨간색',
  '노란색',
  '하얀색',
  '검은색',
  '작은새',
  '큰돌',
  '작은구름',
  '길가',
  '맑은물',
  '산길',
  '바위산',
  '비바람',
  '바다풍경',
  '산풍경',
  '해변',
  '무지개',
  '푸른하늘',
  '까만밤',
];

const levelList = ['1단계', '2단계', '3단계', '4단계', '5단계'];
const LENGTH = 5; //가로 단어 개수

function shuffleArray() {
  let arr = Array.from({ length: acidRainWords.length }, (_, i) => i); // 0부터 10까지의 배열 생성
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0부터 i까지 랜덤 인덱스 생성
    [arr[i], arr[j]] = [arr[j], arr[i]]; // 해당 인덱스와 랜덤 인덱스의 요소 교환
  }
  return arr;
}

function chunkArray(array, chunkSize) {
  let result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
let shuffledIndexes = shuffleArray(); //다음 게임 시 초기화
let chunks = chunkArray(shuffledIndexes, LENGTH); //LENGTH개의 원소로 나눔

export const AcidRainModal = () => {
  const [isStarted, setIsStarted] = useState(false);
  //객체 배열 만들기
  const [checkedWords, setCheckedWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [level, setLevel] = useState(0); //레벨은 1단계~5단계
  const timeLimit = 21 - 4 * level; //떨어지는 데 걸리는 시간(초기 버튼 클릭으로 받아올듯)
  const interval = timeLimit / LENGTH;
  const inputRef = useRef(null);
  const [fallingWords, setFallingWords] = useState([]);

  const addFallingWords = (word) => {
    if (!fallingWords.includes(word))
      setFallingWords((prev) => [...prev, word]);
  };

  const popFallingWords = (word) => {
    setFallingWords((prev) => prev.filter((prevWord) => prevWord !== word));
  };

  const onKeyDown = ({ key }) => {
    switch (key) {
      case 'Enter':
        handleEnter();
        return;
      default:
        break;
    }
  };

  const handleEnter = () => {
    if (!inputRef.current) return;
    addCheckedWords();
    focusInput();
  };

  const focusInput = () => {
    inputRef.current.disabled = true;
    setTimeout(() => {
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }, 0);
    setInputValue('');
  };

  const addCheckedWords = () => {
    fallingWords.forEach((word) => {
      if (word === inputValue) {
        setCheckedWords((prev) => {
          if (!prev.includes(word)) {
            return [...prev, word];
          }
          return prev;
        });
      }
    });
  };

  const onChange = ({ target: { value } }) => {
    setInputValue(value);
  };
  const onClickStart = () => {
    setIsStarted(true);
  };
  const onClickLevelButton = (level) => () => {
    setLevel(level);
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  // useEffect(() => {
  //   switch (level) {
  //     case 1:
  //       break;
  //     case 2:
  //       break;
  //     case 3:
  //       break;
  //     case 4:
  //       break;
  //     case 5:
  //       break;
  //     default:
  //       console.error('Level Missing');
  //   }
  // }, [level]);

  if (!isStarted)
    return (
      <div className='modal_overlay'>
        <div className='acid_rain_modal'>
          <div className='acid_rain_init_contents'>
            <p className='acid_rain_title'>산 성 비</p>
            <div className='level_buttons_wrapper'>
              {levelList.map((level, index) => (
                <button
                  key={index}
                  className='level_button'
                  onClick={onClickLevelButton(index + 1)}
                >
                  {level}
                </button>
              ))}
            </div>
            <button className='acid_rain_start_button' onClick={onClickStart}>
              Start!
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <div className='modal_overlay'>
      <div className='acid_rain_modal'>
        <div className='acid_rain_contents'>
          <div className='limit'>
            <br />
            경계선 - 구현 완료 후 아래로 내리면 글씨 안보임
          </div>
          {chunks.map((row, rowIndex) => (
            <div className='acid_rain_top_row' key={rowIndex}>
              {row.map((wordIndex, index) => (
                <Word
                  key={index}
                  word={acidRainWords[wordIndex]}
                  isChecked={checkedWords.includes(acidRainWords[wordIndex])}
                  timeLimit={timeLimit}
                  interval={interval * shuffledIndexes[wordIndex]}
                  addFallingWords={addFallingWords}
                  popFallingWords={popFallingWords}
                />
              ))}
            </div>
          ))}
          <div className='acid_rain_result'>{checkedWords.length}</div>
          <input
            className='acid_rain_input'
            value={inputValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
};
