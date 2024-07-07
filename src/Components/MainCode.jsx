    import React, { useState, useRef, useEffect } from 'react';
    import { quotesArray, random, allowedKeys } from './Helper.js';
    import '../App.css';
    import sound from '../Sound/Wrong-Sound.mp3';
    
    let interval = null;
    
    const MainCode = () => {
      const inputRef = useRef(null);
      const outputRef = useRef(null);
    
      const [duration, setDuration] = useState(60); // Set the initial duration to 60 seconds
      const [started, setStarted] = useState(false);
      const [ended, setEnded] = useState(false);
      const [index, setIndex] = useState(0);
      const [correctIndex, setCorrectIndex] = useState(0);
      const [quote, setQuote] = useState({});
      const [input, setInput] = useState('');
      const [errorIndex, setErrorIndex] = useState(0); // New state for error count
      const [ lastScore, setLastScore ] = useState('0')
      const [audio] = useState(new Audio(sound));

      const [cpm, setCpm] = useState(0);
      const [wpm, setWpm] = useState(0);
      const [accuracy, setAccuracy] = useState(0);
    
      useEffect(() => {
        const newQuote = random(quotesArray);
        setQuote(newQuote);
        setInput(newQuote.quote);
      }, []);
    
      useEffect(() => {
        const handleKeyDown = (e) => {
          if (ended) return; // Prevent further input if test ended
    
          e.preventDefault();
          const { key } = e;
          const quoteText = quote.quote;
    
          if (key === 'Enter' && !started) {
            handleStart();
          }
    
          if (ended && key === ' ') {
            handleRestart();
          }
    
          if (!started) return; // Prevent input before test starts
    
          if (key === quoteText.charAt(index)) {
            setIndex(index + 1);
            setCorrectIndex(correctIndex + 1);
            const currentChar = quoteText.substring(index + 1, quoteText.length);
            setInput(currentChar.replace(/\s/g, "\u00A0")); // Replace spaces with non-breaking spaces
            if (!ended) {
              outputRef.current.innerHTML += key; // Append only when the test is ongoing
            }
          } else {
            if (allowedKeys.includes(key)) {
              setErrorIndex(errorIndex + 1); // Increment error count
              if (!ended) {
                outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`; // Append only when the test is ongoing
              }
              audio.currentTime = 0; // Reset audio to start if already playing
              audio.play(); // Play the sound
            }
          }
    
          const timeElapsed = (60 - duration) / 60; // Time elapsed in minutes
          const accuracyValue = Math.floor(((index - errorIndex) / index) * 100);
          const wpmValue = Math.round(correctIndex / 5 / timeElapsed);
          const cpmValue = Math.round(correctIndex / timeElapsed);
    
          if (index > 0) {
            setAccuracy(accuracyValue);
            setCpm(cpmValue);
            setWpm(wpmValue);
          }

          if (index + 1 === quoteText.length || errorIndex > 50) {
            handleEnd();
          }
        };


    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [index, correctIndex, quote, duration, started, ended, errorIndex]);
    
      const handleStart = () => {
        setStarted(true);
        setEnded(false);
        setInput(quote.quote);
        inputRef.current.focus();
        setTimer();
      };
    
      const handleEnd = () => {
        setEnded(true);
        setStarted(false);
        clearInterval(interval);
      };
    
      const handleRestart = () => {
        window.location.reload();
      };
    
      const setTimer = () => {
        const now = Date.now();
        const endTime = now + duration * 1000;
        interval = setInterval(() => {
          const secondsLeft = Math.round((endTime - Date.now()) / 1000);
          setDuration(secondsLeft);
          if (secondsLeft <= 0) {
            handleEnd();
          }
        }, 1000);
      };
    
      return (
        <>
          <div className='Title'>
            TYPING TEST
          </div>
          <p className='SubTitle'>
            Welcome, Here you can test your speed, accuracy, and mistakes you make when typing.
            Have fun :D 
            <br/><br/>Press <b className='Bold'>Enter</b> to start typing!
          </p>
          <div>
            
          {ended ? (
            <>
            <div className='button'>
              <button
                className="ButtonReload"
                onClick={() => window.location.reload()}
                >
                Try Again
              </button>
            </div>
            <div className="ending-screen">
                <div className='cpm'> CPM<br />{cpm} </div>
                <div className='wpm'> WPM<br />{wpm} </div>
                <div className='accuracy'> Accuracy<br />{accuracy}% </div>
                <div className='error'> Mistakes<br />{errorIndex} </div>
              </div>
              <div className='MainQuote'>
                <div className='Quote'>"{quote.quote}" <br/><br/> - {quote.author}</div>
              
              </div>
            </>
          ) : started ? (
              <div className="Main">
                <div className='time-1'> Time: {duration} </div>
                <div className="textReferance" tabIndex="0" ref={inputRef}>
                  {input}
                </div>
              </div>
          ) : (
            <div className="Main">
              <div className='time-1'> Time: {duration} </div>
              <div className="textReferance" tabIndex="0" ref={inputRef}>
                {input}
              </div>
            </div>
          )}
          <div className="Output">
            <div className="InputReferance" ref={outputRef}/>
          </div>

          </div>
          
        </>
      );
    };
    
    export default MainCode;
    