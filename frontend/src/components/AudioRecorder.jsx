import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete, isUploading }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRecording && !isPaused) {
            intervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRecording, isPaused]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                stream.getTracks().forEach(track => track.stop());
                // Show success message
                console.log('Recording completed successfully!');
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            console.log('Recording started...');
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not access microphone. Please check permissions and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                setIsPaused(false);
            } else {
                mediaRecorderRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    const playRecording = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleSubmit = () => {
        if (audioBlob) {
            console.log('Submitting recording for feedback...');
            onRecordingComplete(audioBlob);
        } else {
            alert('No recording to submit. Please record your response first.');
        }
    };

    const handleNewRecording = () => {
        setAudioBlob(null);
        setAudioURL(null);
        setRecordingTime(0);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {!audioBlob ? (
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <Mic className="w-12 h-12 text-white" />
                    </div>

                    <div className="mb-6">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {formatTime(recordingTime)}
                        </div>
                        <div className="text-sm text-gray-600">
                            {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        {!isRecording ? (
                            <button
                                onClick={startRecording}
                                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <Mic className="w-5 h-5" />
                                <span>Start Recording</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={pauseRecording}
                                    className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                                </button>
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <Square className="w-5 h-5" />
                                    <span>Stop</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                            Recording Complete!
                        </div>
                        <div className="text-sm text-gray-600">
                            Duration: {formatTime(recordingTime)}
                        </div>
                    </div>

                    <div className="mb-6">
                        <audio
                            ref={audioRef}
                            src={audioURL}
                            onEnded={() => setIsPlaying(false)}
                            className="w-full"
                        />
                        <button
                            onClick={playRecording}
                            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>{isPlaying ? 'Pause' : 'Play'} Recording</span>
                        </button>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleNewRecording}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Record Again
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isUploading}
                            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <span>Submit for Feedback</span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;