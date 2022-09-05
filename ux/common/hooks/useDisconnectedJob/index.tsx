import React from "react"
import Icon from "../../../components/Icon"
import ModalView from "../../../components/Modal/View"
import Button from "../../../components/Button"
import Toaster, { ProgressToastProps } from "../../../components/Toaster"
import { useAuthAPI } from "../useAuthAPI"
import "./index.scss"

type UseDisconnectedJobProps = {
    interval?: number;
    showOutputMessage?: boolean;
    showToaster?: boolean;
    defaultSuccessMessage?: string;
    defaultFailMessage?: string;
    toasterProps?: Partial<ProgressToastProps>;
}

export const useDisconnectedJob = (props: UseDisconnectedJobProps = {}) => {
    const {
        interval = 500,
        showOutputMessage = true, 
        showToaster = false,
        toasterProps,
        defaultSuccessMessage = "Success",
        defaultFailMessage = "Failed"
    } = props

    const requestDisconnectedJob = useAuthAPI('')

    return {
        ...requestDisconnectedJob,
        loading: requestDisconnectedJob.loading || requestDisconnectedJob.response?.complete === false,
        call: (disconnectedJobID: number) => {
            requestDisconnectedJob.setResponse(
                !!requestDisconnectedJob.response 
                    ? {...requestDisconnectedJob.response, percentageComplete: null} 
                    : null
            )

            const randomKey = toasterProps?.key || `${Math.random()}`

            if(showToaster) {
                Toaster.progress({
                    placement: 'bottom-right',
                    progress: 0,
                    ...toasterProps,
                    key: randomKey,
                    duration: 0,
                })
            }

            return new Promise((resolve, reject) => {
                let stop = false
                const disconnectedJob = () => {
                    requestDisconnectedJob.call({
                        method: 'GET',
                        url: `/api/DisconnectedJobStatus/${disconnectedJobID}`,
                    }).then((response) => {
                        if(stop) return
                        const predefinedProgress = toasterProps?.progress || 0
                        const percentageComplete = response.data?.percentageComplete || 0
                        const finalPercentage = predefinedProgress < percentageComplete ? percentageComplete : predefinedProgress

                        if(showToaster) {
                            Toaster.progress({
                                placement: 'bottom-right',
                                ...toasterProps,
                                key: randomKey,
                                progress: finalPercentage,
                                duration: 0,
                            })
                        }

                        if(response.data.errored) {
                            stop = true
                            clearInterval(clear)
            
                            reject({ response })

                            if(showToaster) {
                                Toaster.progress({
                                    placement: 'bottom-right',
                                    ...toasterProps,
                                    key: randomKey,
                                    progress: finalPercentage,
                                    duration: 1,
                                    onUnmount: () => {
                                        Toaster.fail(response.data.outputMessage || defaultFailMessage)
                                    }
                                })
                            }

                            if(showOutputMessage) {
                                ModalView({
                                    title: '',
                                    className: 'disconnected-job-modal',
                                    centered: true,
                                    body: (
                                        <>
                                            
                                            <Icon name="times-circle" className="icon text-danger"/>
                                            <p className="text-content text-mute">{response.data.outputMessage || defaultFailMessage}</p>
                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                onClick={(event: any) => {
                                                    event.target?.closest('.modal')?.querySelector('.modal-header button')?.click()
                                                }}
                                                >
                                                Close
                                            </Button>
                                        </>
                                    )
                                })
                            }
                        } else if(response.data.complete) {
                            stop = true
                            clearInterval(clear)
            
                            resolve(response)

                            if(showToaster) {
                                Toaster.progress({
                                    placement: 'bottom-right',
                                    ...toasterProps,
                                    key: randomKey,
                                    progress: finalPercentage,
                                    duration: 1,
                                    onUnmount: () => {
                                        Toaster.success(response.data.outputMessage || defaultSuccessMessage)
                                    }
                                })
                            }

                            if(showOutputMessage) {
                                ModalView({
                                    title: '',
                                    className: 'disconnected-job-modal',
                                    centered: true,
                                    body: (
                                        <>
                                            
                                            <Icon name="check-circle" className="icon text-success"/>
                                            <p className="text-content text-mute">{response.data.outputMessage || defaultSuccessMessage}</p>
                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                onClick={(event: any) => {
                                                    event.target?.closest('.modal')?.querySelector('.modal-header button')?.click()
                                                }}
                                                >
                                                Close
                                            </Button>
                                        </>
                                    )
                                })
                            }
                        }
                    })
                    .catch((error) => {
                        if(stop) return
                        reject(error)
                        stop = true
                        clearInterval(clear)
                    })
                }
                const clear = setInterval(disconnectedJob, interval)
                disconnectedJob()
            })
        }
    }
}