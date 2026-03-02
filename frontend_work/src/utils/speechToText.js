export const startListening = (setText) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.onresult = e => setText(e.results[0][0].transcript);
  recognition.start();
};
