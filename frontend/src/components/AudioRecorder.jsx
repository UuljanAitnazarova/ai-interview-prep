import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete, isUploading }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [supportsPause, setSupportsPause] = useState(false);

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
            // Check if MediaRecorder is supported
            if (!window.MediaRecorder) {
                throw new Error('MediaRecorder is not supported in this browser');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            // Check for supported MIME types
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/wav')) {
                mimeType = 'audio/wav';
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            // Check if pause/resume is supported
            setSupportsPause(typeof mediaRecorder.pause === 'function' && typeof mediaRecorder.resume === 'function');

            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                stream.getTracks().forEach(track => track.stop());
                console.log('Recording completed successfully!');
            };

            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                alert('Recording error occurred. Please try again.');
                setIsRecording(false);
            };

            mediaRecorder.start(1000); // Collect data every second
            setIsRecording(true);
            setRecordingTime(0);
            console.log('Recording started...');
        } catch (error) {
            console.error('Error starting recording:', error);
            if (error.name === 'NotAllowedError') {
                alert('Microphone access denied. Please allow microphone access and try again.');
            } else if (error.name === 'NotFoundError') {
                alert('No microphone found. Please connect a microphone and try again.');
            } else {
                alert(`Could not access microphone: ${error.message}`);
            }
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
            try {
                if (isPaused) {
                    // Check if resume is supported
                    if (typeof mediaRecorderRef.current.resume === 'function') {
                        mediaRecorderRef.current.resume();
                        setIsPaused(false);
                    } else {
                        console.warn('Resume not supported in this browser');
                        alert('Resume functionality not supported in this browser');
                    }
                } else {
                    // Check if pause is supported
                    if (typeof mediaRecorderRef.current.pause === 'function') {
                        mediaRecorderRef.current.pause();
                        setIsPaused(true);
                    } else {
                        console.warn('Pause not supported in this browser');
                        alert('Pause functionality not supported in this browser');
                    }
                }
            } catch (error) {
                console.error('Error pausing/resuming recording:', error);
                alert('Error controlling recording. Please try again.');
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
                                {supportsPause && (
                                    <button
                                        onClick={pauseRecording}
                                        className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                                    </button>
                                )}
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