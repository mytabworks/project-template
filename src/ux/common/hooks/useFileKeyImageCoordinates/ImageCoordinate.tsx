import React, { useState } from 'react'
import Icon from '../../../components/Icon';
import Image from '../../../components/Image';


interface ImageCoordinateProps {
    url: string;
    mutatedDimension: { height: number, width: number; };
    dimension: { height: number, width: number; };
    zoomStep?: number; 
    coordinates: {
        x: number;
        y: number;
        offset?: { x: number, y: number };
        [name: string]: any;
    }[];
    Component: React.ElementType;
}

const ImageCoordinate: React.FunctionComponent<ImageCoordinateProps> = ({url, mutatedDimension, dimension, coordinates, zoomStep = 0.3, Component}) => {
    const [zoom, setZoom] = useState<number>(1)
    return (
        <div className="coordinate-image">
            <div className="coordinate-image-action-container">
                <div className="coordinate-image-action" onClick={() => setZoom(prev => Math.min(15, prev + zoomStep))}>
                    <Icon name="search-plus" />
                </div>
                <div className="coordinate-image-action" onClick={() => setZoom(prev => Math.max(1, prev - zoomStep))}>
                    <Icon name="search-minus" />
                </div>
            </div>
            <div className="coordinate-image-content" style={{transform: `scale(${zoom})`}}>
                <Image src={url} 
                    transparent 
                    facadeStyle={{height: mutatedDimension.height, width: mutatedDimension.width}} 
                    style={{
                        maxHeight: mutatedDimension.height, 
                        maxWidth: mutatedDimension.width
                    }}/>
                {coordinates.map(({x, y, offset = {x: 30, y: 30}, ...props}, index) => {
                    const location = {
                        y: (y/dimension.height) * mutatedDimension.height,
                        x: (x/dimension.width) * mutatedDimension.width,
                    }

                    return (
                        <Component key={index} className="coordinate-image-pin" 
                            {...props}
                            style={{ 
                                top: `${((location.y - offset.y) / mutatedDimension.height) * 100}%`, 
                                left: `${((location.x - offset.x) / mutatedDimension.width) * 100}%`
                            }}/>
                    )
                })}
            </div>
        </div>
    )
}

export default ImageCoordinate
