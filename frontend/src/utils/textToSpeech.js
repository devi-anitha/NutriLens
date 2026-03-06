export const speak = (text) => {
  const msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
};
