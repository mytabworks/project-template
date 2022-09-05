export default (screen: string, handler: (media: MediaQueryList) => void ) => {
    
    const media = window.matchMedia(screen)

    const handleMatched = () => {
        handler(media)
    }
    
    handleMatched()

    media.addEventListener('change', handleMatched)

    return () => media.removeEventListener('change', handleMatched)
}