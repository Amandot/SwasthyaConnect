import { useState, useEffect } from 'react';

function VideoCall({ roomId, userName, onLeave }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize Jitsi Meet
    const loadJitsi = async () => {
      try {
        const domain = 'meet.jit.si';
        const options = {
          roomName: roomId,
          width: '100%',
          height: '100%',
          parentNode: document.getElementById('jitsi-container'),
          userInfo: {
            displayName: userName || 'Patient'
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'settings',
              'videoquality', 'filmstrip', 'tileview'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            MOBILE_APP_PROMO: false
          }
        };

        // Load Jitsi API script dynamically
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement('script');
          script.src = 'https://meet.jit.si/external_api.js';
          script.async = true;
          script.onload = () => {
            initializeJitsi(domain, options);
          };
          document.body.appendChild(script);
        } else {
          initializeJitsi(domain, options);
        }
      } catch (err) {
        setError('Failed to load video call. Please try again.');
        console.error('Jitsi error:', err);
      }
    };

    const initializeJitsi = (domain, options) => {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      
      api.addListener('videoConferenceJoined', () => {
        setIsJoined(true);
      });

      api.addListener('videoConferenceLeft', () => {
        setIsJoined(false);
        if (onLeave) onLeave();
      });

      api.addListener('audioMuteStatusChanged', (e) => {
        setIsAudioEnabled(!e.muted);
      });

      api.addListener('videoMuteStatusChanged', (e) => {
        setIsVideoEnabled(!e.muted);
      });

      // Store API reference for cleanup
      window.jitsiApi = api;
    };

    loadJitsi();

    // Cleanup on unmount
    return () => {
      if (window.jitsiApi) {
        window.jitsiApi.dispose();
        window.jitsiApi = null;
      }
    };
  }, [roomId, userName, onLeave]);

  const handleToggleVideo = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand('toggleVideo');
    }
  };

  const handleToggleAudio = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand('toggleAudio');
    }
  };

  const handleLeave = () => {
    if (window.jitsiApi) {
      window.jitsiApi.executeCommand('hangup');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 rounded-2xl p-8">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-white text-lg mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Jitsi Container */}
      <div id="jitsi-container" className="w-full h-full rounded-2xl overflow-hidden bg-slate-900">
        {!isJoined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Connecting to consultation room...</p>
            <p className="text-slate-400 text-sm mt-2">Room ID: {roomId}</p>
          </div>
        )}
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-slate-800/90 px-6 py-3 rounded-full">
        <button
          onClick={handleToggleAudio}
          className={`p-3 rounded-full transition-colors ${
            isAudioEnabled ? 'bg-slate-700 text-white' : 'bg-red-600 text-white'
          }`}
          title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {isAudioEnabled ? (
            <MicIcon className="w-5 h-5" />
          ) : (
            <MicOffIcon className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={handleToggleVideo}
          className={`p-3 rounded-full transition-colors ${
            isVideoEnabled ? 'bg-slate-700 text-white' : 'bg-red-600 text-white'
          }`}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? (
            <VideoIcon className="w-5 h-5" />
          ) : (
            <VideoOffIcon className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={handleLeave}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          title="Leave call"
        >
          <PhoneOffIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Connection Status */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-full">
        <div className={`w-2 h-2 rounded-full ${isJoined ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
        <span className="text-white text-sm">{isJoined ? 'Connected' : 'Connecting...'}</span>
      </div>
    </div>
  );
}

// Icon Components
function MicIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function MicOffIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );
}

function VideoIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function VideoOffIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );
}

function PhoneOffIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
    </svg>
  );
}

export default VideoCall;
