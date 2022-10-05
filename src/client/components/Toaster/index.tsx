import React from 'react'
import retoast from 'retoast'
import Spinner from 'react-bootstrap/Spinner'
import Icon from '../Icon'
import ProgressBar from 'react-bootstrap/ProgressBar'
import classNames from 'classnames'
// import './index.scss'

const branding = {
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

const soundEffectIn = () => {
    if(branding.toaster.soundEffectEnable) {
        const sound = new Audio(branding.toaster.pathSoundEffectIn)
        sound.play()
    }
}

const soundEffectDismissed = () => {
    if(branding.toaster.soundEffectEnable) {
        const sound = new Audio(branding.toaster.pathSoundEffectOut)
        sound.play()
    }
}

type ToasterOptions = { 
    className?: string, 
    duration?: number, 
    placement?: "top-right" | "top" | "top-left" | "bottom-left" | "bottom-right" 
}

const Toaster = (message: React.ReactNode, {className, duration = 10000, placement = 'top-right'}: ToasterOptions = {}) => {
    const randomKey = `${Math.random()}`
    const reloader = (
        <div className={classNames("toaster-content", null, className)}>
            <Spinner animation="border" size="sm" /><div className="toaster-message">{message}</div>
        </div>
    )
    retoast({
        key: randomKey,
        body: reloader,
        variant: 'info',
        duration: 0,
        placement,
        onMount: soundEffectIn,
    })
    
    return {
        success: (message: React.ReactNode) => {
            retoast({
                key: randomKey,
                body: reloader,
                duration: 1,
                placement,
                variant: 'info',
                onUnmount: () => {
                    retoast({
                        body: (
                            <div className={classNames("toaster-content", null, className)}>
                                <Icon name="check" /><div className="toaster-message">{message}</div>
                            </div>
                        ),
                        variant: 'success',
                        duration,
                        placement,
                        onMount: soundEffectIn,
                        onDismissed: soundEffectDismissed,
                        dismissible: true
                    })
                }
            })
        },
        fail: (message: React.ReactNode = <span style={{fontSize: '14px'}}>{branding.messages.fail}</span>) => {
            retoast({
                key: randomKey,
                body: reloader,
                duration: 1,
                placement,
                variant: 'info',
                onUnmount: () => {
                    retoast({
                        body: (
                            <div className={classNames("toaster-content", null, className)}>
                                <Icon name="exclamation-triangle"/><div className="toaster-message">{message}</div>
                            </div>
                        ),
                        variant: 'warning',
                        duration,
                        placement,
                        onMount: soundEffectIn,
                        onDismissed: soundEffectDismissed,
                        dismissible: true
                    })
                }
            })
        },
        error: (message: React.ReactNode = branding.messages.error) => {
            retoast({
                key: randomKey,
                body: reloader,
                duration: 1,
                placement,
                variant: 'info',
                onUnmount: () => {
                    retoast({
                        body: (
                            <div className={classNames("toaster-content", null, className)}>
                                <Icon name="exclamation-circle"/><div className="toaster-message">{message}</div>
                            </div>
                        ),
                        variant: 'danger',
                        duration,
                        placement,
                        onMount: soundEffectIn,
                        onDismissed: soundEffectDismissed,
                        dismissible: true
                    })
                }
            })
        }
    }
}

Toaster.success = (message: React.ReactNode, {className, duration = 10000, placement = 'top-right'}: ToasterOptions = {}) => {
    retoast({
        body: (
            <div className={classNames("toaster-content", null, className)}>
                <Icon name="check" /><div className="toaster-message">{message}</div>
            </div>
        ),
        variant: 'success',
        duration,
        placement,
        onMount: soundEffectIn,
        onDismissed: soundEffectDismissed,
        dismissible: true
    })
}

Toaster.fail = (message: React.ReactNode = <span style={{fontSize: '14px'}}>{branding.messages.fail}</span>, {className, duration = 10000, placement = 'top-right'}: ToasterOptions = {}) => {
    retoast({
        body: (
            <div className={classNames("toaster-content", null, className)}>
                <Icon name="exclamation-triangle"/><div className="toaster-message">{message}</div>
            </div>
        ),
        variant: 'warning',
        duration,
        placement,
        onMount: soundEffectIn,
        onDismissed: soundEffectDismissed,
        dismissible: true
    })
}

Toaster.info = (message: React.ReactNode, {className, duration = 10000, placement = 'top-right'}: ToasterOptions = {}) => {
    retoast({
        body: (
            <div className={classNames("toaster-content", null, className)}>
                <Icon name="info-circle"/><div className="toaster-message">{message}</div>
            </div>
        ),
        variant: 'info',
        duration,
        placement,
        onMount: soundEffectIn,
        onDismissed: soundEffectDismissed,
        dismissible: true
    })
}

Toaster.error = (message: React.ReactNode = branding.messages.error, {className, duration = 10000, placement = 'top-right'}: ToasterOptions = {}) => {
    retoast({
        body: (
            <div className={classNames("toaster-content", null, className)}>
                <Icon name="exclamation-circle"/><div className="toaster-message">{message}</div>
            </div>
        ),
        variant: 'danger',
        duration,
        placement,
        onMount: soundEffectIn,
        onDismissed: soundEffectDismissed,
        dismissible: true
    })
}

type RetoastProps = Parameters<typeof retoast>["0"];

export type ProgressToastProps = Omit<RetoastProps, "body"> & { 
    progress: number;
    progressVariant?: RetoastProps["variant"]
    body?: React.ReactNode;
}

Toaster.progress = ({progress, body, progressVariant, className, ...props}: ProgressToastProps) => {
    retoast({
        onMount: soundEffectIn,
        onDismissed: soundEffectDismissed,
        duration: 0,
        ...props,
        body: (
            <div className={classNames("toaster-content toaster-progress", null, className)}>
                {body}
                <ProgressBar variant={progressVariant} animated label={`${progress}%`} now={progress}/>
            </div>
        )
    })
}

Toaster.retoast = (props: RetoastProps) => {
    retoast({
        onMount: soundEffectIn,
        onDismissed: soundEffectDismissed,
        ...props
    })
}

export default Toaster
