import React, { useState } from "react"
import ModalFullScreen from "../../../components/Modal/FullScreen";
import { useAuthAPI } from "../useAuthAPI";
import ImageCoordinate from "./ImageCoordinate";
import './index.scss';

export const useFileKeyImageCoordinates = () => {
    const [viewLoading, setViewLoading] = useState<boolean>(false)
    const requestFileURL = useAuthAPI('/api/FileURL')
    
    const showImageWithCoordinates = async ({
        as: Component = 'div',
        fileKey, 
        zoomStep,
        coordinates
    }: {
        fileKey: string,
        as?: React.ElementType;
        zoomStep?: number;
        coordinates: {
            x: number; 
            y: number;
            offset?: { x: number, y: number };
            onClick?: () => void;
            [prop: string]: any;
        }[]
    }) => {
        
        requestFileURL.call({
            data: {
                fileKey,
                forceDownload: true,
                thumbnail: true
            }
        })
        .then(async (response) => {
            const dimension = await new Promise<HTMLImageElement>((resolve) => {
                const image = new window.Image()
                image.onload = () => {
                    resolve(image)
                    setViewLoading(false)
                }
                image.src = response.data.url
                setViewLoading(true)
            })
            const standardHeight = window.innerHeight - 50
            const isHeightHigher = standardHeight < dimension.height
            const mutatedDimension = isHeightHigher ? {
                width: (dimension.width/standardHeight) * standardHeight,
                height: standardHeight
            } : {
                width: 1200,
                height: (dimension.height/dimension.width) * 1200
            }

            // const mutatedDimension = {
            //     width: dimension.width,
            //     height: dimension.height
            // }

            // const constraintWidth = window.innerWidth <= 1200 ? window.innerWidth : 1200

            // const widthAlignmentToInnerHeight = ((dimension.width/dimension.height) * window.innerHeight)
            // const heightAlignmentToInnerWidth = ((dimension.height/dimension.width) * constraintWidth)
            
            // if(dimension.height >= window.innerHeight && heightAlignmentToInnerWidth > window.innerHeight) {
            //     mutatedDimension.height = window.innerHeight
            //     mutatedDimension.width = widthAlignmentToInnerHeight
            // } else if(dimension.width >= constraintWidth && widthAlignmentToInnerHeight > constraintWidth) {
            //     mutatedDimension.width = constraintWidth
            //     mutatedDimension.height = heightAlignmentToInnerWidth
            // }

            ModalFullScreen({
                children: (
                    <ImageCoordinate url={response.data.url} zoomStep={zoomStep} mutatedDimension={mutatedDimension} dimension={dimension} Component={Component} coordinates={coordinates} />
                )
            })
        })
    }

    return {
        loading: viewLoading || requestFileURL.loading,
        showImageWithCoordinates
    }
}