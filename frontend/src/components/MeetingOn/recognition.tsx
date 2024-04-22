// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// // interface Command {
// //   command: string | string[] | RegExp;
// //   callback: (...args: any[]) => unknown;
// //   isFuzzyMatch?: boolean | undefined;
// //   matchInterim?: boolean | undefined;
// //   fuzzyMatchingThreshold?: number | undefined;
// //   bestMatchOnly?: boolean | undefined;
// // }

// // interface useSpeechRecognition {
// //   transcribing: boolean | undefined;
// //   clearTranscriptOnListen: boolean | undefined;
// //   commands?: Command[] | undefined;
// // }

// const Recognition = () => {
//   const recognitionState = {
//     state: false,
//   };
//   useSpeechRecognition({
//     transcribing: true,
//     clearTranscriptOnListen: true,
//     commands: [
//       {
//         command: "Command",
//         callback: (
//           command: string,
//           spokenPhrase: string,
//           similarityRatio: number,
//         ) => {},
//       },
//       {
//         command: "Command",
//         callback: (...match: string[]) => {},
//       },
//     ],
//   });

//   const startRecognition = () => {
//     SpeechRecognition.startListening({
//       continuous: true,
//       language: "ko",
//     });
//     recognitionState.state = true;
//   };

//   const stopRecognition = () => {
//     SpeechRecognition.stopListening();
//     recognitionState.state = false;
//   };

//   return (
//     <>
//       {recognitionState.state ? (
//         <button onClick={startRecognition}>text 받아오기</button>
//       ) : (
//         <button onClick={stopRecognition}>text 그만받기</button>
//       )}
//     </>
//   );
// };

// export default Recognition;
