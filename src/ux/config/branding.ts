export default {
    landingPath: '/dashboard',
    color: {
        primary: '#56b675',
        secondary: '#3B4F64',
        loginSide: '#30613e'
    },
    services: {
        endpoint: process.env.NEXT_PUBLIC_API_URL!,
        env: process.env.NEXT_PUBLIC_ENV!,
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
    }
}