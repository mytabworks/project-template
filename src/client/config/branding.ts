export default {
    services: {
        endpoint: process.env.NEXT_PUBLIC_API_URL!,
        env: process.env.NEXT_PUBLIC_ENV!
    },
    token: {
        name: 'tk',
        expireday: 1, // 1 day
        domain: '',
        expireMessage: 'To protect your data, you have been logged out. Please login again to continue.'
    },
    toaster: {
        soundEffectEnable: false,
        pathSoundEffectIn: '/media/audio/mixkit-message-pop-alert.mp3',
        pathSoundEffectOut: '/media/audio/mixkit-long-pop.wav'
    },
    messages: {
        error: process.env.NEXT_PUBLIC_ENV === 'production' ? 'Something went wrong.' : 'There is an issue with the endpoint.',
        fail: 'There are errors with your entry. Please check and try again.'
    }
}