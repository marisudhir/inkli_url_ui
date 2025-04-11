import React, { useState, useEffect, useRef } from "react";
import "./styles/BodyStyles.css";
import illustration from "./assets/homepage_illustration.svg";
import ShortURLSample from './sample_conversion';

function Body() {
  const [animatedText, setAnimatedText] = useState("");
  const words = ["Make It Tiny", "Shrink It Now", "Cut the Clutter"];
  const [wordIndex, setWordIndex] = useState(0);
  const [animateOut, setAnimateOut] = useState(false);
  const numberRefs = useRef([]);
  const observerRefs = useRef([]);

  const statsData = [
    { value: 50, label: "Links Converted", suffix: "M+" },
    { value: 10, label: "Accounts Created", suffix: "M+" },
    { value: 80, label: "Countries Used", suffix: "+" },
    { value: 1, label: "Clicks Recorded", suffix: "B+" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setAnimateOut(false);
      }, 500);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnimatedText(words[wordIndex]);
  }, [wordIndex, words]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const index = parseInt(target.dataset.index);
            const endValue = statsData[index].value;
            let startValue = parseInt(target.textContent.replace(/[^0-9]/g, '')) || 0;
            const duration = 1500;
            const startTime = performance.now();
            let animationFrameId;

            function animateNumber(currentTime) {
              const elapsedTime = currentTime - startTime;
              const progress = Math.min(elapsedTime / duration, 1);
              const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
              target.textContent = currentValue + (target.dataset.suffix || "");
              if (progress < 1) {
                animationFrameId = requestAnimationFrame(animateNumber);
              } else {
                observerRefs.current[index].unobserve(target);
              }
            }
            animationFrameId = requestAnimationFrame(animateNumber);
          }
        });
      },
      { threshold: 0.5 }
    );

    numberRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.dataset.index = index;
        observer.observe(ref);
        observerRefs.current[index] = observer;
      }
    });

    return () => {
      observerRefs.current.forEach((obs) => {
        if (obs) {
          obs.disconnect();
        }
      });
    };
  }, [statsData]);

  return (
    <>
      <div className="body-container">
        <div className="left-section">
          <div className="hero-text" style={{marginTop:'100px', textAlign:'center'}}> {/* Added a container for the heading and form */}
            <h2>Shorten Your URL <span className={`animated-word ${animateOut ? 'slide-out-up' : 'slide-in-down'}`}>{animatedText}</span></h2>
            <ShortURLSample />
          </div>
        </div>
        <div className="right-section">
          <img src={illustration} alt="Create Short URLs" />
        </div>
      </div>
      <div className="stats-circles-container">
        {statsData.map((stat, index) => (
          <div className="stats-circle" key={index}>
            <span
              className="stats-number animated-number"
              data-value={stat.value}
              data-suffix={stat.suffix}
              ref={(el) => (numberRefs.current[index] = el)}
            >
              0{stat.suffix}
            </span>
            <span className="stats-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Body;